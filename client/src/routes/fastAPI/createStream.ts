import { fetchEventSource } from "@microsoft/fetch-event-source";
import indexedDB from 'src/storage/indexedDB';
import { AgentModel, AgentType, ReqRes } from 'src/types';
import express from '../express';

interface Props {
  route: string;
  threadId: string;
  agentModel: AgentModel;
  agentSystemInstructions: string;
  requestId: string;
  prompt: string;
  responseId: string;
  responseType: string;
  inferredAgentType: AgentType;
}

const createStream = async ({
  route,
  threadId,
  agentModel,
  agentSystemInstructions,
  requestId,
  prompt,
  responseId,
  responseType,
  inferredAgentType,
}: Props) => {
  let accumulatedResponse = "";
  
  await fetchEventSource(`${import.meta.env.VITE_FASTAPI_URL}/api/${route}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      agentModel,
      agentSystemInstructions,
      responseType,
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
              responseBody: "",
              responseType,
              inferredAgentType,
            } as ReqRes
          });
        };
        onStart();
      }
      else if (ev.data === "[DONE]") {
        const onDone = async () => {
          await express.addReqRes({
            threadId,
            requestId,
            requestBody: prompt,
            responseId,
            responseBody: accumulatedResponse,
            responseType
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
              responseBody: accumulatedResponse,
              responseType,
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
              responseBody: accumulatedResponse,
              responseType,
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
            responseBody: accumulatedResponse,
            responseType,
            inferredAgentType,
          } as ReqRes
        });
      };
      onError();
    },
  });
};

export default createStream;