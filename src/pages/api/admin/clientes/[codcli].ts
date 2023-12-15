import { NextApiRequest, NextApiResponse } from "next";
import db from "@/db/db";
import { getToken } from "next-auth/jwt";
import moment from "moment";

interface ClienteDados {
  [key: string]: string | null;
}

function criarHistorico(novosDados: ClienteDados, dadosAntigos: ClienteDados, nomeAdmin: string): string {
  let alteracoesDetalhadas: string[] = [];

  // Exclui 'DataCad' para a comparação
  const { DataCad: _, ...novosDadosFiltrados } = novosDados;
  const { DataCad: __, ...dadosAntigosFiltrados } = dadosAntigos;

  // Verifica cada campo para mudanças
  Object.keys(novosDadosFiltrados).forEach((campo) => {
    if (novosDadosFiltrados[campo] !== dadosAntigosFiltrados[campo]) {
      let valorAntigo = dadosAntigosFiltrados[campo] ?? "vazio";
      let valorNovo = novosDadosFiltrados[campo] ?? "vazio";
      let alteracao = `${campo}: de ${valorAntigo} para ${valorNovo}`;
      alteracoesDetalhadas.push(alteracao);
    }
  });

  if (alteracoesDetalhadas.length === 0) {
    return `O Administrador ${nomeAdmin} não realizou alterações significativas.`;
  }

  let textoHistorico = `O Administrador ${nomeAdmin} realizou as seguintes alterações:\n`;
  textoHistorico += alteracoesDetalhadas.join("\n");

  return textoHistorico;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return res.status(401).json({ message: "Não autorizado" });
  }
  if (req.method === "GET") {
    const { codcli } = req.query;
    try {
      const cliente = await db("Clientes")
        .select("CodCli", "Cliente", "Razao", "Complemento", "EMail", "CGC", "CPF", "RG", "IE", "TelEnt2", "TelEnt", "DataCad", "Endereco", "Bairro", "Cidade", "Estado", "Cep")
        .where("CodCLi", codcli)
        .first();

      if (!cliente) {
        return res.status(404).json("Cliente não encontrado");
      }

      return res.json(cliente);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }

      // Se não for uma instância de Error, trate como um erro genérico
      return res.status(500).json({ message: "Um erro desconhecido ocorreu." });
    }
  }

  if (req.method === "PUT") {
    const { codcli } = req.query;
    const { Cliente, Razao, Complemento, EMail, CGC, IE, RG, CPF, TelEnt, TelEnt2, Endereco, Bairro, Cidade, Estado, Cep } = req.body;

    try {
      const cliente = await db("Clientes").where("CodCLi", codcli).first();

      if (!cliente) {
        return res.status(404).json("Cliente não encontrado");
      }

      await db("Clientes").where("CodCli", codcli).update({
        Cliente,
        Razao,
        Complemento,
        EMail,
        CGC,
        IE,
        RG,
        CPF,
        TelEnt,
        TelEnt2,
        Endereco,
        Bairro,
        Cidade,
        Estado,
        Cep,
      });

      // Após a atualização do cliente, insira na Cli_his
      const dataAtual = moment().format("YYYY-MM-DD");
      const horaAtual = moment().format("HH:mm");

      // Exclua o campo DataCad do objeto cliente para a criação do histórico
      const { DataCad: _, ...clienteSemDataCad } = cliente;

      const historico = criarHistorico(req.body, clienteSemDataCad, token.cliente as string); // Função auxiliar para criar o histórico

      await db("Cli_his").insert({
        CodCli: codcli,
        CodUsu: token.id, // Certifique-se de que 'id' está disponível no token
        data: dataAtual,
        hora: horaAtual,
        CodTrans: 1,
        Historico: historico,
        Estado: "Ok",
      });

      return res.status(200).json("Cliente atualizado com sucesso");
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);

        return res.status(500).json({ message: error.message });
      }

      // Se não for uma instância de Error, trate como um erro genérico
      console.log(error);

      return res.status(500).json({ message: "Um erro desconhecido ocorreu." });
    }
  }

  return res.status(405).end(); // Método não permitido se não for GET
}
