import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { DefaultSession } from "next-auth";
import axios from "axios";

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
        let response = await axios.post(process.env.URL + "/api/usuario/login", credentials);
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
      // Essa aqui é a Base URL do NEXTAUTH, ou seja, se caso vc redirecionar o usuário para '/', será a baseURL que ele irá buscar, fiz isso para rede interna
      return (baseUrl = process.env.URL ?? "");
    },

    jwt: async ({ token, user }) => {
      if (user && "usuario" in user) {
        const { CodCli, Cliente } = (user as { usuario: { CodCli: string; Cliente: string } }).usuario;
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
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    ...{ expires: 8200 }, // Define a expiração do token para 1 hora (1 hora * 60 minutos * 60 segundos)
  },
});
