import db from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const produtos = await db("produtos").select("*");

    return res.status(200).json(produtos);
  }
}
