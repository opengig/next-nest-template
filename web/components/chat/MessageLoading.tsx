import React from 'react';
import ShinyText from '@/components/ShinyText';

const MessageLoading = () => {
  return (
    <div className='my-5 flex max-w-full items-center gap-3'>
      <ShinyText text='AI is thinking...' className='font-medium' />
    </div>
  );
};

export default MessageLoading;
