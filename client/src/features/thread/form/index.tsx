import { useState } from "react";
import { AgentModel } from "src/types";
import fastAPI from "src/routes/fastAPI";
import express from "src/routes/express";
import indexedDB from "src/storage/indexedDB";
import hooks from "src/hooks";
import tabsStorage from "src/storage/localStorage/tabsStorage";
import AgentModelDropdown from "./AgentModelDropdown";
import Button from "src/components/button";
import Textarea from "src/components/textarea";
import Icons from "src/assets/icons";
import styles from "./Form.module.css";

const Form = () => {
    const {
        workspaceName,
        agentName,
        agentModel: initialAgentModel,
        agentSystemInstructions,
        threadId,
        threadBodyLength,
    } = hooks.features.useThreadContext();
    const [input, setInput] = useState<string>("");
    const [agentModel, setAgentModel] = useState<AgentModel>(initialAgentModel);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setInput("");
        let response: string = "";

        const [reqResIds, agentType, responseType] = await Promise.all([
            express.addReqRes({ threadId, requestBody: input }),
            fastAPI.blocks.inferAgentType({ prompt: input }),
            fastAPI.blocks.inferResponseType({ prompt: input }),
        ]);

        await indexedDB.addReqRes({
            threadId,
            reqres: {
                requestId: reqResIds.requestId,
                requestBody: input,
                responseId: reqResIds.responseId, 
                responseBody: [],
                inferredAgentType: agentType
            }
        });

        if (responseType === "text") {
            const textResponse = fastAPI.createTextResponse({
                agentModel,
                agentSystemInstructions,
                prompt: input
            });

            
            for await (const chunk of textResponse) {
                console.log("form: textResponse: ", textResponse)
                response += chunk;
                await indexedDB.updateReqRes({
                    threadId,
                    reqres: {
                        requestId: reqResIds.requestId,
                        requestBody: input,
                        responseId: reqResIds.responseId,
                        responseBody: [{
                            type: responseType,
                            content: response
                        }],
                        inferredAgentType: agentType
                    }
                });
            }

            await express.updateReqRes({
                threadId,
                responseBody: [{
                    type: responseType,
                    content: response
                }]
            });
        } else if (responseType === "bullet-list") {
            // TODO: createBulletListResponse()
        } else {
            // TODO: createTableResponse()
        }

        if (threadBodyLength === 0) {
            const threadName = await fastAPI.blocks.createThreadName({
                prompt: input,
            });
            await express.updateThreadName({ threadId, threadName });
            await indexedDB.updateThreadName({ threadId, threadName });

            tabsStorage.updateName({
                workspaceName,
                agentName,
                tabId: threadId,
                tabName: threadName,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                spellCheck="false"
                className={styles.textarea}
            />
            <div className={styles.controls}>
                <div className={styles.leftControls}>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={styles.addButton}
                    >
                        <Icons.Add />
                    </Button>
                </div>
                <div className={styles.rightControls}>
                    <AgentModelDropdown
                        agentModel={agentModel}
                        setAgentModel={setAgentModel}
                    />
                    <Button
                        type="submit"
                        variant="outline"
                        size="icon"
                        className={styles.sendButton}
                    >
                        <Icons.Send />
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default Form;
