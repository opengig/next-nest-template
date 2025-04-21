import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { compare } from 'bcrypt';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET } from '@/config';
import { AuthService } from '@/services/auth.service';

declare module 'next-auth' {
	interface User {
		id: string;
		name: string;
		email: string;
		avatar: string;
		token: string;
		is_admin: boolean;
	}

	interface Session {
		user: User;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string;
		token: string;
		email: string;
		name: string;
		avatar: string;
		is_admin: boolean;
	}
}

export const authOptions: NextAuthOptions = {
	secret: NEXTAUTH_SECRET,
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60, // 30 days
		updateAge: 24 * 60 * 60, // 24 hours
	},
	pages: {
		signIn: '/login',
		error: '/error',
	},
	debug: true,
	providers: [
		GoogleProvider({
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
					scope: "openid email profile"
				}
			}
		}),
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const res = await AuthService.login(credentials.email, credentials.password);

				if (res.error) {
					return null;
				}

				return {
					id: res.data?.user.id ?? '',
					email: res.data?.user.email ?? '',
					name: res.data?.user.name ?? '',
					avatar: res.data?.user.avatar ?? '',
					token: res.data?.access_token ?? '',
					is_admin: res.data?.user.is_admin ?? false,
				};
			},
		}),
	],
	callbacks: {
		async signIn({ account, profile, user }) {
			console.log('SignIn callback:', { account, profile, user });
			
			if (account?.provider === 'google' && profile?.email) {
				try {
					console.log('Full account object:', account);
					
					if (!account.access_token) {
						console.error('No access token available');
						return false;
					}

					const res = await AuthService.googleAuth(account.access_token);
					console.log('Google auth response:', res);
					
					if (res.error) {
						console.error('Google auth error:', res.error);
						return false;
					}

					// Store the backend response data
					const userData = {
						id: res.data?.user.id ?? '',
						email: res.data?.user.email ?? profile.email ?? '',
						name: res.data?.user.name ?? profile.name ?? '',
						avatar: res.data?.user.avatar ?? profile.image ?? '',
						token: res.data?.access_token ?? '',
						is_admin: res.data?.user.is_admin ?? false,
					};
					Object.assign(user, userData);
					account.backend_token = res.data?.access_token;
					console.log('Updated user data:', userData);
					return true;
				} catch (error) {
					console.error('Google auth error:', error);
					return false;
				}
			}
			if (account?.provider === 'credentials') {
				return true;
			}
			return false;
		},
		session: ({ session, token }) => {
			console.log('Session callback:', { session, token });
			const updatedSession = {
				...session,
				user: {
					id: token.id || token.sub || '',
					email: token.email || session.user.email || '',
					name: token.name || session.user.name || '',
					avatar: token.avatar || '',
					token: token.access_token || '',
					is_admin: token.is_admin || false,
				},
			};
			console.log('Updated session:', updatedSession);
			return updatedSession;
		},
		jwt: ({ token, account, user }) => {
			console.log('JWT callback before:', { token, account, user });
			
			if (account?.provider === 'credentials' && user) {
				token.id = user.id;
				token.email = user.email;
				token.name = user.name;
				token.avatar = user.avatar;
				token.is_admin = user.is_admin;
				token.access_token = user.token;
			} else if (account?.provider === 'google') {
				if (user) {
					token.id = user.id || '';
					token.email = user.email || '';
					token.name = user.name || '';
					token.avatar = user.avatar || '';
					token.is_admin = user.is_admin || false;
					if (account.backend_token) {
						token.access_token = account.backend_token;
					}
				}
			}
			
			console.log('JWT callback after:', token);
			return token;
		},
	},
};