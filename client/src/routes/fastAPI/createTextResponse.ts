import { fetchEventSource } from '@microsoft/fetch-event-source';
import { AgentModel, AgentType, ReqRes } from 'src/types';
import indexedDB from 'src/storage/indexedDB';
import express from 'src/routes/express';

interface Props {
    threadId: string;
    agentModel: AgentModel;
    agentSystemInstructions: string;
    prompt: string;
    requestId: string;
    responseId: string;
    inferredAgentType: AgentType;
}

const createTextResponse = async ({
    threadId,
    agentModel,
    agentSystemInstructions,
    prompt,
    requestId,
    responseId,
    inferredAgentType,
}: Props) => {
    let accumulatedResponse = "";
    
    await fetchEventSource(`${import.meta.env.VITE_FASTAPI_URL}/api/create-text-response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            agentModel,
            agentSystemInstructions,
            prompt
        }),

    onmessage(ev) {
        if (ev.data === "[START]") {
            const onStart = async () => {
                await indexedDB.addReqRes({
                    threadId: threadId,
                    reqres: {
                        requestId,
                        requestBody: prompt,
                        responseId,
                        responseBody: [],
                        inferredAgentType,
                    } as ReqRes
                });
            };
            onStart();
        }
        else if (ev.data === "[DONE]") {
            const onDone = async () => {
                await express.updateResponseBody({
                    responseId,
                    responseBody: [{type: 'text', content: accumulatedResponse}],
                });
            };
            onDone();
        }
        else if (ev.data.startsWith("[ERROR]")) {
            accumulatedResponse += ev.data
            const onError = async () => {
                await indexedDB.updateReqRes({
                    threadId: threadId,
                    reqres: {
                        requestId,
                        requestBody: prompt,
                        responseId,
                        responseBody: [{type: 'text', content: accumulatedResponse}],
                        inferredAgentType,
                    } as ReqRes
                });
            };
            onError();
        } else {
            accumulatedResponse += ev.data;
            const onToken = async () => {
                await indexedDB.updateReqRes({
                    threadId: threadId,
                    reqres: {
                        requestId,
                        requestBody: prompt,
                        responseId,
                        responseBody: [{type: 'text', content: accumulatedResponse}],
                        inferredAgentType,
                    } as ReqRes
                });
            };
            onToken();
        }
    },

    onerror(e) {
      accumulatedResponse += e
      const onError = async () => {
        await indexedDB.updateReqRes({
          threadId: threadId,
          reqres: {
            requestId,
            requestBody: prompt,
            responseId,
            responseBody: [{type: 'text', content: accumulatedResponse}],
            inferredAgentType,
          } as ReqRes
        });
      };
      onError();
    },
    });
};

export default createTextResponse;