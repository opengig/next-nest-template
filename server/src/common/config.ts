export const config = {
	port: parseInt(process.env.PORT || '3001', 10),
	jwt: {
		secret: process.env.JWT_SECRET!,
		expiresIn: process.env.JWT_EXPIRES_IN ?? '10d',
	},
	google: {
		clientId: process.env.GOOGLE_CLIENT_ID!,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		callbackUrl: process.env.GOOGLE_CALLBACK_URL!,
	},
	mail: {
		smtp: {
			host: process.env.SMTP_HOST!,
			port: parseInt(process.env.SMTP_PORT || '465', 10),
			auth: {
				user: process.env.SMTP_USER!,
				pass: process.env.SMTP_PASSWORD!,
			},
		},
		defaults: {
			from: process.env.SMTP_FROM!,
			fromName: process.env.SMTP_FROM_NAME ?? 'Opengig',
		},
	},
};
