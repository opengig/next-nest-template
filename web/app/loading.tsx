'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Loading = () => {
	return (
		<div className='bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs'>
			<Card className='w-full max-w-sm'>
				<CardContent className='flex flex-col items-center justify-center space-y-4 p-6'>
					<Loader2 className='text-primary h-12 w-12 animate-spin' strokeWidth={1.5} />
					<div className='space-y-2 text-center'>
						<h2 className='text-foreground text-xl font-semibold'>Loading</h2>
						<p className='text-muted-foreground text-sm'>Preparing your content</p>
					</div>
					<div className='bg-primary/10 h-1 w-full overflow-hidden'>
						<div className='animate-progress-bar bg-primary h-full'></div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default Loading;
