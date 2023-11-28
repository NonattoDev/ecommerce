import fs from "fs";
import { log } from "console";
import { NextApiRequest, NextApiResponse } from "next";
import AWS from "aws-sdk";
import multer from "multer";
import { s3 } from "@/services/s3BackBlaze";

const upload = multer({ dest: "uploads/" }); // Salva arquivos na pasta 'uploads'
export const config = {
  api: {
    bodyParser: false, // Desativa o bodyParser padrão do Next.js para permitir que o multer processe o corpo
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Verifica se o nome do bucket está definido
    const bucketName = process.env.AWS_BUCKET_NAME;
    if (!bucketName) {
      return res.status(500).json({ message: "Nome do bucket não configurado" });
    }

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
  }

  if (req.method === "DELETE") {
    const { banner } = req.query;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME ?? "",
      Key: `banners/${banner}`,
    };

    try {
      const data = await s3.deleteObject(params).promise();
      return res.status(200).json(data);
    } catch (error: any) {
      log(error);
      return res.status(500).json({ message: "Erro ao deletar objeto do S3", error: error.message });
    }
  }

  if (req.method === "POST") {
    upload.single("banner")(req as any, {} as any, async (err: any) => {
      if (err) {
        return res.status(500).json({ message: "Erro no upload do arquivo" });
      }

      const file = (req as any).file;

      if (!file) {
        console.log("Arquivo não enviado");
        return res.status(400).json({ message: "Arquivo não enviado" });
      }

      //Enviar para o backblaze
      try {
        const fileContent = fs.readFileSync(file.path);

        const params = {
          Bucket: process.env.AWS_BUCKET_NAME ?? "",
          Key: `banners/${file.originalname}`,
          Body: fileContent,
          ContentType: file.mimetype,
        };
        const data = await s3.upload(params).promise();

        // Remover o arquivo da pasta uploads
        fs.unlink(file.path, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Erro ao remover o arquivo:", unlinkErr);
          }
        });

        return res.status(200).json({ message: "Arquivo enviado com sucesso", path: file.originalname });
      } catch (error) {
        log(error);
        return res.status(400).json({ message: "Erro ao salvar imagem" });
      }
    });
  }
}
