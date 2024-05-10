import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SEC,
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: "/",
    },

    providers: [
        CredentialsProvider({

          name: "Credentials",
          credentials: {
            username: { label: "Username", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" },
          },
          
          async authorize(credentials) {
            if(!credentials?.username || !credentials?.password) {
                return null;
            }
            
            const existingUser = await db.user.findUnique({
                where: { username: credentials.username }
            });

            if(!existingUser){
                return null;
            }

            const passwordMatch = await compare(credentials.password, existingUser.password);

            if(!passwordMatch){
                return null
            }

            return {
                id: `${existingUser.id}`,
                username: existingUser.username,
                email: existingUser.email,
                role: existingUser.role,
                picture: existingUser.picture
            }
          }
        })
      ],

      callbacks: {
        async jwt ({token, user }){
        const latestUser = await db.user.findUnique({
            where: { id: Number(token.sub) },
            });
            
            if(latestUser){
                return {
                    ...token,
                    username: latestUser.username,
                    role: latestUser.role,
                    picture: latestUser.picture
                }
            }
            return token
        },
        
        async session ({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    username: token.username,
                    role: token.role,
                    picture: token.picture
                },
            };
        },
      }
}