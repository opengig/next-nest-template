'use client';
import React from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface ErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

const ErrorPage: React.FC<ErrorProps> = ({ error, reset }) => {
	return (
		<div className='bg-background flex min-h-screen items-center justify-center p-4'>
			<Card className='w-full max-w-md'>
				<CardHeader className='text-center'>
					<CardTitle className='mb-4 flex items-center justify-center'>
						<AlertTriangle className='text-destructive mr-2 h-12 w-12' />
						Error Occurred
					</CardTitle>
					<CardDescription>Something unexpected happened</CardDescription>
				</CardHeader>
				<CardContent className='space-y-6'>
					<div className='bg-muted/50 rounded-lg p-4'>
						<p className='text-muted-foreground text-sm break-words'>{error.message || 'An unknown error occurred'}</p>
						{error.digest && <p className='text-muted-foreground mt-2 text-xs'>Error ID: {error.digest}</p>}
					</div>

					<div className='flex justify-center space-x-4'>
						<Button variant='outline' className='w-full' onClick={() => reset()}>
							<RefreshCw className='mr-2 h-4 w-4' />
							Try Again
						</Button>
						<Button variant='secondary' className='w-full' asChild>
							<Link href='/'>
								<Home className='mr-2 h-4 w-4' />
								Home
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ErrorPage;
