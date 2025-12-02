import { AgentModel } from 'src/types';
import utils from 'src/utils';

interface Props {
    agentModel: AgentModel;
    agentSystemInstructions: string;
    prompt: string;
}

const createTextResponse = ({agentModel, agentSystemInstructions, prompt}: Props) => {
    const ws = new WebSocket(`${import.meta.env.VITE_FASTAPI_URL}/api/create-text-response`);
    const gen = utils.features.createStreamGenerator({
        ws,
        body: {agentModel, agentSystemInstructions, prompt}
    })
    return gen;
};

export default createTextResponse;