interface Props {
  threadId: string;
  requestId: string;
  requestBody: string;
  responseId: string;
  responseBody: string;
  responseType: string;
}

const addReqRes = async ({ threadId, requestId, requestBody, responseId, responseBody, responseType }: Props): Promise<void> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_EXPRESS_URL}/api/add-reqres`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        threadId, requestId, requestBody, responseId, responseBody, responseType
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add reqres (PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string } = await response.json();
    if (data.message !== "Success") throw new Error(data.message);
    
  } catch (error) {
    throw new Error(`Failed to add reqres (PostgresDB): ${error}`);
  }
};

export default addReqRes;