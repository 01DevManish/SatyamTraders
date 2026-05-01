import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";

const region = process.env.NEXT_PUBLIC_AWS_REGION || "ap-south-1";

// DynamoDB Client
const ddbClient = new DynamoDBClient({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const db = DynamoDBDocumentClient.from(ddbClient);

// S3 Client
export const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const BUCKET_NAME = process.env.AWS_S3_BUCKET || "epanelimages";
export const S3_BASE_URL = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/`;

export function getImageUrl(imagePath: string | undefined) {
  if (!imagePath || imagePath.trim() === "") {
    return "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80"; // Premium Bedding Placeholder
  }
  
  if (imagePath.startsWith("http")) return imagePath;
  
  // Clean the path and append to base S3 URL
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  return `${S3_BASE_URL}${cleanPath}`;
}
