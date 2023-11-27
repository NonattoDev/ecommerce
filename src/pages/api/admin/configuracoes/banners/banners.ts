import { NextApiRequest, NextApiResponse } from "next";
import AWS from "aws-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Lógica para lidar com a requisição GET aqui
    const s3 = new AWS.S3({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
      endpoint: process.env.NEXT_PUBLIC_AWS_S3_ENDPOINT, // Exemplo de endpoint do Backblaze
      s3ForcePathStyle: true, // necessário com Backblaze
    });

    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      Prefix: "banners/", // Pasta Banners
    };

    const data = await s3.listObjectsV2(params).promise();
    return res.status(200).json(data.Contents?.map((file) => file.Key) || []);
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
