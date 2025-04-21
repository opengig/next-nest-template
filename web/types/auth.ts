export type LoginResponse = {
	access_token: string;
	user: UserDto;
	token_type: string;
};

export type UserDto = {
	id: string;
	name: string;
	email: string;
	avatar?: string;
	is_admin?: boolean;
};

declare module 'next-auth' {
	interface User extends UserDto {}
	interface Session {
		user: User;
	}
}

export type UserUpdateRequest = {
	name?: string;
	email?: string;
	avatar?: string;
};

export type RegisterRequest = {
	name: string;
	email: string;
	avatar?: string;
	password: string;
};