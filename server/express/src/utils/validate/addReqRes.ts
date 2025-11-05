import utils from '..';
import { pool } from '../..';

interface Props {
  threadId: string;
  requestBody: string;
  responseBody: string;
  responseType: string;
}

const addReqRes = async ({ threadId, requestBody, responseBody, responseType }: Props): Promise<string | null> => {
  if (!threadId || !requestBody || !responseBody || !responseType) {
    return "Missing required fields: threadId, requestBody, responseBody, responseType";
  }

  if (!utils.regex.isUuidV4(threadId)) {
    return "Incorrect format of userId. Expected UUID_V4";
  }

  const selectedThread = await pool.query(`
    SELECT id
    FROM threads
    WHERE id = $1::uuid;
  `, [ threadId ]);
  if (selectedThread.rows.length === 0) return "Thread does not exist"; 

  return null;
};

export default addReqRes;