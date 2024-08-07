import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

// Criando uma interface para a resposta esperada da API do PagSeguro
interface PagSeguroResponse {
  // Defina aqui os campos que você espera receber da API do PagSeguro
}

// Criando uma interface para o caso de erro na resposta
interface ErrorResponse {
  message: string;
}

export default async function calculoJurosCartao(req: NextApiRequest, res: NextApiResponse<PagSeguroResponse | ErrorResponse>) {
  if (req.method === "GET") {
    try {
      const { totalAmount, numeroCartao } = req.query as { totalAmount: string; numeroCartao: string };

      const options = {
        url: `${process.env.PAGSEGURO_URL}/charges/fees/calculate`,
        params: {
          payment_methods: "CREDIT_CARD",
          value: totalAmount,
          max_installments: process.env.PAGSEGURO_MAX_INSTALLMENTS,
          max_installments_no_interest: 0,
          credit_card_bin: numeroCartao.replace(/\s/g, "").slice(0, 6),
        },
        headers: {
          accept: "application/json",
          Authorization: process.env.PAGSEGURO_BEARER_TOKEN,
        },
      };

      const response = await axios.get<PagSeguroResponse>(options.url, options);

      

      return res.json(response.data);
    } catch (error: any) {
      console.log(error);
      console.log(error.response.data);
      error.response.data.message ? console.log(error.response.data.message) : console.log(error.message);
      if (axios.isAxiosError(error) && error.response) {
        return res.status(error.response.status).json(error.response.data);
      }
      return res.status(500).json({ message: "Erro ao calcular juros do cartão" });
    }
  } else {
    return res.status(405).json({ message: "Método não permitido" });
  }
}
