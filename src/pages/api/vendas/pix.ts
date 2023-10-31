import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("cai aqui");

  if (req.method === "POST") {
    const { dadosPessoais, dadosTelefone, endereco, formattedProducts, valorCompra, CodCli, valorFrete } = req.body;

    const options = {
      method: "POST",
      url: "https://sandbox.api.pagseguro.com/orders",
      headers: {
        accept: "application/json",
        Authorization: "Bearer B871F6967C2341489D37924D761FF1BD",
        "content-type": "application/json",
      },
      data: {
        customer: {
          name: dadosPessoais.name,
          email: dadosPessoais.email.toLowerCase(),
          tax_id: dadosPessoais.cpfCnpj.replace(/[.-]/g, ""),
          phones: [{ country: "55", area: dadosTelefone.area, number: dadosTelefone.number, type: "MOBILE" }],
        },
        shipping: {
          address: {
            street: endereco.Endereco,
            number: endereco.Numero,
            complement: endereco.ComplementoEndereco,
            locality: endereco.Bairro,
            city: endereco.Cidade,
            region_code: endereco.Estado,
            country: "BRA",
            postal_code: endereco.CEP.replace("-", ""),
          },
        },
        reference_id: "Pagamento_pix",
        items: formattedProducts,
        qr_codes: [{ amount: { value: Math.round(valorCompra * 100) }, expiration_date: moment().add(10, "minutes").format() }],
        notification_urls: ["http://10.0.0.169:3000/api/vendas/pix"],
      },
    };

    try {
      const response = await axios.post(options.url, options.data, {
        headers: options.headers,
      });
      //! Se o Status é OK, ou seja, foi gerado o PIX, vamos agir no Enterprise
      //   if (response.data.charges[0].payment_response.code === "20000") {
      //     const dataAtual = moment().startOf("day"); // Zera horas, minutos, segundos e milissegundos
      //     const dataFormatada = dataAtual.format("YYYY-MM-DD HH:mm:ss.SSS");

      //     // 1. Obtenha a última venda
      //     let ultimaVenda = await db("numero").select("Venda").first();
      //     let valorAtualizado = ultimaVenda.Venda + 1; // Adicione 1 ao valor da última venda
      //     // 2. Atualize o valor da venda na tabela
      //     await db("numero").update({ Venda: valorAtualizado });
      //     // 3. Inserir em Requisi
      //     const inserirVendaRequisi = await db("requisi").insert({
      //       Pedido: valorAtualizado,
      //       Data: dataFormatada,
      //       Tipo: "PEDIDO",
      //       CodCli: CodCli,
      //       Observacao: response.data,
      //       Tipo_Preco: 1, //
      //       CodCon: 0,
      //       CodPros: 0,
      //       CodEmp: 1,
      //       Dimensao: 2,
      //       CodInd: 1, //
      //       Status: "VENDA",
      //       FIB: valorFrete > 0 ? 0 : 9,
      //       Ecommerce: "X",
      //       Frete: valorFrete,
      //     });
      //     // 4. Inserir em Requisi1
      //     for (const item of response.data.items) {
      //       await db.raw(`Update Produto set EstoqueReservado1 = EstoqueReservado1 + ${parseFloat(item.quantity)} Where CodPro = ${parseInt(item.reference_id)}`);
      //       await db("requisi1").insert({
      //         Pedido: valorAtualizado,
      //         CodPro: parseInt(item.reference_id),
      //         qtd: parseFloat(item.quantity),
      //         preco: parseFloat(item.unit_amount) / 100,
      //         preco1: item.Preco1,
      //         preco2: item.Preco1,
      //         Situacao: "000", //
      //         Marca: "*",
      //       });
      //     }
      //     return res.status(200).json({ message: "Venda concluída no banco de dados", idVenda: valorAtualizado, data: response.data });
      //   }

      return res.json(response.data.qr_codes[0]);
    } catch (error: any) {
      return res.json(error.response.data);
    }
  }
  return res.status(500).end(); // Proibir caso a requisição nao seja POST
}
