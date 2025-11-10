import { memo } from "react";
import fastAPI from "src/routes/fastAPI";
import express from "src/routes/express";
import indexedDB from "src/storage/indexedDB";
import hooks from "src/hooks";
import tabsStorage from "src/storage/localStorage/tabsStorage";
import dispatchEvent from "src/events/dispatchEvent";
import Button from "src/components/button";
import Icons from "src/assets/icons";
import styles from "./PauseRunButton.module.css";

const PauseRunButton = memo(() => {
    const {
        workspaceName,
        agentName,
        agentModel,
        agentSystemInstructions,
        threadId,
        threadBodyLength,
    } = hooks.features.useThreadContext();

    const {
        requestId,
        responseId,
        input,
        isEditing,
        setIsEditing,
    } = hooks.features.useQuestionContext();

    const handlePause = () => {
        setIsEditing(true);
        dispatchEvent.responsePaused({ requestId, responseId });
    };

    const handleRun = async () => {
        setIsEditing(false);

        const [ agentType, responseType ] = await Promise.all([
            fastAPI.blocks.inferAgentType({ prompt: input }),
            fastAPI.blocks.inferResponseType({ prompt: input }),
        ]);
        
        const props = {
            threadId,
            agentModel,
            agentSystemInstructions,
            prompt: input,
            requestId,
            responseId,
            inferredAgentType: agentType,
        };
        
        // TODO: Update after implementing structured outputs
        if (responseType === "text") {
            await fastAPI.createTextResponse(props);
        } else if (responseType === "bullet-list") {
            await fastAPI.createBulletListResponse(props);
        } else {
            await fastAPI.createTableResponse(props);
        }

        if (threadBodyLength === 0) {
            const newThreadName = await fastAPI.blocks.createThreadName({
                prompt: input,
            });
            await express.updateThreadName({
                threadId,
                threadName: newThreadName,
            });
            await indexedDB.updateThreadName({
                threadId,
                threadName: newThreadName,
            });
            tabsStorage.updateName({
                workspaceName,
                agentName,
                tabId: threadId,
                tabName: newThreadName,
            });
        }
    };

    // TODO: Update after rewriting schema and types
    const reqResStatus = "completed" as "generating" | "completed";

    return (
        <div className={styles.container}>
            {isEditing ? (
                <Button
                    onClick={handleRun}
                    size="icon"
                    variant="outline"
                    style={{ width: "2rem", height: "2rem" }}
                >
                    <Icons.Run />
                </Button>
            ) : reqResStatus === 'generating' ? (
                <Button
                    onClick={handlePause}
                    size="icon"
                    variant="outline"
                    style={{ width: "2rem", height: "2rem" }}
                >
                    <Icons.Pause />
                </Button>
            ) : null}
        </div>
    );
});

export default PauseRunButton;
