'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ChatInputProps {
  initialPage?: boolean;
  query: string;
  setQuery: (query: string) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
  placeholder?: string;
}

const ChatInput = ({
  initialPage = false,
  query,
  setQuery,
  isSubmitting,
  onSubmit,
  placeholder = 'Message...',
}: ChatInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialPage && inputRef.current) {
      inputRef.current.focus();
    }
  }, [initialPage]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && query.trim() && !isSubmitting) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleSubmit = () => {
    if (query.trim() && !isSubmitting) {
      onSubmit();
    }
  };

  return (
    <div className='relative'>
      <div className='bg-background/80 focus-within:ring-primary/20 flex gap-2 rounded-xl border p-2 shadow-sm backdrop-blur-sm transition-all focus-within:ring-2'>
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={isSubmitting}
          className='placeholder:text-muted-foreground border-0 bg-transparent p-2 text-sm focus-visible:ring-0 focus-visible:ring-offset-0'
        />
        <Button
          onClick={handleSubmit}
          disabled={!query.trim() || isSubmitting}
          size='sm'
          className='flex h-8 w-8 items-center justify-center rounded-lg p-0'
        >
          {isSubmitting ? <Loader2 className='size-4 animate-spin' /> : <Send className='size-4' />}
        </Button>
      </div>
      {initialPage && (
        <p className='text-muted-foreground mt-2 text-center text-xs'>Press Enter to send your message</p>
      )}
    </div>
  );
};

export default ChatInput;
