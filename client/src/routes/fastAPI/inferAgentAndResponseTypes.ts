import { AgentType } from 'src/types';

interface Props {
  prompt: string;
}

interface ResponseData {
  inferredAgentType: AgentType;
  inferredResponseType: string;
}

const inferAgentAndResponseTypes = async ({ prompt }: Props): Promise<ResponseData> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_FASTAPI_URL}/api/infer-agent-and-response-types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error(`Failed to infer agent and response types: ${response.text()}`);
    }

    const body: { message: string, data: ResponseData | null } = await response.json();
    if (!body.data) {
      throw new Error(`Failed to infer agent and response types: ${body.message}`);
    }

    return body.data as ResponseData
  } catch (e) {
    throw new Error(`Failed to infer agent and response types: ${e}`);
  }
};

export default inferAgentAndResponseTypes;