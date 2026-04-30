import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";

const PLATFORM_ADMIN_EMAILS = ["balaramaraju.vatsavai@qualizeal.com"];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  trustHost: true,
  pages: { signIn: "/signin" },
  providers: [
    Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }),
    MicrosoftEntraID({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID || "common"}/v2.0`,
    }),
  ],
  events: {
    async createUser({ user }) {
      // Bootstrap: if the new user is the well-known Platform Administrator, set the role.
      // Also auto-attach to QualiZeal organization if email is @qualizeal.com.
      if (user.email && PLATFORM_ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        await prisma.user.update({
          where: { id: user.id },
          data: { platformRoleCode: "PA" },
        });
      }
      // Auto-attach @qualizeal.com users to the platform org
      if (user.email && user.email.toLowerCase().endsWith("@qualizeal.com")) {
        const qz = await prisma.organization.findUnique({ where: { domain: "qualizeal.com" } });
        if (qz) {
          await prisma.user.update({
            where: { id: user.id },
            data: { organizationId: qz.id },
          });
        }
      }
    },
    async signIn({ user }) {
      if (!user.id) return;
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });
    },
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        const fullUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { platformRoleCode: true, organizationId: true },
        });
        (session.user as { id?: string }).id = user.id;
        (session.user as { role?: string }).role = fullUser?.platformRoleCode ?? "ST";
        (session.user as { organizationId?: string | null }).organizationId = fullUser?.organizationId ?? null;
      }
      return session;
    },
  },
});
