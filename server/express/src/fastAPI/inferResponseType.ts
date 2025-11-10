interface Props {
    input: string;
}

const inferResponseType = async ({ input }: Props) => {
    const response = await fetch(
        `${process.env.FASTAPI_ROUTE}/api/infer-response-type`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input }),
        },
    );

    if (!response.ok) {
        throw new Error(`Failed to infer response type: ${response.text()}`);
    }

    const body: { message: string; data: string | null } =
        await response.json();
    if (!body.data)
        throw new Error(`Failed to infer response type: ${body.message}`);

    return body.data;
};

export default inferResponseType;
