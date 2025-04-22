import { UserRole } from 'prisma/client';

export interface RequestUser {
	id: string;
	email: string;
	name: string;
	avatarUrl?: string | null;
	role: UserRole;
	sub: string;
}
