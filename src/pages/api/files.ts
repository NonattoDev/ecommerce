import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const publicFolderPath = path.join(process.cwd(), "public/imagens");
  const fileNames: string[] = fs.readdirSync(publicFolderPath);
  const fileUrls: string[] = fileNames.map((fileName) => `/imagens/${fileName}`);
  res.status(200).json(fileUrls);
}
