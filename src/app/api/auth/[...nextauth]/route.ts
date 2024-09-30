import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import LineProvider from "next-auth/providers/line";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  providers: [
    LineProvider({
      clientId: "",
      clientSecret: "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials, req) {
        const loginUser = {
          email: credentials?.email,
          password: credentials?.password,
        };
        //search email in database
        const hashPasswordFromDB = "fakjsdfjwiofjslkdajdflksadjf";
        //check password
        const bcrypt = require("bcrypt");
        const varidatePassord = await bcrypt.compare(
          loginUser.password, //1234
          hashPasswordFromDB //
        );

        //return user
        const user = { id: "1", email: credentials?.email };
        if (loginUser.password === "1234") {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
});

export { handler as GET, handler as POST };
