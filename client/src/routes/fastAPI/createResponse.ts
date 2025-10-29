import { AgentModel, AgentType, ResponseType } from 'src/types';

interface Props {
  agentModel: AgentModel,
  agentSystemInstructions: string;
  prompt: string;
}

interface ResponseData {
  inferredAgentType: AgentType;
  inferredResponseType: string;
  response: ResponseType;
}

const createResponse = async ({ agentModel, agentSystemInstructions, prompt }: Props): Promise<ResponseData> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_FASTAPI_URL}/api/create-response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentModel, agentSystemInstructions, prompt })
    });

    if (!response.ok) {
      throw new Error(`Failed to get chatgpt response: ${response.text()}`);
    }

    const body: { message: string, data: ResponseData | null } = await response.json();
    if (!body.data) {
      throw new Error(`Failed to get chatgpt response: ${body.message}`);
    }

    return body.data as ResponseData
  } catch (e) {
    throw new Error(`Failed to get chatgpt response: ${e}`);
  }
};

export default createResponse;