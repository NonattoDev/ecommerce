import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const address = req.body.address;
    try {
      const response = await client.geocode({
        params: {
          address: address,
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API || "",
        },
      });

      const { lat, lng } = response.data.results[0].geometry.location;
      res.status(200).json({ lat, lng });
    } catch (error) {
      res.status(500).json({ error: "Erro na Geocodificação" });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
