import AWS from "aws-sdk";

export const s3 = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  endpoint: process.env.NEXT_PUBLIC_AWS_S3_ENDPOINT,
  s3ForcePathStyle: true,
});
