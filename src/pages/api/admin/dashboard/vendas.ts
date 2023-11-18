import db from "@/db/db";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import moment from "moment"; // Importar o moment

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      // Primeira consulta: obter os pedidos
      const pedidos = await db("requisi").select("Pedido", "Data", "CodCli", "CodInd", "Ecommerce", "statusPagamento").where("ecommerce", "=", "X").orderBy("Pedido", "desc").limit(10);

      // Segunda consulta: obter os detalhes dos produtos de cada pedido
      const vendas = await Promise.all(
        pedidos.map(async (pedido) => {
          const produtos = await db("requisi1")
            .join("Produto", "requisi1.COdPro", "=", "Produto.CodPro")
            .select("requisi1.COdPro", "requisi1.QTD", "requisi1.Preco", "Produto.Produto")
            .where("requisi1.Pedido", "=", pedido.Pedido);

          // Terceira consulta: obter as informações do cliente
          const clienteInfo = await db("clientes").select("Cliente", "CGC").where("CodCli", pedido.CodCli).first(); // Supondo que haja apenas um registro por CodCli

          // Formatar a data do pedido usando moment
          const dataFormatada = moment(pedido.Data).format("DD/MM/YYYY");

          return {
            ...pedido,
            Data: dataFormatada,
            Cliente: clienteInfo, // Adicionar as informações do cliente
            Produtos: produtos,
          };
        })
      );
      console.log(vendas[0].Produtos);

      return res.status(200).json(vendas);
    } catch (error: any) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });
    }
  }
};

export default handler;
