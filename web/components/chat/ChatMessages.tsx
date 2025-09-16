import { ChatMessage } from './ChatMessage';
import { UIMessage, UseChatHelpers } from '@ai-sdk/react';
import MessageLoading from './MessageLoading';
import ErrorMessage from './ErrorMessage';
import { useRef, useEffect, useState, useCallback } from 'react';

interface ChatMessagesProps {
  messages: UIMessage[];
  error?: Error;
  status: string;
  isLoading: boolean;
}

const ChatMessages = ({ messages, error, status, isLoading }: ChatMessagesProps) => {
  console.log('ChatMessages rendering with:', {
    messageCount: messages.length,
    status,
    isLoading,
    lastMessage: messages[messages.length - 1],
    messages,
  });
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior,
        block: 'end',
        inline: 'nearest',
      });
    });
  }, []);

  const checkIfAtBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return true;

    const threshold = 100;
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
    setIsAtBottom(isAtBottom);
    return isAtBottom;
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      checkIfAtBottom();
    }, 16); // ~60fps
  }, [checkIfAtBottom]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    if (messages.length > 0) {
      if (isFirstRender.current) {
        scrollToBottom('instant');
        isFirstRender.current = false;
        setIsAtBottom(true);
      } else if (status === 'streaming' && isAtBottom) {
        scrollToBottom('smooth');
      } else if (status === 'submitted') {
        scrollToBottom('smooth');
        setIsAtBottom(true);
      }
    }
  }, [messages.length, status, isAtBottom, scrollToBottom]);

  useEffect(() => {
    if (status === 'streaming' && isAtBottom) {
      const updateScroll = () => {
        if (status === 'streaming' && isAtBottom) {
          scrollToBottom('smooth');
        }
      };

      const frameId = requestAnimationFrame(updateScroll);
      return () => cancelAnimationFrame(frameId);
    }
  }, [messages, status, isAtBottom, scrollToBottom]);

  return (
    <div className='mx-auto w-full flex-1 overflow-y-auto px-4 pt-4 md:mt-0' ref={messagesContainerRef}>
      <div className='mx-auto flex max-w-3xl min-w-0 flex-col gap-4'>
        {messages.map((message, index) => (
          <ChatMessage key={message.id || index} message={message as UIMessage} />
        ))}
        {status === 'submitted' && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
          <MessageLoading />
        )}
        {status === 'ready' && isLoading && <MessageLoading />}
        {status === 'error' && <ErrorMessage error={error?.message ?? 'An error occurred'} />}
      </div>
      <div ref={messagesEndRef} className='min-h-[24px] min-w-[24px] shrink-0' />
    </div>
  );
};

export default ChatMessages;
