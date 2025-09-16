'use client';
import React from 'react';
import { SidebarTrigger } from './ui/sidebar';
import { ThemeToggle } from './ThemeToggle';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from './ui/button';

const SidebarHeader = () => {
  return (
    <header className='sticky top-0 flex h-12 w-full shrink-0 items-center justify-between gap-2 pr-6 transition-[width,height] ease-linear'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
      </div>
      <div className='flex items-center gap-2'>
        <ThemeToggle />
        <Button
          variant='outline'
          onClick={() => {
            signOut();
          }}
          size='icon'
        >
          <LogOut />
        </Button>
      </div>
    </header>
  );
};

export default SidebarHeader;
