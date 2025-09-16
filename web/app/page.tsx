'use client';

import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Page = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/chat');
    } else if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status, router]);

  return (
    <div className='flex h-screen items-center justify-center'>
      <Loader2 className='animate-spin' />
      <p className='ml-3 text-sm font-medium'>Loading...</p>
    </div>
  );
};

export default Page;
