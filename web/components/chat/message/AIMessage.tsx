import { cn } from '@/lib/utils';
import { UIMessage } from '@ai-sdk/react';
import React, { useState } from 'react';
import CustomMarkdown from '../CustomMarkdown';
import { format } from 'date-fns';
import { toolComponents } from '../tools';
import { Check, Loader2 } from 'lucide-react';
import { Copy } from 'lucide-react';
import ShinyText from '@/components/ShinyText';

type AIMessageProps = {
  message: UIMessage;
};

const AIMessage = ({ message }: AIMessageProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const content = message.parts
        ?.filter((part) => part.type === 'text')
        .map((part) => part.text)
        .join('\n');
      if (content) {
        await navigator.clipboard.writeText(content);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  return (
    <div className='flex max-w-full justify-start gap-3'>
      <div className={cn('flex flex-1 flex-col gap-1', 'items-start')}>
        <div className={'w-full'}>
          {message.parts?.map((part, index) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const partAny = part as any;
            const { type } = partAny;

            if (type && typeof type === 'string' && (type.includes('step') || type === 'start')) {
              return null;
            }

            if (type === 'reasoning') {
              const reasoningText = partAny?.text || partAny?.content || '';
              return <CustomMarkdown key={index} className='italic' message={reasoningText} />;
            }

            if (type === 'text') {
              const textContent = partAny.text || partAny.content || '';
              console.log('Text part content:', textContent);
              if (textContent && textContent.trim()) {
                return <CustomMarkdown key={index} message={textContent} />;
              }
              return null;
            }

            if (partAny.text && partAny.text.trim()) {
              return <CustomMarkdown key={index} message={partAny.text} />;
            }

            if (partAny.content && partAny.content.trim()) {
              return <CustomMarkdown key={index} message={partAny.content} />;
            }

            if (type === 'tool-web_search') {
              const ToolComponent = toolComponents['tool-web_search'];
              const callId = partAny.toolCallId || index;

              switch (partAny.state) {
                case 'input-streaming':
                  return (
                    <div key={callId} className='my-1 flex w-fit items-center gap-1 rounded-md text-sm'>
                      <Loader2 size={16} className='text-muted-foreground animate-spin' />
                      <ShinyText text='Preparing search...' />
                    </div>
                  );

                case 'input-available':
                  return <ToolComponent key={callId} tool={partAny} />;

                case 'output-available':
                  if (partAny.output?.data) {
                    return (
                      <div key={callId} className='bg-muted/30 my-2 rounded-md border p-3'>
                        <div className='text-muted-foreground mb-2 text-sm'>🔍 Web Search Results:</div>
                        <CustomMarkdown message={partAny.output.data} />
                      </div>
                    );
                  }
                  return null;

                default:
                  return <ToolComponent key={callId} tool={partAny} />;
              }
            }

            console.log('No content to render for part:', partAny);
            return null;
          })}
        </div>
        <div className='flex items-center gap-1.5'>
          <span className={cn('text-xs', 'text-muted-foreground')}>{format(new Date(new Date()), 'h:mm a')}</span>
          <button
            onClick={handleCopy}
            className='hover:bg-muted text-muted-foreground flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm p-0.5'
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIMessage;
