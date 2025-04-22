'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const Page = () => {
	const { data: session, status } = useSession();

	const handleSignOut = () => {
		signOut();
	};

	if (status === 'loading') {
		return (
			<div className='flex h-screen items-center justify-center'>
				<Loader2 className='animate-spin' />
				<p className='ml-3 text-sm font-medium'>Loading...</p>
			</div>
		);
	}
	if (status === 'unauthenticated') {
		return (
			<div className='flex h-screen flex-col items-center justify-center gap-4'>
				<p className='text-sm font-medium'>Unauthenticated</p>
				<Link href='/auth'>
					<Button>Sign In</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className='p-4'>
			<div className='mx-auto max-w-md rounded-lg bg-card p-6 shadow'>
				<h2 className='mb-4 text-2xl font-bold'>Authentication Status</h2>

				<div className='space-y-4'>
					<div>
						{session?.user && (
							<pre className='mt-2 space-y-2 overflow-x-auto whitespace-break-spaces rounded-md bg-muted p-4'>
								{JSON.stringify(session.user, null, 2)}
							</pre>
						)}
					</div>

					<div>
						<Button onClick={handleSignOut} variant='destructive'>
							Sign Out
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
