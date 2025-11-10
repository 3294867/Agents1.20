import dispatchEvent from 'src/events/dispatchEvent';
import { db } from './initialize';
import { ReqRes } from 'src/types';

interface Props {
  threadId: string;
  requestId: string;
  responseBodyItem: {type: string, content: string}
}

const updateReqResResponseBody = async ({ threadId, requestId, responseBodyItem }: Props): Promise<void> => {
  try {
    const savedThread = await db.threads.get(threadId);
    if (!savedThread) throw new Error('Thread not found');
    
    const threadBodyArray = Array.isArray(savedThread.body) ? savedThread.body : [];
    const reqresIndex = threadBodyArray.findIndex(i => i.requestId === requestId);
    
    const updatedReqResResponseBody = [...threadBodyArray[reqresIndex].responseBody, responseBodyItem];
    const updatedReqRes = {...threadBodyArray[reqresIndex], responseBody: updatedReqResResponseBody};
    const updatedBody: ReqRes[] = threadBodyArray.map((item, idx) =>
      idx === reqresIndex ? updatedReqRes : item
    );
    
    const updatedThread = await db.threads.update(threadId, {
      body: [...updatedBody]
    });
    if (updatedThread === 0) throw new Error('Failed to update thread');

    dispatchEvent.reqresUpdated({ threadId, reqres: updatedReqRes });

  } catch (error) {
    console.error('Failed to add reqres (IndexedDB): ', error);
  }
};

export default updateReqResResponseBody;