import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { AddAgent } from "src/types";
import express from "src/routes/express";
import fastAPI from "src/routes/fastAPI";
import indexedDB from "src/storage/indexedDB";
import tabsStorage from "src/storage/localStorage/tabsStorage";
import hooks from "src/hooks";
import utils from "src/utils";
import Button from "src/components/button";

const ChangeAgentButton = memo(() => {
    const navigate = useNavigate();
    
    const {
        workspaceId,
        workspaceName,
        agentName: currentAgentName,
        agentType: currentAgentType,
        threadId,
    } = hooks.features.useThreadContext();
    
    const {
        requestId,
        requestBody,
        responseId,
        responseBody,
        inferredAgentType,
    } = hooks.features.useQuestionContext();
    
    const currentThreadPositionY = hooks.features.useHandleThreadPostionY();

    const handleClick = async () => {
        /** Remove reqres from the 'body' property of the current thread (IndexedDB, PostgresDB) */
        await indexedDB.deleteReqRes({ threadId, requestId });
        await express.deleteReqRes({
            threadId,
            requestId,
            responseId,
        });

        /** Create and update 'name' property of the thread (OpenAI, IndexedDB, PostgresDB, localStorage) */
        const firstReqRes = await indexedDB.getFirstReqRes({ threadId });
        if (firstReqRes) {
            const threadName = await fastAPI.blocks.createThreadName({
                prompt: firstReqRes.requestBody,
            });

            await express.updateThreadName({ threadId, threadName });
            await indexedDB.updateThreadName({ threadId, threadName });
            tabsStorage.updateName({
                workspaceName,
                agentName: currentAgentName,
                tabId: threadId,
                tabName: threadName,
            });
        } else {
            await express.updateThreadName({ threadId, threadName: null });
            await indexedDB.updateThreadName({ threadId, threadName: null });
            tabsStorage.updateName({
                workspaceName,
                agentName: currentAgentName,
                tabId: threadId,
                tabName: null,
            });
        }

        /** Update 'positionY' property of the current thread (IndexedDB) */
        await indexedDB.updateThreadPositionY({
            threadId,
            positionY: currentThreadPositionY,
        });

        /** Load or create new agent */
        let newAgentData: { id: string; name: string } | null = null;
        const savedAgent = await indexedDB.getAgentByType({
            agentType: inferredAgentType,
        });
        if (savedAgent) {
            newAgentData = { id: savedAgent.id, name: savedAgent.name };
        } else {
            const availableAgentPostgres: AddAgent =
                await express.getAvailableAgentByType({
                    agentType: inferredAgentType,
                });
            const { id: newAgentId, name: newAgentName } =
                await express.addAgent({
                    workspaceId,
                    agentData: availableAgentPostgres,
                });
            newAgentData = { id: newAgentId, name: newAgentName };
        }

        /** Create new thread (PostgresDB) */
        const newThread = await express.addThread({ agentId: newAgentData.id });

        /** Add new thread (IndexedDB) */
        await indexedDB.addNewThread({
            ...newThread,
            agentId: newAgentData.id,
        });

        /** Add reqres to the 'body' property of the new thread (IndexedDB, PostgresDB) */
        const { requestId: newRequestId, responseId: newResponseId } =
            await express.addReqRes({
                threadId: newThread.id,
                requestBody,
            });
        const newReqRes = {
            requestId: newRequestId,
            requestBody,
            responseId: newResponseId,
            responseBody,
            inferredAgentType,
        };
        await indexedDB.addReqRes({
            threadId: newThread.id,
            reqres: newReqRes,
        });

        /** Create and update 'name' property of the new thread (OpenAI, PostgresDB, IndexedDB) */
        const newThreadName = await fastAPI.blocks.createThreadName({
            prompt: requestBody
        });
        await express.updateThreadName({
            threadId: newThread.id,
            threadName: newThreadName,
        });
        await indexedDB.updateThreadName({
            threadId: newThread.id,
            threadName: newThreadName,
        });

        /** Add tab for the new thread (localStorage) */
        tabsStorage.add({
            workspaceName,
            agentName: newAgentData.name,
            newTab: {
                id: newThread.id,
                workspaceId,
                agentId: newAgentData.id,
                name: newThreadName,
                isActive: true,
            },
        });

        navigate(`/${workspaceName}/${newAgentData.name}/${newThread.id}`);
    };

    return (
        currentAgentType !== inferredAgentType && (
            <Button
                onClick={handleClick}
                size="sm"
                variant="outline"
                style={{ borderRadius: "999px" }}
            >
                Open in{" "}
                {utils.capitalizeFirstLetter(String(inferredAgentType))}{" "}
                Agent
            </Button>
        )
    );
});

export default ChangeAgentButton;
