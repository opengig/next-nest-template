import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';
import React from 'react';

type ImageViewProps = {
  imageUrl: string;
  imageAlt?: string;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const ImageView = ({ imageUrl, imageAlt, children, open, onOpenChange }: ImageViewProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent className='p-0 sm:min-w-2xl'>
        <DialogHeader className='hidden'>
          <DialogTitle>{imageAlt || 'Image'}</DialogTitle>
          <DialogDescription>{imageUrl}</DialogDescription>
        </DialogHeader>
        <Image
          src={imageUrl}
          alt={imageAlt || 'Image'}
          className='mx-auto h-full w-auto rounded-lg'
          width={1000}
          height={1000}
          unoptimized
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageView;
