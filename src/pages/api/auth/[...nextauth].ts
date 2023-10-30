import axiosCliente from "@/services/axiosCliente";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
      return (baseUrl = process.env.NEXTAUTH_URL || "http://10.71.0.119:3000");
    },

    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.CodCli;
        token.cliente = user.Cliente;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.cliente = token.cliente;
      }

      return session;
    },
  },
  secret: "secret",
  jwt: {
    secret: "secret",
    encryption: true,
    expires: 8200, // Define a expiração do token para 1 hora (1 hora * 60 minutos * 60 segundos)
  },
});
