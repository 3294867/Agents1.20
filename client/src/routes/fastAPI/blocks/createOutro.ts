import indexedDB from 'src/storage/indexedDB';
import { AgentModel } from 'src/types';

interface Props {
    threadId: string;
    agentModel: AgentModel;
    agentSystemInstructions: string;
    requestId: string;
    prompt: string;
}

const createOutro = async ({threadId, agentModel, agentSystemInstructions, requestId, prompt}: Props): Promise<{type: string, content: string}> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_FASTAPI_URL}/api/create-outro`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                agentModel,
                agentSystemInstructions,
                prompt
            })
        });
        
        if (!response.ok) throw new Error(`Failed to create outro: ${response.text()}`);
        
        const body: { message: string, data: string } = await response.json();
        if (!body.data) throw new Error(`Failed to create outro: ${body.message}`);
        
        await indexedDB.updateReqResResponseBody({
            threadId,
            requestId,
            responseBodyItem: {type: 'text', content: body.data},
        });

        return {type: 'table', content: body.data};
    } catch (e) {
        throw new Error(`Failed to create table: ${e}`)
    }
};

export default createOutro;