import db from "@/db/db";
import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import xml2js from "xml2js";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Permite que todas as origens acessem
  if (req.method === "POST") {
    const { dadosPessoais, dadosTelefone, endereco, formattedProducts, valorCompra, CodCli, valorFrete, notificationCode, notificationType } = req.body;
    // 1. Obtenha a última venda
    let ultimaVenda = await db("numero").select("Venda").first();
    let valorAtualizado = ultimaVenda.Venda + 1; // Adicione 1 ao valor da última venda

    //Vai entrar aqui caso o WEBHOOK Seja ativo, ou seja, será uma notificacao de que aquele pagamento mudou.
    if (notificationCode && notificationType) {
      let credenciais = {
        email: "robsonnonatoiii@gmail.com",
        token_api: "B871F6967C2341489D37924D761FF1BD",
      };

      const url = `https://ws.sandbox.pagseguro.uol.com.br/v3/transactions/notifications/${notificationCode}?email=${credenciais.email}&token=${credenciais.token_api}`;

      try {
        const response = await axios.get(url);

        // Converter o XML para um objeto JavaScript
        xml2js.parseString(response.data, async (err: any, result: any) => {
          if (err) {
            console.error("Erro ao converter o XML:", err);
            return;
          }

          // Colocar o Status em um campo, pois ele representa se a venda está paga ou aguardando pagamento, e mais 7 status
          const statusPagamento = result.transaction.status;

          // Colocando o Enterprise a ultima atualizacao de LOG.
          const insertLogOnRequisi = await db("requisi").insert({ Observacao: result.transaction });
        });
        return res.json("Recebido e inserido no banco!");
      } catch (error) {
        console.log("Erro ao buscar detalhes da notificação:", error);
        return res.status(500).json("Erro ao processar notificação");
      }
    }

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
        notification_urls: ["http://10.0.0.169:3000/api/vendas/boleto"],
        charges: [
          {
            reference_id: valorAtualizado,
            description: "Boleto Softline Sistemas",
            amount: { value: Math.round(valorCompra * 100), currency: "BRL" },
            payment_method: {
              type: "BOLETO",
              boleto: {
                due_date: moment().add(3, "days").format("YYYY-MM-DD"),
                instruction_lines: { line_1: "Pagamento processado para DESC Fatura", line_2: "Via PagSeguro" },
                holder: {
                  name: dadosPessoais.name,
                  tax_id: dadosPessoais.cpfCnpj.replace(/[.-]/g, ""),
                  email: dadosPessoais.email.toLowerCase(),
                  address: {
                    country: "Brasil",
                    region: endereco.Cidade,
                    region_code: endereco.Estado,
                    number: endereco.Numero,
                    city: endereco.Cidade,
                    postal_code: endereco.CEP.replace("-", ""),
                    street: endereco.Endereco,
                    locality: endereco.Bairro,
                  },
                },
              },
            },
          },
        ],
      },
    };

    try {
      const response = await axios.post(options.url, options.data, {
        headers: options.headers,
      });
      //! Se o Status é OK, ou seja, foi gerado o BOLETO, vamos agir no Enterprise
      if (response.data.charges[0].payment_response.code === "20000") {
        const dataAtual = moment().startOf("day"); // Zera horas, minutos, segundos e milissegundos
        const dataFormatada = dataAtual.format("YYYY-MM-DD HH:mm:ss.SSS");

        // 2. Atualize o valor da venda na tabela
        await db("numero").update({ Venda: valorAtualizado });
        // 3. Inserir em Requisi
        const inserirVendaRequisi = await db("requisi").insert({
          Pedido: valorAtualizado,
          Data: dataFormatada,
          Tipo: "PEDIDO",
          CodCli: CodCli,
          Observacao: response.data,
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
        return res.status(200).json({ message: "Venda concluída no banco de dados", idVenda: valorAtualizado, data: response.data });
      }
    } catch (error: any) {
      return res.json(error.response.data);
    }
  }
  return res.status(500).end(); // Proibir caso a requisição nao seja POST
}
