import { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { AgentModel, ReqRes } from 'src/types';
import fastAPI from 'src/routes/fastAPI';
import express from 'src/routes/express';
import indexedDB from 'src/storage/indexedDB';
import hooks from 'src/hooks';
import tabsStorage from 'src/storage/localStorage/tabsStorage';
import AgentModelDropdown from './AgentModelDropdown';
import Button from 'src/components/button';
import Textarea from 'src/components/textarea';
import Icons from 'src/assets/icons';
import styles from './Form.module.css';

const Form = () => {
  const {
    workspaceName,
    agentName,
    agentModel: initialAgentModel,
    agentSystemInstructions,
    threadId,
    threadBodyLength,
  } = hooks.features.useThreadContext();
  const [input, setInput] = useState<string>('');
  const [agentModel, setAgentModel] = useState<AgentModel>(initialAgentModel);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const newRequestId = uuidV4();
    const newResponseId = uuidV4();
    
    const {
      inferredAgentType,
      inferredResponseType: responseBodyType
    } = await fastAPI.inferAgentAndResponseTypes({ prompt: input });

    await fastAPI.createStream({
      agentModel,
      agentSystemInstructions,
      prompt: input,
      onStart: async () => {
        await indexedDB.addReqRes({
          threadId: threadId,
          reqres: {
            requestId: newRequestId,
            requestBody: input,
            responseId: newResponseId,
            responseBody: "",
            responseType: responseBodyType,
            inferredAgentType,
          } as ReqRes
        });
      },
      onToken: async (accumulatedResponse) => {
        await indexedDB.updateReqRes({
          threadId: threadId,
          reqres: {
            requestId: newRequestId,
            requestBody: input,
            responseId: newResponseId,
            responseBody: accumulatedResponse,
            responseType: responseBodyType,
            inferredAgentType,
          } as ReqRes
        });
      },
      onDone: async (accumulatedResponse) => {
        await express.addReqRes({
          threadId,
          requestId: newRequestId,
          requestBody: input,
          responseId: newResponseId,
          responseBody: accumulatedResponse,
          responseType: responseBodyType
        }); 
      },
      onError: async (accumulatedResponse) => {
        await indexedDB.updateReqRes({
          threadId: threadId,
          reqres: {
            requestId: newRequestId,
            requestBody: input,
            responseId: newResponseId,
            responseBody: accumulatedResponse,
            responseType: responseBodyType,
            inferredAgentType,
          } as ReqRes
        });
      },
    });

    setInput('');

    if (threadBodyLength === 0) {
      const threadName = await fastAPI.createThreadName({
        question: input,
        answer: ""
      });
      await express.updateThreadName({ threadId, threadName });
      await indexedDB.updateThreadName({ threadId, threadName });

      tabsStorage.updateName({ workspaceName, agentName, tabId: threadId, tabName: threadName });
    }

  };
  
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Ask anything...'
        spellCheck='false'
        className={styles.textarea}
      />
      <div className={styles.controls}>
        <div className={styles.leftControls}>
          <Button type='button' variant='outline' size='sm' className={styles.addButton}>
            <Icons.Add />
          </Button>
        </div>
        <div className={styles.rightControls}>
          <AgentModelDropdown agentModel={agentModel} setAgentModel={setAgentModel} />
          <Button type='submit' variant='outline' size='icon' className={styles.sendButton}>
            <Icons.Send />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Form;
