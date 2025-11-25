import { AgentModel } from 'src/types';

interface Props {
    agentModel: AgentModel;
    agentSystemInstructions: string;
    prompt: string;
}

const createTextResponse = ({agentModel, agentSystemInstructions, prompt}: Props) => {
    const ws = new WebSocket(`${import.meta.env.VITE_FASTAPI_URL}/api/create-text-response`);
    
    return (async function* streamGenerator() {
        const queue: string[] = [];
        let resolveQueuePromise: (() => void) | null = null;

        const queuePromise = () =>
            new Promise<void>((res) => {
                resolveQueuePromise = res;
            });

        ws.onmessage = (event) => {
            queue.push(event.data);
            resolveQueuePromise?.();
        };

        ws.onopen = () => {
            ws.send(
                JSON.stringify({
                    agentModel,
                    agentSystemInstructions,
                    prompt,
                })
            );
        };

        let closed = false;
        ws.onclose = () => {
            closed = true;
            resolveQueuePromise?.();
        };

        while (!closed || queue.length > 0) {
            if (queue.length === 0) {
                await queuePromise();
            }
            while (queue.length > 0) {
                yield queue.shift()!;
            }
        }
    })();
};

export default createTextResponse;