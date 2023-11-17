import { Form, Button, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/dist/client/router";
import { toast } from "react-toastify";
import { GetServerSideProps } from "next";
import db from "@/db/db";
import { signIn } from "next-auth/react";

interface TokenData {
  id: number;
  token: string;
  CodCli: number;
  data_expiracao: Date;
}

export default function CriarSenha({ tokenData }: { tokenData: TokenData }) {
  const [senha, setSenha] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/criar-senha/senha", { tokenData, senha });

      signIn("credentials", {
        email: response.data.email,
        password: response.data.chave,
        redirect: true,
      });

      toast.success(response.data.message);
      return;
    } catch (error: any) {
      toast.error(error.response.data.message);
      // Trate o erro conforme necessário
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Form.Group controlId="formBasicPassword">
        <Form.Label>Senha</Form.Label>
        <InputGroup>
          <InputGroup.Text>
            <FontAwesomeIcon icon={faLock} />
          </InputGroup.Text>
          <Form.Control type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Digite sua nova senha" />
        </InputGroup>
      </Form.Group>
      <Button variant="primary" type="submit">
        Criar Senha
      </Button>
    </form>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = context.query;

  try {
    const tokenIsValid = await db("tokens_confirmacao").where("token", token).first();

    if (!tokenIsValid) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    // Convertendo a data para string ISO
    if (tokenIsValid.data_expiracao) {
      tokenIsValid.data_expiracao = tokenIsValid.data_expiracao.toISOString();
    }

    return { props: { tokenData: tokenIsValid } };
  } catch (error) {
    // No caso de erro na consulta ao banco de dados, redirecione
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
