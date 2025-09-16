import React, { useRef, ChangeEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useChatTransitionStore } from '@/store/chatTransition';
import { UIMessage, UseChatHelpers } from '@ai-sdk/react';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_FILES_ALLOWED = 3;

interface HomeInputBoxProps {
  isSubmitting: boolean;
  onSubmit: UseChatHelpers<UIMessage>['sendMessage'];
  query: string;
  setQuery: (query: string) => void;
  initialPage?: boolean;
  onStop?: UseChatHelpers<UIMessage>['stop'];
}

const HomeInputBox: React.FC<HomeInputBoxProps> = ({
  isSubmitting,
  onSubmit,
  query,
  setQuery,
  initialPage = false,
  onStop,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { files, setFiles, removeFile, isUploading, clearTransition } = useChatTransitionStore();
  const [isDragging, setIsDragging] = useState(false);

  const handleInput = (): void => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const validateFile = (file: File): boolean => {
    if (file.type.startsWith('image/')) {
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(`Image size exceeds 5MB limit: ${file.name}`);
        return false;
      }
    } else if (file.type === 'application/pdf') {
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(`PDF size exceeds 5MB limit: ${file.name}`);
        return false;
      }
    } else {
      toast.error(`Only image and PDF files are allowed: ${file.name}`);
      return false;
    }
    return true;
  };

  const appendFiles = (newFiles: File[]) => {
    if (files.length >= MAX_FILES_ALLOWED) {
      toast.error(`Maximum ${MAX_FILES_ALLOWED} files allowed`);
      return;
    }

    const validFiles = newFiles.filter(validateFile);
    if (validFiles.length === 0) return;

    const remainingSlots = MAX_FILES_ALLOWED - files.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);

    if (validFiles.length > remainingSlots) {
      toast.error(`Only added ${remainingSlots} files. Maximum ${MAX_FILES_ALLOWED} files allowed`);
    }

    setFiles([...files, ...filesToAdd]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      appendFiles(Array.from(selectedFiles));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      appendFiles(Array.from(droppedFiles));
    }
    setIsDragging(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (items) {
      const pastedFiles = Array.from(items)
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null);

      if (pastedFiles.length > 0) {
        appendFiles(pastedFiles);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (initialPage) {
      onSubmit();
      return;
    }
    clearTransition();
    onSubmit();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className='mx-auto flex w-full max-w-3xl flex-col gap-2'
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className={cn('relative flex w-full flex-col gap-2 overflow-hidden rounded-xl', isSubmitting && 'opacity-90')}
      >
        <AnimatePresence>
          {isDragging && (
            <motion.div
              className='bg-muted/40 pointer-events-none absolute z-10 flex h-full w-full flex-col items-center justify-center gap-1 backdrop-blur-sm'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div>Drag and drop files here</div>
              <div className='text-muted-foreground text-sm'>{'(Max 3 files, images: 5MB)'}</div>
            </motion.div>
          )}
        </AnimatePresence>
        <input
          type='file'
          multiple
          accept='image/*'
          ref={fileInputRef}
          className='hidden'
          onChange={handleFileChange}
        />

        <div className='bg-card/80 border-input relative flex flex-col overflow-hidden rounded-xl border'>
          <textarea
            ref={textareaRef}
            disabled={isSubmitting}
            value={query}
            onInput={handleInput}
            onKeyDown={handleKeyPress}
            onPaste={handlePaste}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setQuery(e.target.value)}
            placeholder='How can I help you today?'
            className={cn(
              'placeholder:text-muted-foreground/60 h-auto max-h-[200px] min-h-[50px] w-full resize-none bg-transparent px-4 py-4 outline-none focus:ring-0',
              isSubmitting && 'cursor-not-allowed'
            )}
          />
          <div className='flex items-center justify-between gap-2 p-2 pt-0'>
            <div className='flex items-center gap-2'>
              <Button
                type='button'
                variant='ghost'
                onClick={handleUploadClick}
                size='icon'
                aria-label='Attach file'
                className='h-8 w-8'
                disabled={files.length >= MAX_FILES_ALLOWED || isSubmitting || isUploading}
              >
                <Paperclip className='text-muted-foreground h-4 w-4' />
              </Button>
              {isSubmitting && onStop ? (
                <Button type='button' className='rounded-xl' size='sm' onClick={onStop}>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Stop
                </Button>
              ) : (
                <Button
                  type='submit'
                  className='rounded-xl'
                  size='sm'
                  disabled={isSubmitting || !query?.trim() || isUploading}
                >
                  {isSubmitting || isUploading ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    <ArrowRight className='h-4 w-4' />
                  )}
                  Generate
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default HomeInputBox;
