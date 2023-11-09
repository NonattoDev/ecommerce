import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import db from "@/db/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { dadosPessoais, dadosTelefone, endereco, formattedProducts, valorCompra, CodCli, valorFrete } = req.body;
    console.log(req.body);

    // 1. Obtenha a última venda
    let ultimaVenda = await db("numero").select("Venda").first();
    let valorAtualizado = ultimaVenda.Venda + 1; // Adicione 1 ao valor da última venda

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
        reference_id: valorAtualizado,
        items: formattedProducts,
        qr_codes: [{ amount: { value: Math.round(valorCompra * 100) }, expiration_date: moment().add(10, "minutes").format() }],
        notification_urls: ["http://10.0.0.169:3000/api/vendas/pix"],
      },
    };
    try {
      const response = await axios.post(options.url, options.data, {
        headers: options.headers,
      });

      //! So pode passar se o pix for pago
      if (response.data) {
        console.log(response.data);

        const dataAtual = moment().startOf("day"); // Zera horas, minutos, segundos e milissegundos
        const dataFormatada = dataAtual.format("YYYY-MM-DD HH:mm:ss.SSS");
        // 2. Atualize o valor da venda na tabela
        await db("numero").update({ Venda: valorAtualizado });
        // - Chamada no banco que pega o codigo referente ao pagamento em BOLETO
        const { CodPix } = await db("empresa").select("CodPix").where("CodEmp", 1).first();
        // 3. Inserir em Requisi
        const inserirVendaRequisi = await db("requisi").insert({
          Pedido: valorAtualizado,
          Data: dataFormatada,
          Tipo: "PEDIDO",
          CodCli: CodCli,
          Observacao: "PAGAMENTO NO ECOMMERCE VIA PIX",
          Tipo_Preco: 1, //
          CodCon: 0,
          CodPros: 0,
          CodEmp: 1,
          Dimensao: 2,
          CodInd: 1, //
          Status: "VENDA",
          FIB: valorFrete > 0 ? 0 : 9,
          Ecommerce: "X",
          Frete: valorFrete,
          CodForma1: CodPix,
          Data1: moment().format("YYYY-MM-DD"),
          Parc1: 1,
          //FAZER AS MUDANÇAS DE ACORDO FORMA DE PAGAMENTO
          StatusPagamento: "Waiting",
          idStatus: response.data.id,
          Nome: response.data.customer.name,
          Autorizacao: `E${valorAtualizado}`,
        });
        // 4. Inserir em Requisi1
        for (const item of response.data.items) {
          await db.raw(`Update Produto set EstoqueReservado1 = EstoqueReservado1 + ${parseFloat(item.quantity)} Where CodPro = ${parseInt(item.reference_id)}`);
          await db("requisi1").insert({
            Pedido: valorAtualizado,
            CodPro: parseInt(item.reference_id),
            qtd: parseFloat(item.quantity),
            preco: parseFloat(item.unit_amount) / 100,
            preco1: item.Preco1,
            preco2: item.Preco1,
            Situacao: "000", //
            Marca: "*",
          });
        }

        return res.status(200).json({ dadosPix: response.data.qr_codes[0], idVenda: valorAtualizado, idCharge: response.data.id });
      }
    } catch (error: any) {
      return res.json(error);
    }
  }

  if (req.method === "GET") {
    const { pixCharge } = req.query;

    const response = await axios.get(`https://sandbox.api.pagseguro.com/orders/${pixCharge}`, {
      headers: {
        Authorization: `Bearer B871F6967C2341489D37924D761FF1BD`,
      },
    });
    console.log(response.data);

    if (response?.data?.charges[0]) {
      await db("requisi")
        .where("Pedido", response.data.reference_id)
        .update({
          Observacao: JSON.stringify(response.data),
          StatusPagamento: response.data.charges[0].status,
          Pago: response.data.charges[0].paid_at,
          idPagamento: response.data.charges[0].id,
          CodigoRazao: response.data.charges[0].payment_response.code,
        });

      return res.json(response.data.charges[0]);
    }
  }
  return res.status(500).end(); // Proibir caso a requisição nao seja POST
}
