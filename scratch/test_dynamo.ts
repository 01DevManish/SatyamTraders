import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import fs from 'fs';

async function testDynamo() {
  const client = new DynamoDBClient({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });
  const docClient = DynamoDBDocumentClient.from(client);

  try {
    const response = await docClient.send(new ScanCommand({ TableName: "inventory", Limit: 5 }));
    fs.writeFileSync('dynamo_sample.json', JSON.stringify(response.Items, null, 2));
    console.log("Sample data written to dynamo_sample.json");
  } catch (error) {
    console.error("Error:", error);
  }
}

testDynamo();
