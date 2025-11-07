import { fetchEventSource } from '@microsoft/fetch-event-source';
import { AgentModel } from 'src/types';

interface Props {
    agentModel: AgentModel;
    agentSystemInstructions: string;
    prompt: string;
}

const createIntro = async ({
    agentModel,
    agentSystemInstructions,
    prompt
}: Props) => {
    await fetchEventSource(`${import.meta.env.VITE_FASTAPI_URL}/api/create-intro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            agentModel,
            agentSystemInstructions,
            prompt
        }),

        onmessage(ev) {
            console.log(ev);
        }
    });
};

export default createIntro;