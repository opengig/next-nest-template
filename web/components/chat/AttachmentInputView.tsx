import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import React, { memo } from 'react';
import ImageView from './message/ImageView';

type AttachmentInputViewProps = {
  files: File[];
  removeFile: (index: number) => void;
};

const AttachmentInputViewComponent = ({ files, removeFile }: AttachmentInputViewProps) => {
  return (
    <AnimatePresence>
      {files.length > 0 && (
        <div className='flex w-full flex-row gap-2 overflow-x-auto px-4 md:px-0'>
          {files.map((file, index) =>
            file.type?.startsWith('image') ? (
              <div key={`${file.name}-${index}`} className='relative'>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{
                    y: -10,
                    scale: 1.1,
                    opacity: 0,
                    transition: { duration: 0.2 },
                  }}
                  className='group relative'
                >
                  <ImageView imageUrl={URL.createObjectURL(file)} imageAlt={file.name}>
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className='h-[70px] w-auto cursor-pointer rounded-md'
                      width={280}
                      height={70}
                      unoptimized
                    />
                  </ImageView>
                  <button
                    onClick={() => removeFile(index)}
                    className='absolute top-px right-px rounded-full bg-red-500 p-0.5 text-white opacity-80 hover:opacity-100'
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              </div>
            ) : null
          )}
        </div>
      )}
    </AnimatePresence>
  );
};

const AttachmentInputView = memo(AttachmentInputViewComponent);

export default AttachmentInputView;
