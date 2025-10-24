interface Props {
  input: string;
}

const inferAgentType = async ({ input }: Props): Promise<string> => {
  const response = await fetch(`${process.env.FASTAPI_ROUTE}/api/infer-agent-type`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
  });

  if (!response.ok) {
    throw new Error(`Failed to infer agent type: ${response.text()}`);
  }

  const body: { message: string; data: string | null } = await response.json();
  if (!body.data) throw new Error(`Failed to infer agent type: ${body.message}`);

  return body.data;
};

export default inferAgentType;
