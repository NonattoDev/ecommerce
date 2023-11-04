import axiosCliente from "@/services/axiosCliente";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      cliente: string;
      admin: boolean;
    };
  }
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Digite o seu email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials, req) {
        let response = await axiosCliente.post("/usuarios/login", credentials);
        const user = await response.data;
        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    redirect: async ({ url, baseUrl }) => {
      //Essa aqui é a Base URL do NEXTAUTH, ou seja, se caso vc redirecionar o usuário para '/', será a baseURL que ele irá buscar, fiz isso para rede interna
      return (baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000");
    },

    jwt: async ({ token, user }) => {
      if (user) {
        console.log(user);

        const { CodCli, Cliente } = user as unknown as { CodCli: string; Cliente: string };
        token.id = CodCli;
        token.cliente = Cliente;
        token.admin = (user as { admin?: boolean }).admin || false;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id?.toString() || "";
        session.user.cliente = token.cliente as string;
        session.user.admin = (token as { admin?: boolean }).admin || false;
      }

      return session;
    },
  },
  secret: "secret",
  jwt: {
    secret: "secret",
    ...{ expires: 8200 }, // Define a expiração do token para 1 hora (1 hora * 60 minutos * 60 segundos)
  },
});
