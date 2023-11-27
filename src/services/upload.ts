// pages/api/uploadImages.js

// Esse arquivo serve para fazer o upload das imagens para o S3 da AWS em grande quantidade

import AWS from "aws-sdk";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

const s3 = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  endpoint: process.env.NEXT_PUBLIC_AWS_S3_ENDPOINT,
  s3ForcePathStyle: true,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Caminho da pasta local com as imagens
      const localFolderPath = "public/fotosProdutos";

      const files = fs.readdirSync(localFolderPath);

      const uploadPromises = files.map((file) => {
        const filePath = path.join(localFolderPath, file);
        const fileContent = fs.readFileSync(filePath);

        const params: AWS.S3.PutObjectRequest = {
          Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || "", // Ensure that NEXT_PUBLIC_AWS_BUCKET_NAME is defined
          Key: `fotosProdutos/${file}`,
          Body: fileContent,
          ContentType: "image/jpeg", // Adjust as needed
        };

        return s3.upload(params).promise();
      });

      await Promise.all(uploadPromises);
      res.status(200).json({ message: "Imagens carregadas com sucesso" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}
