import { NextApiRequest, NextApiResponse } from "next";
import AWS from "aws-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Verifica se o nome do bucket está definido
    const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
    if (!bucketName) {
      return res.status(500).json({ message: "Nome do bucket não configurado" });
    }

    const s3 = new AWS.S3({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
      endpoint: process.env.NEXT_PUBLIC_AWS_S3_ENDPOINT,
      s3ForcePathStyle: true,
    });

    const params = {
      Bucket: bucketName,
      Prefix: "banners/",
    };

    try {
      const data = await s3.listObjectsV2(params).promise();
      return res.status(200).json(data.Contents?.map((file) => file.Key) || []);
    } catch (error: any) {
      return res.status(500).json({ message: "Erro ao listar objetos do S3", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
