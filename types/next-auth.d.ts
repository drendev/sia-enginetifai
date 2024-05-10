import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    username: string
    role: string
    picture: string
  }
  interface Session {
    user: User & {
        username: string
        role: string
        picture: string
    }
    token: {
        username: string
        role: string
        picture: string
    }
  }
}