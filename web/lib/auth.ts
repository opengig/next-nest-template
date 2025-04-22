import { AuthOptions, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { envConfig } from '@/config';
import { AuthService } from '@/services';

const googleAuthProvider = GoogleProvider({
	clientId: envConfig.providers.google.clientId,
	clientSecret: envConfig.providers.google.clientSecret,
});

const credentialsAuthProvider = CredentialsProvider({
	name: 'Credentials',
	credentials: {
		email: { label: 'Email', type: 'email' },
		otp: { label: 'OTP', type: 'text' },
	},
	async authorize(credentials) {
		try {
			if (!credentials?.email || !credentials?.otp) {
				throw new Error('Email and password required');
			}

			const res = await AuthService.verifyOtp(credentials.email, credentials.otp);

			if (res.data) {
				return {
					id: res.data.user.id,
					email: res.data.user.email,
					token: res.data.token,
					role: res.data.user.role,
					name: res.data.user.name ?? 'Unknown',
					avatarUrl: res.data.user.avatarUrl ?? '',
				} satisfies User;
			}

			throw new Error('Invalid credentials');
		} catch (error) {
			throw new Error((error as Error)?.message || 'Invalid credentials');
		}
	},
});

export const authOptions: AuthOptions = {
	providers: [googleAuthProvider, credentialsAuthProvider],
	callbacks: {
		async signIn({ user, account, profile }) {
			if (account?.provider === 'google') {
				const email = profile?.email;

				if (email && account.id_token) {
					try {
						const resp = await AuthService.handleGoogleAuth(account.id_token);
						if (resp.data) {
							user.id = resp.data.user.id;
							user.name = resp.data.user.name ?? 'Unknown';
							user.email = resp.data.user.email;
							user.avatarUrl = resp.data.user.avatarUrl || user.image || '';
							user.token = resp.data.token;
						} else {
							console.error('Error signing in:', resp.error);
							return false;
						}
					} catch (error) {
						console.error('Error signing in:', error);
						return false;
					}
				}
			}
			return true;
		},
		async jwt({ token, user, trigger, session }) {
			if (trigger === 'update' && session?.user) {
				return { ...token, ...session.user };
			}
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.name = user.name;
				token.role = user.role;
				token.avatarUrl = user.avatarUrl || '';
				token.token = user.token;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
				session.user.email = token.email as string;
				session.user.name = token.name as string;
				session.user.avatarUrl = token.avatarUrl as string;
				session.user.role = token.role as string;
				session.user.token = token.token as string;
			}
			return session;
		},
	},
	session: {
		strategy: 'jwt',
		maxAge: 7 * 24 * 60 * 60,
	},
};
