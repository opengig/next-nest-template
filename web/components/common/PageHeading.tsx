import { LucideIcon } from 'lucide-react';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

type Props =
  | {
      Icon: LucideIcon;
      heading: string;
      description?: string;
      cta?: React.ReactNode;
      isLoading?: boolean;
    }
  | {
      Icon?: LucideIcon;
      heading?: string;
      description?: string;
      cta?: React.ReactNode;
      isLoading: true;
    };

export const PageHeading = ({ Icon, heading, description, cta, isLoading }: Props) => {
  if (isLoading) {
    return <PageHeadingSkeleton />;
  }
  return (
    <div className='flex items-center justify-between'>
      <div className='space-y-1'>
        <div className='flex items-center gap-2'>
          <Icon className='h-5 w-5' />
          <h1 className='text-lg font-semibold tracking-tight'>{heading}</h1>
        </div>
        {description && <p className='text-muted-foreground mt-1 text-sm'>{description}</p>}
      </div>
      {cta && <div className='flex items-center gap-2'>{cta}</div>}
    </div>
  );
};

const PageHeadingSkeleton = () => {
  return (
    <div className='flex items-center justify-between'>
      <div className='space-y-1'>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-5 w-5' />
          <Skeleton className='h-5 w-32' />
        </div>
        <Skeleton className='h-4 w-48' />
      </div>
      <div className='flex items-center gap-2'>
        <Skeleton className='h-8 w-32' />
      </div>
    </div>
  );
};
