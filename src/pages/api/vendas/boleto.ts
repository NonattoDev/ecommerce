import db from "@/db/db";
import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import xml2js from "xml2js";
import transporter from "@/services/nodeMailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Permite que todas as origens acessem
  if (req.method === "POST") {
    const { dadosPessoais, dadosTelefone, endereco, formattedProducts, valorCompra, CodCli, valorFrete } = req.body;
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
        notification_urls: ["http://10.71.0.119:3000/api/vendas/boleto"],
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

        // - Chamada no banco que pega o codigo referente ao pagamento em BOLETO

        const { CodBoleto } = await db("empresa").select("CodBoleto").where("CodEmp", 1).first();

        // 3. Inserir em Requisi
        const inserirVendaRequisi = await db("requisi").insert({
          Pedido: valorAtualizado,
          Data: dataFormatada,
          Tipo: "PEDIDO",
          CodCli: CodCli,
          Observacao: "PAGAMENTO NO ECOMMERCE VIA BOLETO",
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
          CodForma1: CodBoleto,
          Data1: response.data.charges[0].payment_method.boleto.due_date,
          Parc1: 1,
          //FAZER AS MUDANÇAS DE ACORDO FORMA DE PAGAMENTO
          StatusPagamento: response.data.charges[0].status,
          CodAutorizacaoNumber: response.data.charges[0].payment_response.code,
          idStatus: response.data.id,
          idPagamento: response.data.charges[0].id,
          Nome: response.data.charges[0].payment_method.boleto.holder.name,
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

        const { email, Cliente } = await db("clientes").select("email", "Cliente").where("CodCli", CodCli).first();

        const mailOptions = {
          from: "softlinedocs@gmail.com",
          to: email,
          subject: "Seu Boleto de Pagamento Está Pronto",
          html: `
            <div style="font-family: 'Arial', sans-serif; color: #333;">
              <h2>Boleto Pendente, ${Cliente}!</h2>
              <p>Olá, ${Cliente}! 🎈</p>
              <p>Estamos contentes em informar que seu pedido no valor de <strong>R$ ${valorCompra}</strong> foi gerado com sucesso. Agora falta pouco para finalizá-lo!</p>
              <p>Detalhes do Pedido:</p>
              <p><strong>Valor a Pagar:</strong> R$ ${valorCompra}</p>
              <p><strong>Data e Hora do Pedido:</strong> ${moment().format("DD/MM/YYYY HH:mm:ss")}</p>
              <p>Não deixe para depois! Seu boleto tem data de validade e estamos ansiosos para processar seu pedido 🚚💨.</p>
              <p>Para visualizar e pagar o boleto, clique no botão abaixo:</p>
              <a href="${
                response.data?.charges[0]?.links[0]?.href
              }" target="_blank" style="background-color: #27ae60; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; transition: background-color 0.3s; font-size: 16px;">
                Visualizar Boleto
              </a>
              <p style="margin-top: 20px;">Após o pagamento, seu pedido entrará imediatamente em processo de preparação. 📦✨</p>
              <p>Lembre-se, você pode verificar o status do seu pedido a qualquer momento em nossa plataforma.</p>
              <hr>
              <p>Se tiver dúvidas ou precisar de assistência, estamos aqui para ajudar.</p>
              <p>Atenciosamente,</p>
              <p><strong>Equipe de Atendimento ao Cliente</strong></p>
              <p>SoftlineDocs</p>
            </div>
            <style>
              a:hover {
                background-color: #2ecc71;
              }
            </style>
          `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            // Se ocorrer um erro ao enviar o e-mail, você pode lidar com ele aqui
          } else {
            console.log("E-mail enviado com sucesso:");
          }
        });
        return res.status(200).json({ message: "Venda concluída no banco de dados", idVenda: valorAtualizado, data: response.data });
      }
    } catch (error: any) {
      return res.json(error.response.data);
    }
  }
  return res.status(500).end(); // Proibir caso a requisição nao seja POST
}
