'use client';
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, MessageSquare, Lightbulb, Code, BookOpen } from 'lucide-react';
import ChatInput from './ChatInput';
import { useChatTransitionStore } from '@/store/chatTransition';
import { ChatService } from '@/services';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const suggestedPrompts = [
  {
    icon: <Lightbulb className='size-4' />,
    title: 'Get creative ideas',
    description: 'for a science project about renewable energy',
  },
  {
    icon: <Code className='size-4' />,
    title: 'Help me debug',
    description: "a JavaScript function that's not working properly",
  },
  {
    icon: <BookOpen className='size-4' />,
    title: 'Explain concepts',
    description: 'like machine learning in simple terms',
  },
  {
    icon: <MessageSquare className='size-4' />,
    title: 'Write content',
    description: 'for my blog post about sustainable living',
  },
];

const InitialChatPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setQuery, setChatId, query } = useChatTransitionStore();
  const router = useRouter();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const res = await ChatService.createChat();
    if (res.data) {
      setChatId(res.data.id);
      router.push(`/chat/${res.data.id}`);
      router.refresh();
    } else {
      toast.error('Failed to create chat');
    }
    setIsSubmitting(false);
  };

  const handlePromptClick = (prompt: string) => {
    setQuery(prompt);
  };

  return (
    <div className='mx-auto flex min-h-[calc(100vh-3rem)] max-w-4xl flex-col items-center justify-center px-4 py-8'>
      {/* Header Section */}
      <div className='mb-12 space-y-4 text-center'>
        <div className='mb-6 flex items-center justify-center'>
          <div className='from-primary/10 to-primary/5 border-primary/20 rounded-2xl border bg-gradient-to-br p-3'>
            <Sparkles className='text-primary size-8' />
          </div>
        </div>

        <h1 className='from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent md:text-5xl'>
          How can I help you today?
        </h1>
      </div>

      {/* Input Section */}
      <div className='mb-8 w-full max-w-3xl'>
        <ChatInput initialPage query={query} setQuery={setQuery} isSubmitting={isSubmitting} onSubmit={handleSubmit} />
      </div>

      {/* Suggested Prompts */}
      <div className='w-full max-w-4xl'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {suggestedPrompts.map((prompt, index) => (
            <Card
              key={index}
              className='group hover:border-primary/20 bg-background/50 border-input/50 cursor-pointer p-0 backdrop-blur-sm transition-all duration-200 hover:scale-[1.01] hover:shadow-md'
              onClick={() => handlePromptClick(`${prompt.title} ${prompt.description}`)}
            >
              <div className='p-4'>
                <div className='flex items-center gap-3'>
                  <div className='bg-primary/10 text-primary group-hover:bg-primary/15 rounded-lg p-1.5 transition-colors'>
                    {prompt.icon}
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-foreground group-hover:text-primary text-sm font-medium transition-colors'>
                      {prompt.title}
                    </h3>
                    <p className='text-muted-foreground text-xs'>{prompt.description}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className='mt-12 text-center'>
        <p className='text-muted-foreground text-sm'>AI can make mistakes. Consider checking important information.</p>
      </div>
    </div>
  );
};

export default InitialChatPage;
