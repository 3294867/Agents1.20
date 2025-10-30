import { fetchEventSource } from "@microsoft/fetch-event-source";

interface Props {
  agentModel: string;
  prompt: string;
  onToken?: (token: string) => void;
  onDone?: () => void;
  onError?: (error: string) => void;
}

const createStream = async ({
  agentModel,
  prompt,
  onToken,
  onDone,
  onError,
}: Props) => {
  await fetchEventSource(`${import.meta.env.VITE_FASTAPI_URL}/api/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agentModel, prompt }),

    onmessage(ev) {
      if (ev.data === "[DONE]") {
        onDone?.();
        return;
      }
      if (ev.data.startsWith("[ERROR]")) {
        onError?.(ev.data);
      } else {
        onToken?.(ev.data);
      }
    },

    onerror(err) {
      onError?.(err.message);
    },
  });
};

export default createStream;