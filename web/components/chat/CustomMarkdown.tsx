'use client';
import dynamic from 'next/dynamic';
import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const CodeBlock = dynamic(() => import('./CodeBlock'), { ssr: false });

const CustomMarkdown = ({ message, className }: { message: string; className?: string }) => {
  return (
    <div
      className={`prose max-sm:prose-sm prose-a:break-all dark:prose-invert prose-p:my-1 prose-pre:bg-transparent prose-code:before:content-none prose-code:after:content-none prose-pre:max-w-full prose-pre:p-0 max-w-full ${className}`}
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          code({ inline, className, children, ...props }: any) {
            const codeString = String(children).replace(/\n$/, '');

            // Check if it's inline code (no newlines and inline prop is true, or no className which indicates it's not a fenced code block)
            const isInline = inline || (!className && !codeString.includes('\n'));

            if (isInline) {
              return <code className='bg-muted rounded px-1.5 py-0.5 font-mono text-sm'>{codeString}</code>;
            }

            // Use CodeBlock for code blocks
            return (
              <CodeBlock className={className} {...props}>
                {codeString}
              </CodeBlock>
            );
          },
        }}
      >
        {message}
      </Markdown>
    </div>
  );
};

export default CustomMarkdown;
