import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpoint: process.env.AWS_S3_ENDPOINT,
  s3ForcePathStyle: true,
});

const upload = multer({ dest: "uploads/" }); // Salva arquivos na pasta 'uploads'

export const config = {
  api: {
    bodyParser: false, // Desativa o bodyParser padrão do Next.js para permitir que o multer processe o corpo
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    upload.single("file")(req as any, {} as any, async (err: any) => {
      if (err) {
        return res.status(500).json({ message: "Erro no upload do arquivo" });
      }

      const file = (req as any).file;

      const fileContent = fs.readFileSync(file.path);

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME ?? "", // Provide a default value for the Bucket property
        Key: `fotosProdutos/${file.originalname}`,
        Body: fileContent,
        ContentType: file.mimetype,
      };

      try {
        const data = await s3.upload(params).promise();

        // Remover o arquivo da pasta uploads
        fs.unlink(file.path, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Erro ao remover o arquivo:", unlinkErr);
          }
        });

        res.status(200).json({ message: "Arquivo enviado com sucesso", path: file.originalname });
      } catch (uploadError) {
        res.status(500).json({ message: "Erro ao enviar para o Backblaze" });
      }
    });
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
