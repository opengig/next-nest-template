import React, { memo } from 'react';
import { Loader2 } from 'lucide-react';
import ShinyText from '@/components/ShinyText';
import { ToolProps } from '.';

const PureSearchWebTool = ({ tool }: ToolProps) => {
  if (!tool.input) {
    return null;
  }

  const isLoading = tool.state === 'input-streaming';
  if (!isLoading) {
    return null;
  }

  const query = tool.input?.query;

  return (
    <div className='my-1 flex w-fit items-center gap-1 rounded-md text-sm'>
      <Loader2 size={16} className='text-muted-foreground animate-spin' />
      <ShinyText text={`Searching for: ${query || 'Searching the web...'}`} />
    </div>
  );
};

const SearchWebTool = memo(PureSearchWebTool, (prevProps, nextProps) => {
  const prevArgs = JSON.stringify(prevProps.tool.input);
  const nextArgs = JSON.stringify(nextProps.tool.input);

  if (prevArgs !== nextArgs) {
    return false;
  }
  if (prevProps.tool.state !== nextProps.tool.state) {
    return false;
  }
  return true;
});
export default SearchWebTool;
