import UserMessage from './message/UserMessage';
import AIMessage from './message/AIMessage';
import { UIMessage } from 'ai';

interface ChatMessageProps {
  message: UIMessage;
}

function PureChatMessage({ message }: ChatMessageProps) {
  console.log('message', message);
  if (message.role === 'user') {
    return <UserMessage message={message} />;
  } else {
    return <AIMessage message={message} />;
  }
}

export const ChatMessage = PureChatMessage;
