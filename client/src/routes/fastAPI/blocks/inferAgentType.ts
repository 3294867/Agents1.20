import { AgentType } from 'src/types';

const inferAgentType = async ({prompt}: {prompt: string}): Promise<AgentType> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_FASTAPI_URL}/api/infer-agent-type`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error(`Failed to infer agent type: ${response.text()}`);
    }

    const body: { message: string, data: AgentType | null } = await response.json();
    if (!body.data) {
      throw new Error(`Failed to infer agent type: ${body.message}`);
    }

    return body.data as AgentType;
  } catch (e) {
    throw new Error(`Failed to infer agent type: ${e}`);
  }
};

export default inferAgentType;