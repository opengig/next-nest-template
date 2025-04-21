'use client';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SessionProvider } from 'next-auth/react';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({error, resetErrorBoundary}: {error: Error, resetErrorBoundary: () => void}) {
  return (
    <div className="p-4">
      <h2>Something went wrong:</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  const onError = (error: Error) => {
    console.error('Error caught by ErrorBoundary:', error);
  };

	return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={onError}
      onReset={() => window.location.reload()}
    >
      <SessionProvider 
        refetchInterval={0} 
        refetchWhenOffline={false} 
        refetchOnWindowFocus={false}
      >
        <ThemeProvider attribute='class' defaultTheme='system' disableTransitionOnChange>
          <Toaster duration={2500} richColors closeButton position='top-right' />
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </SessionProvider>
    </ErrorBoundary>
	);
};

export default Providers;