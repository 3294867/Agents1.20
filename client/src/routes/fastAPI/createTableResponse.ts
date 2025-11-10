import { AgentModel, AgentType } from 'src/types';
import fastAPI from '.';

interface Props {
    threadId: string;
    agentModel: AgentModel;
    agentSystemInstructions: string;
    requestId: string;
    responseId: string;
    prompt: string;
    inferredAgentType: AgentType
}

const createTableResponse = async ({
    threadId,
    agentModel,
    agentSystemInstructions,
    requestId,
    responseId,
    prompt,
    inferredAgentType
}: Props): Promise<void> => {
    await fastAPI.blocks.createIntro({
        threadId,
        agentModel,
        agentSystemInstructions,
        prompt,
        requestId,
        responseId,
        inferredAgentType,
    });

    await fastAPI.blocks.createTable({
        threadId,
        requestId,
        prompt
    });

    await fastAPI.blocks.createOutro({
        threadId,
        agentModel,
        agentSystemInstructions,
        requestId,
        prompt
    });
};

export default createTableResponse;