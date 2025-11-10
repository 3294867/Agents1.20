interface Props {
    question: string;
    answer: string;
}

const createThreadName = async ({
    question,
    answer,
}: Props): Promise<string> => {
    const response = await fetch(
        `${process.env.FASTAPI_ROUTE}/api/create-thread-name`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question, answer }),
        },
    );

    if (!response.ok) {
        throw new Error(
            `Failed to create thread name (FastAPI): ${response.text()}`,
        );
    }

    const body: { message: string; data: string | null } =
        await response.json();
    if (!body.data)
        throw new Error(
            `Failed to create thread name (FastAPI): ${body.message}`,
        );

    return body.data;
};

export default createThreadName;
