import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import { verifyPassword } from "@/utils/auth";
export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        const { email, password } = credentials;
        try {
          await connectDB();
        } catch (error) {
          throw new Error("Error in connecting to DB");
        }
        if (!email || !password) {
          throw new Error("Invalid Data!");
        }
        const user = await User.findOne({ email: email });
        if (!user) throw new Error("User doesn't exist!");
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) throw new Error("Username or Password is incorrect!");
        return { id: user._id, email: user.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
        };
      }
      return session;
    },
  },
};
export default NextAuth(authOptions);
