import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import db from "@/db/db";
import transporter from "@/services/nodeMailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    let { dadosPessoais, dadosTelefone, endereco, formattedProducts, valorCompra, CodCli, valorFrete } = req.body;

    // 1. Obtenha a última venda
    let ultimaVenda = await db("numero").select("Venda").first();
    let valorAtualizado = ultimaVenda.Venda + 1; // Adicione 1 ao valor da última venda

    try {
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
          notification_urls: [`${process.env.NEXTAUTH_URL}/api/vendas/notificacao`],
        },
      };
      const response = await axios.post(options.url, options.data, {
        headers: options.headers,
      });

      //! So pode passar se o pix for pago
      if (response.data) {
        let { CodInd } = await db("Clientes").where("CodCli", CodCli).select("CodInd").first();
        if (CodInd === null) {
          CodInd = await db("indicado")
            .select("CodInd")
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

          if (!CodInd) {
            await db("Indicado")
              .where("codseg", 1)
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
        }

        //! ------------------------------------------------------------------------------------------!//
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
          StatusPagamento: "Aguardando Pagamento",
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

        const { email, Cliente } = await db("clientes").select("email", "Cliente").where("CodCli", CodCli).first();

        const mailOptions = {
          from: "softlinedocs@gmail.com",
          to: email,
          subject: "Seu Pagamento via Pix Está Pronto",
          html: `
            <div style="font-family: 'Arial', sans-serif; color: #333;">
              <h2>Pagamento via Pix Pendente, ${Cliente}!</h2>
              <p>Olá, ${Cliente}! Seu pedido no valor de <strong>R$ ${valorCompra}</strong> está pronto para ser pago via Pix.</p>
              <p>Detalhes do Pedido:</p>
              <p><strong>Valor a Pagar:</strong> R$ ${valorCompra}</p>
              <p><strong>Data e Hora do Pedido:</strong> ${moment().format("DD/MM/YYYY HH:mm:ss")}</p>
              <p>Para realizar o pagamento, utilize o QR Code abaixo ou copie o código Pix:</p>
              <div style="margin-bottom: 15px;">
                <a href="${response.data.qr_codes[0].links[0].href}" target="_blank"><img src="${response.data.qr_codes[0].links[0].href}" alt="QR Code Pix" style="width: 200px; height: 200px;"></a>
              </div>
              <div style="border: 1px solid #ccc; padding: 10px; font-size: 16px; color: #333; margin-bottom: 20px;">
                ${response?.data?.qr_codes[0]?.text}
              </div>
              <p>Após o pagamento, seu pedido será processado e preparado para envio. Agradecemos por escolher a SoftlineDocs.</p>
              <p>Você pode verificar o status do seu pedido a qualquer momento em nossa plataforma.</p>
              <hr>
              <p>Se tiver dúvidas ou precisar de assistência, entre em contato conosco.</p>
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

        return res.status(200).json({ dadosPix: response.data.qr_codes[0], idVenda: valorAtualizado, idCharge: response.data.id });
      }
    } catch (error: any) {
      console.log("Erro ao gerar o pagamento:", error);
      return res.json(error.response.data);
    }
  }

  if (req.method === "GET") {
    const { pixCharge } = req.query;

    try {
      const response = await axios.get(`${process.env.PAGSEGURO_URL}/orders/${pixCharge}`, {
        headers: {
          Authorization: `Bearer B871F6967C2341489D37924D761FF1BD`,
        },
      });

      if (!response?.data?.charges?.[0]) {
        return res.status(404).json({ message: "Pagamento ainda não realizado" });
      }

      await db("requisi").where("Pedido", response.data.reference_id).update({
        Observacao: "PIX PAGO",
        StatusPagamento: response.data.charges[0].status,
        Pago: response.data.charges[0].paid_at,
        idPagamento: response.data.charges[0].id,
        CodigoRazao: response.data.charges[0].payment_response.code,
      });

      const { CodCli } = await db("requisi").select("CodCli").where("Pedido", response.data.reference_id).first();
      const { email, Cliente } = await db("clientes").select("email", "Cliente").where("CodCli", CodCli).first();

      const mailOptions = {
        from: "softlinedocs@gmail.com",
        to: email,
        subject: "Confirmação de Pagamento via Pix",
        html: `
            <div style="font-family: 'Arial', sans-serif; color: #333;">
              <h2>Pagamento Confirmado, ${Cliente}!</h2>
              <p>Olá, ${Cliente}! 🌟</p>
              <p>Estamos felizes em informar que o seu pagamento via Pix foi <strong>confirmado</strong> com sucesso!</p>
              <ul>
                <li><strong>Data de Pagamento:</strong> ${moment(response.data.charges[0].paid_at).format("DD/MM/YYYY HH:mm:ss")}</li>
              </ul>
              <p>Seu pedido agora está em processo de preparação e em breve será enviado. 📦✈️</p>
              <p>Agradecemos por escolher a SoftlineDocs para suas compras. Seu suporte significa muito para nós!</p>
              <hr>
              <p>Para qualquer dúvida ou informação adicional, sinta-se à vontade para nos contatar.</p>
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

      return res.json(response.data.charges[0]);
    } catch (error: any) {
      console.error("Erro ao verificar o pagamento:", error.response.data);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
  return res.status(500).end(); // Proibir caso a requisição nao seja POST
}
