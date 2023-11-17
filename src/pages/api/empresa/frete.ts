import db from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";

type FreteResponse = {
  freteGratis: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<FreteResponse | string>) {
  if (req.method === "GET") {
    try {
      let freteGratis = await db("Empresa").select("FreteGratisWeb").where("CodEmp", "1").first();

      freteGratis = freteGratis.FreteGratisWeb;

      return res.status(200).json({ freteGratis });
    } catch (error: any) {
      return res.status(400).json(error.message);
    }
  }
}
