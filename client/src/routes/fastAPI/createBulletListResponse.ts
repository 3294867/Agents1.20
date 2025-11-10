import { AgentModel, AgentType } from "src/types";
import fastAPI from ".";

interface Props {
    threadId: string;
    agentModel: AgentModel;
    agentSystemInstructions: string;
    requestId: string;
    responseId: string;
    prompt: string;
    inferredAgentType: AgentType;
}

const createBulletListResponse = async ({
    threadId,
    agentModel,
    agentSystemInstructions,
    requestId,
    responseId,
    prompt,
    inferredAgentType,
}: Props) => {
    const [intro, bulletList, outro] = await Promise.all([
        fastAPI.blocks.createIntro({
            threadId,
            agentModel,
            agentSystemInstructions,
            prompt,
            requestId,
            responseId,
            inferredAgentType,
        }),
        fastAPI.blocks.createBulletList({
            prompt,
        }),
        fastAPI.blocks.createOutro({
            threadId,
            agentModel,
            agentSystemInstructions,
            prompt,
            requestId,
            responseId,
            inferredAgentType,
        }),
    ]);

    return [intro, bulletList, outro];
};

export default createBulletListResponse;
