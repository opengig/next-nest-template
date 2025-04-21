import { AuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.email === undefined ||
          credentials?.password === undefined
        ) {
          throw new Error("Please provide email and password");
        }
        try {
          const response = await fetch(
            `${process.env.APP_URL}/api/users/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(credentials),
            }
          );
          const data = await response.json();
          if (response.ok && data.data) {
            const user = {
              id: data.data.user.id,
              username: data.data.user.username,
              name: data.data.user.name,
              email: credentials?.email,
              token: data.data.token,
              role: data.data.user.role,
            };
            return user;
          } else {
            throw new Error(data.message || "Something went wrong!");
          }
        } catch (error: any) {
          console.log(error.message);
          throw new Error(error.message);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        return true; // Let NestJS handle the user creation/retrieval
      }
      return true;
    },
    async jwt({ token, user, account }: any) {
      if (user) {
        token.token = user.token;
        token.id = user.id;
        token.username = user.username;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user = {
          id: token.id,
          username: token.username,
          name: token.name ?? "",
          email: token.email,
          role: token.role,
        };
        session.token = token.token;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const getAuthSession = async () => {
  const session = await getServerSession(authOptions);
  return session;
};
