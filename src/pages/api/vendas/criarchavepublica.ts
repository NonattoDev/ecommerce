import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const response = await axios.post(
        `${process.env.PAGSEGURO_URL}/public-keys`,
        { type: "card" },
        {
          headers: {
            Authorization: process.env.PAGSEGURO_BEARER_TOKEN,
          },
        }
      );

      return res.status(200).json(response.data);
    } catch (error: any) {
      console.error(error.response);
      return res.status(500).json({ message: error.response.data });
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
