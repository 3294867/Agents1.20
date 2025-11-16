import { AgentModel } from 'src/types';

interface Props {
    agentModel: AgentModel;
    agentSystemInstructions: string;
    prompt: string;
}

const createStream = ({agentModel, agentSystemInstructions, prompt}: Props) => {
    const ws = new WebSocket(`${import.meta.env.VITE_FASTAPI_URL}/api/ws`);

    ws.onopen = () => {
        console.log("WebSocket opened");

        ws.send(JSON.stringify({
            agentModel,
            agentSystemInstructions,
            prompt
        }));
    };
    
    ws.onmessage = (event) => {
        return event.data;
    };

    ws.onclose = () => {
        console.log("WebSocket closed");
    };
};

export default createStream;