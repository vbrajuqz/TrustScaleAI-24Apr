import "next-auth";
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;             // Role.code (PA / EL / SC / EA / ...)
      organizationId: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
