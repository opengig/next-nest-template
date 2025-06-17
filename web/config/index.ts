export const envConfig = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  providers: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
  nextAuthSecret: process.env.NEXTAUTH_SECRET || 'my-secret',
  nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
};
