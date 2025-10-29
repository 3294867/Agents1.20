import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddAgent, ReqRes } from 'src/types';
import express from 'src/routes/express';
import fastAPI from 'src/routes/fastAPI';
import indexedDB from 'src/storage/indexedDB';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import hooks from 'src/hooks';
import utils from 'src/utils';
import Button from 'src/components/button';

interface Props {
  reqres: ReqRes;
  isEditing: boolean;
}

const ChangeAgentButton = memo(({ reqres, isEditing }: Props) => {
  const navigate = useNavigate();
  const {
    workspaceId,
    workspaceName,
    agentName: currentAgentName,
    agentType: currentAgentType,
    threadId
  } = hooks.features.useThreadContext();
  const currentThreadPositionY = hooks.features.useHandleThreadPostionY();
  
  const handleClick = async () => {
    /** Remove reqres from the 'body' property of the current thread (IndexedDB, PostgresDB) */
    await indexedDB.deleteReqRes({ threadId, requestId: reqres.requestId });
    await express.deleteReqRes({ threadId, requestId: reqres.requestId, responseId: reqres.responseId });
    
    /** Create and update 'name' property of the thread (OpenAI, IndexedDB, PostgresDB, localStorage) */
    const firstReqRes = await indexedDB.getFirstReqRes({ threadId });
    if (firstReqRes) {
      const threadName = await fastAPI.createThreadName({
        question: firstReqRes.requestBody,
        answer: firstReqRes.responseBody
      });

      await express.updateThreadName({ threadId, threadName });
      await indexedDB.updateThreadName({ threadId, threadName });
      tabsStorage.updateName({ workspaceName, agentName: currentAgentName, tabId: threadId, tabName: threadName });
    } else {
      await express.updateThreadName({ threadId, threadName: null });
      await indexedDB.updateThreadName({ threadId, threadName: null });
      tabsStorage.updateName({ workspaceName, agentName: currentAgentName, tabId: threadId, tabName: null });
    }

    /** Update 'positionY' property of the current thread (IndexedDB) */
    await indexedDB.updateThreadPositionY({ threadId, positionY: currentThreadPositionY });

    /** Load or create new agent */
    let newAgentData: { id: string, name: string } | null = null;
    const savedAgent = await indexedDB.getAgentByType({ agentType: reqres.inferredAgentType});
    if (savedAgent) {
      newAgentData = { id: savedAgent.id, name: savedAgent.name };
    } else {
      const availableAgentPostgres: AddAgent = await express.getAvailableAgentByType({ agentType: reqres.inferredAgentType })
      const { id: newAgentId, name: newAgentName } = await express.addAgent({ workspaceId, agentData: availableAgentPostgres });
      newAgentData = { id: newAgentId, name: newAgentName };
    }
    
    /** Create new thread (PostgresDB) */
    const newThread = await express.addThread({ agentId: newAgentData.id });

    /** Add new thread (IndexedDB) */
    await indexedDB.addNewThread({ ...newThread, agentId: newAgentData.id });

    /** Add reqres to the 'body' property of the new thread (IndexedDB, PostgresDB) */
    const { requestId: newRequestId, responseId: newResponseId } = await express.addReqRes({
      threadId: newThread.id,
      requestBody: reqres.requestBody,
      responseBody: reqres.responseBody,
      responseType: reqres.responseType
    });
    const newReqRes ={
      requestId: newRequestId,
      requestBody: reqres.requestBody,
      responseId: newResponseId,
      responseBody: reqres.responseBody,
      responseType: reqres.responseType,
      inferredAgentType: reqres.inferredAgentType,
      isNew: true,
    }
    await indexedDB.addReqRes({ threadId: newThread.id, reqres: newReqRes });

    /** Create and update 'name' property of the new thread (OpenAI, PostgresDB, IndexedDB) */
    const newThreadName = await fastAPI.createThreadName({
      question: reqres.requestBody,
      answer: reqres.responseBody
    });
    await express.updateThreadName({
      threadId: newThread.id,
      threadName: newThreadName
    });
    await indexedDB.updateThreadName({
      threadId: newThread.id,
      threadName: newThreadName
    });

    /** Add tab for the new thread (localStorage) */
    tabsStorage.add({ workspaceName, agentName: newAgentData.name, newTab: {
      id: newThread.id, workspaceId, agentId: newAgentData.id, name: newThreadName, isActive: true
    }});
    
    navigate(`/${workspaceName}/${newAgentData.name}/${newThread.id}`);
  };
  
  const buttonVariant = isEditing ? 'ghost' : reqres.isNew ? 'ghost' : 'outline';
  
  return currentAgentType !== reqres.inferredAgentType && (
    <Button
      onClick={handleClick}
      size='sm'
      variant={buttonVariant}
      style={{ borderRadius: '999px' }}
    >
      Open in {utils.capitalizeFirstLetter(String(reqres.inferredAgentType))} Agent
    </Button>
  )
});

export default ChangeAgentButton;