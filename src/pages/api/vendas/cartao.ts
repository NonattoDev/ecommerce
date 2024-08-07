import { NextApiRequest, NextApiResponse } from "next";
import db from "@/db/db";
import moment from "moment";
import axios from "axios";
import transporter from "@/services/nodeMailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Permite que todas as origens acessem
  if (req.method === "POST") {
    try {
      let { dadosPessoais, formattedProducts, totalAmount, endereco, parcelaSelecionada, CodCli, valorFrete, encryptedCardData } = req.body;

      //Tratando para mandar para a PAGSEGURO
      if (parcelaSelecionada === 0) {
        parcelaSelecionada = 1;
      }

      const CEPFormatado = endereco.CEP.replace(/\D/g, "");

      const telefone = dadosPessoais.telefone;
      const regex = /^\(?(?:(\d{2})\)?\s?)?(\d{5}-\d{4})$/;

      const match = telefone.match(regex);
      if (!match) {
        return res.status(400).json({ message: "Telefone inválido" });
      }

      const ddd = match[1];
      const numero = match[2].replace("-", ""); // Remover o hífen usando a função replace

      const cpfCNPJ = (dadosPessoais.cpfCnpj = dadosPessoais.cpfCnpj.replace(/\D+/g, ""));
      // 1. Obtenha a última venda
      let ultimaVenda = await db("numero").select("Venda").first();
      let valorAtualizado = ultimaVenda.Venda + 1; // Adicione 1 ao valor da última venda

      // 2. Atualize o valor da venda na tabela
      await db("numero").update({ Venda: valorAtualizado });

      // Verifica se o frete existe e adiciona como um item
      if (valorFrete && valorFrete !== 0) {
        // Certifique-se de que valorFrete é um número para o cálculo
        valorFrete = Number(valorFrete);

        const freteComoProduto = {
          reference_id: "99999", // Um ID único para o item de frete
          name: "FRETE",
          quantity: 1,
          unit_amount: Math.round(valorFrete * 100), // Multiplica por 100, se valorFrete for um valor em reais
        };

        // Adiciona o item de frete no array de produtos
        formattedProducts.push(freteComoProduto);
      }

      const options = {
        method: "POST",
        url: `${process.env.PAGSEGURO_URL}/orders`,
        headers: {
          accept: "application/json",
          Authorization: process.env.PAGSEGURO_BEARER_TOKEN,
          "content-type": "application/json",
        },
        data: {
          reference_id: "credit_card-00001",
          customer: {
            name: dadosPessoais.nomeCompleto,
            email: dadosPessoais.email,
            tax_id: cpfCNPJ,
            phones: [{ country: "55", area: ddd, number: numero, type: "MOBILE" }],
          },
          items: formattedProducts,
          shipping: {
            address: {
              street: endereco.Endereco,
              number: endereco.Numero,
              complement: endereco.ComplementoEndereco,
              locality: endereco.Bairro,
              city: endereco.Cidade,
              region_code: endereco.Estado,
              country: "BRA",
              postal_code: CEPFormatado,
            },
          },
          notification_urls: [`${process.env.NEXTAUTH_URL}/api/vendas/notificacao`],
          charges: [
            {
              reference_id: valorAtualizado,
              description: "Teste API PagSeguro",
              amount: { value: Math.round(totalAmount * 100), currency: "BRL" },
              payment_method: {
                type: "CREDIT_CARD",
                installments: parcelaSelecionada,
                capture: true,
                card: {
                  encrypted: encryptedCardData,
                  store: true,
                },
              },
            },
          ],
        },
      };

      const dataAtual = moment().startOf("day"); // Zera horas, minutos, segundos e milissegundos

      const dataFormatada = dataAtual.format("YYYY-MM-DD HH:mm:ss.SSS");

      try {
        const response = await axios.post(options.url, options.data, {
          headers: options.headers,
        });

        // const fs = require("fs");
        // // gerar com fs um json do reponse.data
        // fs.writeFile("Response.json", JSON.stringify(response.data), function (err: any) {
        //   if (err) throw err;
        //   console.log("Saved!");
        // });
        // // Gerar um json do options.data
        // fs.writeFile("Request.json", JSON.stringify(options.data), function (err: any) {
        //   if (err) throw err;
        //   console.log("Saved!");
        // });

        //! Se o Status é OK, ou seja, o cartao autorizou
        if (response.data.charges[0].payment_response.code === "20000") {
          try {
            let { CodInd } = await db("Clientes").where("CodCli", CodCli).select("CodInd").first();
            if (CodInd === null) {
              CodInd = await db("Indicado")
                .select("CodInd")
                .where("CodSeg", 1)
                .andWhere(function () {
                  this.where("Inativo", "F").orWhereNull("Inativo");
                })
                .andWhere("statusFila", "FILA")
                .orderBy("CodInd")
                .first();

              if (!CodInd) {
                await db("Indicado")
                  .where("CodSeg", 1)
                  .andWhere(function () {
                    this.where("Inativo", "F").orWhereNull("Inativo");
                  })
                  .update({
                    statusFila: "FILA",
                  });

                CodInd = await db("indicado")
                  .select("CodInd", "Indicador", "Inativo")
                  .where("codseg", 1)
                  .andWhere(function () {
                    this.where("Inativo", "F").orWhereNull("Inativo");
                  })
                  .andWhere("statusFila", "FILA")
                  .orderBy("CodInd")
                  .first();

                CodInd = CodInd.CodInd;

                await db("Indicado").where("CodInd", CodInd).update({
                  statusFila: "OK",
                });
              }

              CodInd = CodInd.CodInd;

              await db("Indicado").where("CodInd", CodInd).update({
                statusFila: "OK",
              });
            }

            // - Chamada no banco que pega o codigo referente ao pagamento em BOLETO
            const { CodCartao } = await db("empresa").select("CodCartao").where("CodEmp", 1).first();
            const Pagamento = await response.data;

            // Definindo o enum para os estados de pagamento
            enum StatusPagamento {
              paid = "Pago",
              authorized = "Autorizado",
              declined = "Recusado",
              canceled = "Cancelado",
            }

            const statusPagamentoMap = {
              paid: StatusPagamento.paid,
              authorized: StatusPagamento.authorized,
              declined: StatusPagamento.declined,
              canceled: StatusPagamento.canceled,
            };
            // 3. Inserir em Requisi
            const inserirVendaRequisi = await db("requisi").insert({
              Pedido: valorAtualizado,
              Data: dataFormatada,
              Tipo: "PEDIDO",
              CodCli: CodCli,
              Observacao: "PAGAMENTO REALIZADO NO ECOMMERCE VIA CARTAO",
              Tipo_Preco: 1, //
              CodCon: 0,
              CodPros: 0,
              CodEmp: 1,
              Dimensao: 2,
              CodInd: CodInd || CodInd.CodInd, //
              Status: "VENDA",
              FIB: valorFrete > 0 ? 0 : 9,
              Ecommerce: "X",
              Frete: valorFrete,
              CodForma1: CodCartao,
              Data1: moment().format("YYYY-MM-DD"),
              Parc1: Pagamento.charges[0].payment_method.installments,
              StatusPagamento: statusPagamentoMap[response.data.charges[0].status.toLowerCase() as keyof typeof statusPagamentoMap] || "Status Desconhecido",
              CodAutorizacaoNumber: Pagamento.charges[0].payment_response.code,
              idStatus: Pagamento.id,
              idPagamento: Pagamento.charges[0].id,
              Pago: Pagamento.charges[0].paid_at,
              Bandeira: Pagamento.charges[0].payment_method.card.brand,
              PDigito: Pagamento.charges[0].payment_method.card.first_digits,
              UDigito: Pagamento.charges[0].payment_method.card.last_digits,
              Nome: Pagamento.charges[0].payment_method.card.holder.name,
              NSU: Pagamento.charges[0].payment_response.reference,
              CodigoRazao: Pagamento.charges[0].payment_response.code,
              Autorizacao: `E${valorAtualizado}`,
            });
            // 4. Inserir em Requisi1
            for (const item of Pagamento.items) {
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
              from: {
                name: "S-Commerce",
                address: process.env.GMAIL_LOGIN as string,
              },
              to: email,
              subject: `Confirmação de Compra Aprovada`,
              html: `
            <div style="font-family: 'Arial', sans-serif; color: #333;">
              <h2>Parabéns, ${Cliente}!</h2>
              <p>Sua compra no valor de <strong>R$ ${totalAmount}</strong> foi <span style="color: #27ae60;"><strong>aprovada</strong></span> com sucesso!</p>
              <p>Detalhes da compra:</p>
              <p><strong>Número do Pedido:</strong> ${valorAtualizado}</p>
              <p><strong>Data:</strong> ${moment().format("DD/MM/YY HH:MM:SS")}</p>
              <p>Os itens do seu pedido serão preparados e enviados em breve. Agradecemos pela sua confiança e preferência.</p>
              <p>Você pode acompanhar o status do seu pedido através do nosso site ou entrando em contato conosco.</p>
              <hr>
              <p>Caso tenha qualquer dúvida ou necessite de assistência, fique à vontade para responder a este e-mail ou entrar em contato pelo nosso suporte.</p>
              <p>Atenciosamente,</p>
              <p><strong>Equipe de Atendimento ao Cliente</strong></p>
              <p>SoftlineDocs</p>
            </div>
          `,
            };

            try {
              const enviarEmail = await transporter.sendMail(mailOptions);
              console.log("Email enviado: ", enviarEmail.response);
            } catch (error) {
              console.log(error);
            }
            return res.status(200).json({ message: "Venda concluída no banco de dados", idVenda: valorAtualizado });
          } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Erro interno do servidor" });
          }
        }
      } catch (error: any) {
        console.log(error.response.data);
        return res.status(400).json({ message: error.response.data });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }

    return res.status(200).json("ok");
  }

  return res.status(405).end(); // Método não permitido se não for GET
}
