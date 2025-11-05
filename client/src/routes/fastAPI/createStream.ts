import { fetchEventSource } from "@microsoft/fetch-event-source";

interface Props {
  agentModel: string;
  agentSystemInstructions: string;
  prompt: string;
  onStart?: () => void;
  onToken?: (token: string) => void;
  onDone?: (accumulatedResponse: string) => void;
  onError?: (error: string) => void;
}

const createStream = async ({
  agentModel,
  agentSystemInstructions,
  prompt,
  onStart,
  onToken,
  onDone,
  onError,
}: Props) => {
  let accumulatedResponse = "";
  
  await fetchEventSource(`${import.meta.env.VITE_FASTAPI_URL}/api/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agentModel, agentSystemInstructions, prompt }),

    onmessage(ev) {
      if (ev.data === "[START]") onStart?.()
      else if (ev.data === "[DONE]") onDone?.(accumulatedResponse)
      else if (ev.data.startsWith("[ERROR]")) {
        onError?.(ev.data);
      } else {
        accumulatedResponse += ev.data;
        onToken?.(accumulatedResponse);
      }
    },

    onerror(e) {
      accumulatedResponse += e
      onError?.(accumulatedResponse);
    },
  });
};

export default createStream;