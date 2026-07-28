import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { supabaseAdmin } from "./supabase"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const { data: usuario } = await supabaseAdmin
          .from("usuarios")
          .select("id, nome, email, senha_hash")
          .eq("email", credentials.email as string)
          .single()

        if (!usuario || !usuario.senha_hash) return null

        const senhaValida = await bcrypt.compare(
          credentials.password as string,
          usuario.senha_hash
        )

        if (!senhaValida) return null

        return {
          id: usuario.id,
          email: usuario.email,
          name: usuario.nome,
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})
