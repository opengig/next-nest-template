import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  showChildren?: boolean;
}

const LoadingButton = ({ loading, children, disabled, showChildren = true, ...props }: LoadingButtonProps) => {
  return (
    <Button disabled={loading || disabled} {...props}>
      {loading ? (
        <>
          <Loader2 className='h-4 w-4 animate-spin' />
          {showChildren ? children : null}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton;
