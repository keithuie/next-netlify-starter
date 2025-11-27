import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Simple username/password check against environment variables
        const validUsername = process.env.AUTH_USERNAME || 'admin';
        const validPassword = process.env.AUTH_PASSWORD || 'thameswater2025';

        if (credentials?.username === validUsername && credentials?.password === validPassword) {
          return {
            id: '1',
            name: credentials.username,
            email: `${credentials.username}@thameswater.local`,
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl + '/map';
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-this',
};

export default NextAuth(authOptions);
