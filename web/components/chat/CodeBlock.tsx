import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  children: string;
  className?: string;
  inline?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className, inline }) => {
  const [copied, setCopied] = useState(false);
  const { resolvedTheme: theme } = useTheme();

  // Extract language from className (format: language-javascript)
  const language = className?.replace('language-', '') || 'text';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // For inline code
  if (inline) {
    return <code className='bg-muted rounded px-1.5 py-0.5 font-mono text-sm'>{children}</code>;
  }

  // For code blocks
  return (
    <div className='group'>
      {/* Header with language and copy button */}
      <div className='bg-muted flex items-center justify-between rounded-t-lg border px-2 py-1.5 sm:px-4 sm:py-2'>
        <span className='text-muted-foreground text-xs font-medium uppercase'>
          {language === 'text' ? 'code' : language}
        </span>
        <Button
          variant='ghost'
          size='sm'
          onClick={handleCopy}
          className='h-6 w-6 p-0 transition-opacity group-hover:opacity-100 sm:opacity-0'
        >
          {copied ? <Check className='h-3 w-3 text-green-500' /> : <Copy className='text-muted-foreground h-3 w-3' />}
        </Button>
      </div>

      {/* Code content */}
      <div className='border-border relative overflow-x-auto rounded-b-lg border border-t-0 dark:border-neutral-600'>
        <div className='text-xs sm:text-sm'>
          <SyntaxHighlighter
            language={language}
            style={theme === 'dark' ? oneDark : oneLight}
            showLineNumbers
            customStyle={{
              margin: 0,
              borderRadius: 0,
              border: 'none',
              fontSize: 'inherit',
              lineHeight: '1.4',
              padding: '0.75rem',
              overflowX: 'auto',
              maxWidth: '100%',
            }}
            codeTagProps={{
              style: {
                fontFamily:
                  'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                fontSize: 'inherit',
                tabSize: 2,
                overflowX: 'auto',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
              },
            }}
            lineNumberStyle={{
              minWidth: '2rem',
              paddingRight: '0.5rem',
              color: theme === 'dark' ? '#6b7280' : '#9ca3af',
              borderRight: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
              marginRight: '0.5rem',
              fontSize: 'inherit',
            }}
            wrapLines={false}
            wrapLongLines={false}
          >
            {children}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
