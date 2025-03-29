import { authOptions } from "@/lib/authOptions";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    name: string;
    email: string;
    role: string;
    token: string;
  }
  interface Session {
    user: {
      id: string;
      username: string;
      name: string;
      email: string;
      role: string;
    };
    token: string;
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
