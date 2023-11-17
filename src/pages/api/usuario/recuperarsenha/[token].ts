import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function recuperarSenhaToken(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    let { token } = req.query;
    // Garantindo que 'token' seja uma string
    if (Array.isArray(token)) {
      token = token[0];
    }
    try {
      if (!token) return res.status(401).json({ message: "Token inválido" });
      const decodedToken = jwt.verify(token, "OdXFNuFU4BJOmfkYMYhy195IMcM");
      // Verificação bem-sucedida, você pode usar o conteúdo decodificado do token
      return res.json(decodedToken);
    } catch (error: any) {
      return res.status(401).json({ message: "Token inválido" });
    }
  }
}
