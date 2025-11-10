import { ResponseType } from 'src/types';

const inferResponseType = async ({prompt}: {prompt: string}): Promise<ResponseType> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_FASTAPI_URL}/api/infer-response-type`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error(`Failed to infer response type: ${response.text()}`);
    }

    const body: { message: string, data: ResponseType | null } = await response.json();
    if (!body.data) {
      throw new Error(`Failed to infer response type: ${body.message}`);
    }

    return body.data as ResponseType;
  } catch (e) {
    throw new Error(`Failed to infer response type: ${e}`);
  }
};

export default inferResponseType;