import { NextApiRequest, NextApiResponse } from "next";
import { s3 } from "@/services/s3BackBlaze";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || "", // Provide a default value or ensure it is always defined
        Prefix: "banners/", // A pasta desejada.
      };

      const data = await s3.listObjectsV2(params).promise();
      const fileNames = data.Contents?.map((file) => file.Key) || [];

      return res.status(200).json(fileNames);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: "Método não permitido" });
  }
}
