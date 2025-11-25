import utils from "..";
import { ResponseBody } from '../../types';

interface Props {
    threadId: string;
    responseBody: ResponseBody;
}

const updateReqRes = ({ threadId, responseBody }: Props): string | null => {
    if (!threadId || !responseBody) {
        return "Missing required fields: threadId, responseBody";
    }

    if (!utils.regex.isUuidV4(threadId)) {
        return "Incorrect format of threadId. Expected UUID_V4";
    }

    return null;
};

export default updateReqRes;
