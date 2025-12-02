const createStreamGenerator = ({ws, body}: {ws: WebSocket, body: any}) => {
    const gen = async function* streamGenerator() {
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
            ws.send(JSON.stringify(body));
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
    }();

    gen.next();
    return gen;
};

export default createStreamGenerator;