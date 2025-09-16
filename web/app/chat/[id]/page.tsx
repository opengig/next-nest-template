import ChatPage from '@/components/chat/ChatPage';
import { ChatService } from '@/services';
import { notFound } from 'next/navigation';
import React from 'react';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const chat = await ChatService.getChat(id);
  if (!chat.data) {
    return notFound();
  }
  return <ChatPage chat={chat.data} />;
};

export default Page;
