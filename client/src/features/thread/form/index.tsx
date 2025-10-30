import { memo, useState } from 'react';
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

const Form = memo(() => {
  const {
    workspaceName,
    agentName,
    agentModel: initialAgentModel,
    agentSystemInstructions,
    threadId,
    threadBodyLength,
    setStream    
  } = hooks.features.useThreadContext();
  const [input, setInput] = useState<string>('');
  const [agentModel, setAgentModel] = useState<AgentModel>(initialAgentModel);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const {
      inferredAgentType,
      inferredResponseType: responseBodyType,
      response: responseBody
    } = await fastAPI.createResponse({ agentModel, agentSystemInstructions, prompt: input });

    await fastAPI.createStream({
      agentModel,
      prompt: input,
      onToken: (chunk) => setStream(prev => prev + chunk),
      onError: (err) => setStream(prev => prev + "\n❌ " + err),
    });

    const { requestId, responseId } = await express.addReqRes({
      threadId,
      requestBody: input,
      responseBody,
      responseType: responseBodyType
    });
    
    setInput('');

    if (threadBodyLength === 0) {
      const threadName = await fastAPI.createThreadName({
        question: input,
        answer: responseBody
      });
      await express.updateThreadName({ threadId, threadName });
      await indexedDB.updateThreadName({ threadId, threadName });

      tabsStorage.updateName({ workspaceName, agentName, tabId: threadId, tabName: threadName });
    }

    await indexedDB.addReqRes({
      threadId: threadId,
      reqres: {
        requestId: requestId,
        requestBody: input,
        responseId: responseId,
        responseBody,
        responseType: responseBodyType,
        inferredAgentType,
        isNew: true
      } as ReqRes
    });
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
});

export default Form;
