import { memo } from 'react';
import { AgentType } from 'src/types';
import Paragraph from 'src/components/paragraph';

interface AnswerProps {
  requestId: string;
  responseId: string;
  responseBody: string;
  inferredAgentType: AgentType;
}

const Answer = memo(({ responseBody }: AnswerProps) => {
  return <Paragraph style={{ lineHeight: '2' }}>{responseBody}</Paragraph>;
});

export default Answer;
