import { UIToolInvocation } from 'ai';
import SearchWebTool from './SearchWebTool';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ToolProps = {
  tool: UIToolInvocation<any>;
};

export const toolComponents = {
  'tool-web_search': SearchWebTool,
};
