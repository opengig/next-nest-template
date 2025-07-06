import React from 'react';

interface EmptyMessageProps {
  message: string;
  description: string;
  cta?: React.ReactNode;
}

const EmptyMessage = ({
  message = 'No Data Found',
  description = 'Check back later for new data.',
  cta,
}: EmptyMessageProps) => {
  return (
    <div className='flex min-h-[240px] flex-col items-center justify-center gap-4 py-12 text-center'>
      <div className='space-y-2'>
        <h3 className='text-foreground text-xl font-medium tracking-tight'>{message}</h3>
        <p className='text-muted-foreground max-w-md text-sm'>{description}</p>
      </div>
      {cta && <div className='mt-2'>{cta}</div>}
    </div>
  );
};

export default EmptyMessage;
