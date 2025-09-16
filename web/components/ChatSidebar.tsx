'use client';

import { useRouter } from 'next/navigation';
import { ChatHistory } from '@/components/ChatHistory';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, useSidebar } from '@/components/ui/sidebar';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { PlusIcon } from 'lucide-react';

export function ChatSidebar() {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar variant='floating' className='group-data-[side=left]:border-r-0'>
      <SidebarHeader>
        <SidebarMenu>
          <div className='flex flex-row items-center justify-between'>
            <Link
              href='/'
              onClick={() => {
                setOpenMobile(false);
              }}
              className='flex flex-row items-center gap-3'
            >
              <span className='hover:bg-muted cursor-pointer rounded-md px-2 text-lg font-semibold'>Heizen Bot</span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  type='button'
                  className='h-fit p-2'
                  onClick={() => {
                    setOpenMobile(false);
                    router.push('/');
                    router.refresh();
                  }}
                >
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent align='end'>New Chat</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ChatHistory />
      </SidebarContent>
    </Sidebar>
  );
}
