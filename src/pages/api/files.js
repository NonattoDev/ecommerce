import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const publicFolderPath = path.join(process.cwd(), "public/imagens");
  const fileNames = fs.readdirSync(publicFolderPath);
  const fileUrls = fileNames.map((fileName) => `/${fileName}`);
  res.status(200).json(fileUrls);
}
