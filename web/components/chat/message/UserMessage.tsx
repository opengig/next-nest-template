import { UIMessage } from '@ai-sdk/react';
import React from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface UserMessageProps {
  message: UIMessage;
}

const UserMessage = ({ message }: UserMessageProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.parts[0].type === 'text' ? message.parts[0].text : '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className='flex w-full justify-end gap-3'>
      <div className={cn('flex flex-col gap-1', 'items-end')}>
        <div className={'bg-secondary text-secondary-foreground w-full rounded-2xl px-4 py-2'}>
          {message.parts[0].type === 'text' && (
            <div className='whitespace-pre-wrap max-sm:text-sm'>{message.parts[0].text}</div>
          )}
        </div>
        <div className='flex items-center gap-1.5'>
          <button
            onClick={handleCopy}
            className='hover:bg-muted text-muted-foreground flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm p-0.5'
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
          <span className={cn('text-sm max-sm:text-xs', 'text-muted-foreground')}>
            {format(new Date(new Date()), 'h:mm a')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserMessage;
