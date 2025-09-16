import React from 'react';

const ErrorMessage = ({ error }: { error: string }) => {
  return (
    <div className={`my-5 flex max-w-full gap-3`}>
      <div className='bg-destructive/10 text-destructive w-full rounded-md px-4 py-2'>{error}</div>
    </div>
  );
};

export default ErrorMessage;
