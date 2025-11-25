import { ResponseBody } from 'src/types';

interface Props {
    threadId: string;
    responseBody: ResponseBody;
}

const updateReqRes = async ({
    threadId,
    responseBody,
}: Props) => {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_EXPRESS_URL}/api/update-reqres`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    threadId,
                    responseBody,
                }),
            },
        );

        if (!response.ok) throw new Error(`Failed to update reqres (PostgresDB): ${response.text()}`);

        const body: { message: string } = await response.json();
        if (body.message !== "Success") throw new Error(body.message);

    } catch (e) {
        throw new Error(`Failed to add reqres (PostgresDB): ${e}`);
    }
};

export default updateReqRes;
