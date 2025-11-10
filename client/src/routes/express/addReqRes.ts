interface Props {
  threadId: string;
  requestBody: string;
}

interface ReturnData {
  requestId: string;
  responseId: string;
}

const addReqRes = async ({ threadId, requestBody }: Props): Promise<ReturnData> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_EXPRESS_URL}/api/add-reqres`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        threadId, requestBody
      })
    });
    
    if (!response.ok) throw new Error(`Failed to add reqres (PostgresDB): ${response.text()}`);
    
    const body: {message: string, data: ReturnData | null} = await response.json();
    if (!body.data) throw new Error(body.message);

    return body.data;    
  } catch (error) {
    throw new Error(`Failed to add reqres (PostgresDB): ${error}`);
  }
};

export default addReqRes;