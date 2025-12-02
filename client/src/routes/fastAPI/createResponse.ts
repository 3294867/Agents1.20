import { AgentModel, ResponseType } from 'src/types';
import utils from 'src/utils';

interface Props {
    responseType: ResponseType;
    agentModel: AgentModel;
    agentSystemInstructions: string;
    prompt: string;
}

const createResponse = ({ responseType, agentModel, agentSystemInstructions, prompt }: Props) => {
    const ws = new WebSocket(`${import.meta.env.VITE_FASTAPI_URL}/api/create-response`);
    const gen = utils.features.createStreamGenerator({
        ws,
        body: {
            responseType,
            agentModel,
            agentSystemInstructions,
            prompt
        }
    })
    return gen;
};

export default createResponse;