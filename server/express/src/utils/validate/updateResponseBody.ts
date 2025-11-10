import utils from '..';
import { ResponseBody } from '../../types';

interface Props {
  responseId: string;
  responseBody: ResponseBody;
}

const updateResponseBody = ({ responseId, responseBody }: Props): string | null => {
  if (!responseId || !responseBody) {
    return "Missing required fields: responseId, responseBody";
  }

  if (!utils.regex.isUuidV4(responseId)) {
    return "Incorrect format of responseId. Expected UUID_V4";
  }

  return null;
};

export default updateResponseBody;