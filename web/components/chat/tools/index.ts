import { UIMessage, UIToolInvocation } from 'ai';
import SearchWebTool from './SearchWebTool';

export type ToolProps = {
  tool: UIToolInvocation<any>;
};

export const toolComponents = {
  'tool-web_search': SearchWebTool,
};
