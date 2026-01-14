import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true, // Fix for UntrustedHost error
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(8) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) return null;

          // Check if account is locked
          if (user.lockedUntil && user.lockedUntil > new Date()) {
            throw new Error("Account is locked. Please try again later.");
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            // Reset failed attempts
            await prisma.user.update({
              where: { id: user.id },
              data: { failedAttempts: 0, lastLogin: new Date() },
            });
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              organizationId: user.organizationId,
            };
          } else {
            // Increment failed attempts
            const failedAttempts = user.failedAttempts + 1;
            const data: any = { failedAttempts };
            if (failedAttempts >= 5) {
              data.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
            }
            await prisma.user.update({ where: { id: user.id }, data });
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.organizationId = (user as any).organizationId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).organizationId = token.organizationId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days as per REQ-AUTH-03
  },
});
