// pages/api/getImages.ts

import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/db/db";
import path from "path";
import { s3 } from "@/services/s3BackBlaze";

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
          Bucket: process.env.AWS_BUCKET_NAME,
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
