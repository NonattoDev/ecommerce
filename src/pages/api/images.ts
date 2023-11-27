// pages/api/getImages.ts

import type { NextApiRequest, NextApiResponse } from "next";
import AWS from "aws-sdk";
import db from "@/db/db";
import path from "path";

const s3 = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  endpoint: process.env.NEXT_PUBLIC_AWS_S3_ENDPOINT,
  s3ForcePathStyle: true,
});

const apiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") return res.status(405).end();

  const produtosCaminho = await db("produto").select("caminho").limit(10);

  const nomesArquivos = produtosCaminho.map((produto) => {
    const caminho = produto.caminho;
    if (caminho) {
      return path.basename(caminho);
    }
    return null;
  });

  try {
    const fileNames: string[] = nomesArquivos.filter((nomeArquivo) => nomeArquivo !== null) as string[]; // Array de nomes de arquivo.
    const urls = await Promise.all(
      fileNames.map((fileName: string) => {
        const params = {
          Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
          Key: fileName,
          Expires: 60, // URL expira em 60 segundos, ajuste conforme necessário.
        };
        return s3.getSignedUrlPromise("getObject", params);
      })
    );

    res.status(200).json({ urls });
  } catch (error: any) {
    res.status(500).json({ error: `Erro ao buscar URLs: ${error.message}` });
  }
};

export default apiHandler;
