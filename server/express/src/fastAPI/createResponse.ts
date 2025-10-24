interface Props {
  input: string;
}

const createResponse = async ({ input }: Props): Promise<string> => {
  const response = await fetch(`${process.env.FASTAPI_ROUTE}/api/create-response`, {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify({ input })
  });

  if (!response.ok) {
    throw new Error(`Failed to get response (FastAPI): ${response.text()}`)
  }

  const body: { message: string, data: string | null } = await response.json();
  if (!body.data) throw new Error(`Failed to get response (FastAPI): ${body.message}`);

  return body.data;
};

export default createResponse;