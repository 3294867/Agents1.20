const createBulletList = async ({prompt}: {prompt: string}): Promise<string[]> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_FASTAPI_URL}/api/create-bullet-list`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ prompt })
        });
        
        if (!response.ok) throw new Error(`Failed to create bullet list: ${response.text()}`);
        
        const body: { message: string, data: string[] } = await response.json();
        if (!body.data) throw new Error(`Failed to create bullet list: ${body.message}`);
        
        return body.data;
    } catch (e) {
        throw new Error(`Failed to create bullet list: ${e}`)
    }
};

export default createBulletList;