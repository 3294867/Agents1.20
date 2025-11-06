interface Props {
    prompt: string;
}

const createTable = async ({ prompt }: Props): Promise<string> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_FASTAPI_URL}/api/create-table`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ prompt })
        });
        
        if (!response.ok) throw new Error(`Failed to create table: ${response.text()}`);
        
        const body: { message: string, data: string } = await response.json();
        if (!body.data) throw new Error(`Failed to create table: ${body.message}`);
        
        return body.data;
    } catch (e) {
        throw new Error(`Failed to create table: ${e}`)
    }
};

export default createTable;