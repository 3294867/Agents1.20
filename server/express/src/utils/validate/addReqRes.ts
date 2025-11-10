import utils from "..";

interface Props {
    threadId: string;
    requestBody: string;
}

const addReqRes = ({ threadId, requestBody }: Props): string | null => {
    if (!threadId || !requestBody) {
        return "Missing required fields: threadId, requestBody";
    }

    if (!utils.regex.isUuidV4(threadId)) {
        return "Incorrect format of userId. Expected UUID_V4";
    }

    return null;
};

export default addReqRes;
