'use client';
import { useChatTransitionStore } from '@/store/chatTransition';
import { Chat } from '@/types/chat.type';
import { UIMessage, useChat } from '@ai-sdk/react';
import React, { useEffect, useRef, useState } from 'react';
import { useSWRConfig } from 'swr/_internal';
import { unstable_serialize } from 'swr/infinite';
import { getChatHistoryPaginationKey } from '../ChatHistory';
import { envConfig } from '@/config';
import { useSession } from 'next-auth/react';
import ChatInput from './ChatInput';
import ChatMessages from './ChatMessages';
import Greeting from './Greeting';
import { DefaultChatTransport } from 'ai';

type ChatPageProps = {
  chat: Chat;
};

const ChatPage = ({ chat }: ChatPageProps) => {
  const { query, files, clearTransition, chatId } = useChatTransitionStore();
  const initialMessageSentRef = useRef(false);
  const { mutate } = useSWRConfig();
  const { data: session } = useSession();

  const [input, setInput] = useState('');
  const initialMessages: UIMessage[] = (chat.messages ?? []).map((m, idx) => ({
    id: idx.toString(),
    role: m.role as 'user' | 'assistant' | 'system',
    parts: [{ type: 'text', text: m.content }],
  }));

  const { messages, sendMessage, status, error, stop } = useChat({
    id: chat.id,
    transport: new DefaultChatTransport({
      api: `${envConfig.apiUrl}/api/chats/${chat.id}/messages`,
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    }),
    messages: initialMessages,
    experimental_throttle: 50,
    onFinish: ({ message }) => {
      console.log('response', message);
      mutate(unstable_serialize(getChatHistoryPaginationKey));
    },
    onError: (err) => {
      console.error('Error in chat:', err);
    },
  });

  useEffect(() => {
    const sendInitialMessage = async () => {
      if (chat.id === chatId && query && !initialMessageSentRef.current) {
        initialMessageSentRef.current = true;

        sendMessage(
          {
            text: input || query,
          },
          {
            body: {
              message: {
                content: input || query,
                role: 'user',
                parts: {},
                attachments: [],
              },
            },
          }
        );

        clearTransition();
      }
    };

    sendInitialMessage();
  }, [chat.id, chatId, query, files, clearTransition, sendMessage, input]);

  if (messages.length === 0) {
    return (
      <Greeting
        query={input}
        setQuery={setInput}
        isSubmitting={status === 'streaming'}
        handleSubmit={async () => {
          if (input.trim()) {
            await sendMessage(
              {
                text: input,
              },
              {
                body: {
                  message: {
                    content: input,
                    role: 'user',
                    parts: {},
                    attachments: [],
                  },
                },
              }
            );
            setInput('');
          }
        }}
      />
    );
  }

  return (
    <div className='flex h-[calc(100vh-3rem)] w-full flex-col pb-4'>
      <ChatMessages messages={messages} status={status} error={error} isLoading={status === 'streaming'} />
      <ChatInput
        onSubmit={async () => {
          if (input.trim()) {
            await sendMessage(
              {
                text: input,
              },
              {
                body: {
                  message: {
                    content: input,
                    role: 'user',
                    parts: {},
                    attachments: [],
                  },
                },
              }
            );
            setInput('');
          }
        }}
        query={input}
        setQuery={setInput}
        isSubmitting={status === 'streaming'}
        onStop={stop}
      />
    </div>
  );
};

export default ChatPage;
