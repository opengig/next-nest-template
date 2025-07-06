import React from 'react';

const Container = ({ children, className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div className={`mx-auto w-full max-w-5xl space-y-6 p-3 sm:p-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Container;
