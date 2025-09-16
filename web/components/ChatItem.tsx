import { SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';
import Link from 'next/link';
import { TrashIcon } from 'lucide-react';
import { memo } from 'react';
import { Chat } from '@/types/chat.type';

const PureChatItem = ({
  chat,
  isActive,
  onDelete,
  setOpenMobile,
}: {
  chat: Chat;
  isActive: boolean;
  onDelete: (chatId: string) => void;
  setOpenMobile: (open: boolean) => void;
}) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={`/chat/${chat.id}`} onClick={() => setOpenMobile(false)}>
          <span>{chat.title}</span>
        </Link>
      </SidebarMenuButton>

      <SidebarMenuAction
        className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground mr-0.5'
        showOnHover={!isActive}
        onClick={() => onDelete(chat.id)}
      >
        <TrashIcon />
        <span className='sr-only'>Delete</span>
      </SidebarMenuAction>
    </SidebarMenuItem>
  );
};

export const ChatItem = memo(PureChatItem, (prevProps, nextProps) => {
  if (prevProps.isActive !== nextProps.isActive) return false;
  return true;
});
