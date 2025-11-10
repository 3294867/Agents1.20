const createThreadName = async ({prompt}: {prompt: string}): Promise<string> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_FASTAPI_URL}/api/create-thread-name`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get thread name: ${response.text()}`);
    }
    
    const data: { message: string, data: string | null } = await response.json();
    if (!data.data) throw new Error(data.message);
    
    return data.data;
  } catch (error) {
    throw new Error(`Failed to create thread name (openAI): ${error}`);
  }
};

export default createThreadName;