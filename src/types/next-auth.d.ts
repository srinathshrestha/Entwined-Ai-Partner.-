declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      emailVerified?: boolean;
    };
  }

  interface User {
    id: string;
    emailVerified?: boolean;
  }

  interface JWT {
    id: string;
    emailVerified?: boolean;
  }
}
