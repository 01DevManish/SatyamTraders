import { NextRequest, NextResponse } from "next/server";
import {
  ListObjectsV2Command,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";
import { s3, BUCKET_NAME, S3_BASE_URL } from "@/lib/aws";
import { cloudinaryReady, uploadToCloudinary } from "@/lib/cloudinary";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get("prefix") || "inventory/images/";
    const search = searchParams.get("search")?.toLowerCase() || "";
    const cursor = searchParams.get("cursor") || undefined;
    const maxKeys = parseInt(searchParams.get("limit") || "100");

    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: search ? "inventory/images/" : prefix,
      Delimiter: search ? undefined : "/",
      MaxKeys: maxKeys,
      ContinuationToken: cursor,
    });

    const response = await s3.send(command);

    let folders =
      response.CommonPrefixes?.map((p) => ({
        key: p.Prefix!,
        name: p.Prefix!.replace(prefix, "").replace("/", ""),
        type: "folder" as const,
        url: "",
      })) || [];

    let files =
      response.Contents?.filter((obj) => obj.Key !== prefix && !obj.Key?.endsWith("/"))
        .map((obj) => ({
          key: obj.Key!,
          name: obj.Key!.split("/").pop() || obj.Key!,
          type: "file" as const,
          lastModified: obj.LastModified,
          size: obj.Size,
          url: `${S3_BASE_URL}${obj.Key}`,
        })) || [];

    if (search) {
      files = files.filter(
        (f) => f.name.toLowerCase().includes(search) || f.key.toLowerCase().includes(search)
      );
      folders = [];
    }

    return NextResponse.json({
      items: [...folders, ...files],
      nextCursor: response.NextContinuationToken,
      isTruncated: response.IsTruncated,
      currentPrefix: prefix,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("S3 Get Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let action = "upload";

  try {
    const { searchParams } = new URL(request.url);
    action = searchParams.get("action") || "upload";

    if (action === "upload") {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      const prefix = (formData.get("prefix") as string) || "inventory/images/";

      if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

      if (cloudinaryReady()) {
        const url = await uploadToCloudinary(file, "satyam-trders/products");
        return NextResponse.json({ success: true, url, provider: "cloudinary" });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const key = `${prefix}${file.name}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: file.type,
        })
      );

      return NextResponse.json({ success: true, url: `${S3_BASE_URL}${key}`, provider: "s3" });
    }

    if (action === "create-folder") {
      const { name, prefix } = (await request.json()) as { name?: string; prefix: string };
      if (!name) return NextResponse.json({ error: "Folder name required" }, { status: 400 });

      const key = `${prefix}${name}/`;
      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
          Body: "",
        })
      );

      return NextResponse.json({ success: true });
    }

    if (action === "bulk-delete") {
      const { keys } = (await request.json()) as { keys?: string[] };
      if (!keys || keys.length === 0)
        return NextResponse.json({ error: "Keys required" }, { status: 400 });

      await s3.send(
        new DeleteObjectsCommand({
          Bucket: BUCKET_NAME,
          Delete: {
            Objects: keys.map((key: string) => ({ Key: key })),
          },
        })
      );

      return NextResponse.json({ success: true });
    }

    if (action === "bulk-move") {
      const { keys, targetPrefix } = (await request.json()) as {
        keys?: string[];
        targetPrefix?: string;
      };
      if (!keys || !targetPrefix)
        return NextResponse.json({ error: "Keys and target required" }, { status: 400 });

      for (const key of keys) {
        const fileName = key.split("/").pop();
        const targetKey = `${targetPrefix}${fileName}`;

        await s3.send(
          new CopyObjectCommand({
            Bucket: BUCKET_NAME,
            CopySource: `${BUCKET_NAME}/${key}`,
            Key: targetKey,
          })
        );

        await s3.send(
          new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
          })
        );
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Drive Action Error [${action}]:`, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    if (!key) return NextResponse.json({ error: "Key required" }, { status: 400 });

    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
