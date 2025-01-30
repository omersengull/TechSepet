import NextAuth, { AuthOptions } from "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";

const prisma = new PrismaClient();

// User ve Session nesnelerini genişletiyoruz
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string; // Rol bilgisi eklendi
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User extends DefaultUser {
    role: string; // Kullanıcının rol bilgisi
  }

  interface JWT {
    id: string;
    role: string; // JWT token'da rol bilgisi, tür birleştirildi
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email ve şifre gerekli");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Kullanıcı bulunamadı");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isPasswordCorrect) {
          throw new Error("Geçersiz şifre");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || "USER", // Kullanıcı rolü
          image: user.image || null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "USER";
        console.log("JWT Callback - Token:", token);
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
        };
        console.log("Session Callback - Session:", session);
      }
      return session;
    },
    
  },
  pages: {
    signIn: "/login", // Giriş sayfası
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt", // JSON Web Token kullanımı
  },
  secret: process.env.NEXTAUTH_SECRET, // Güvenlik anahtarı
};

export default NextAuth(authOptions);