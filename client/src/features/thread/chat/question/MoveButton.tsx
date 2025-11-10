import { memo } from "react";
import { useNavigate } from "react-router-dom";
import indexedDB from "src/storage/indexedDB";
import hooks from "src/hooks";
import tabsStorage from "src/storage/localStorage/tabsStorage";
import Button from "src/components/button";
import Icons from "src/assets/icons";
import express from "src/routes/express";
import fastAPI from "src/routes/fastAPI";

const MoveButton = memo(() => {
    const navigate = useNavigate();
    const {
        workspaceId,
        workspaceName,
        agentId,
        agentName,
        threadId,
        threadBodyLength,
        threadPositionY,
    } = hooks.features.useThreadContext();

    const {
        requestId,
        requestBody,
        responseId,
        responseBody,
        inferredAgentType,
    } = hooks.features.useQuestionContext();

    const handleClick = async () => {
        /** Remove reqres from the 'body' property of the current thread (IndexedDB, PostgresDB) */
        await indexedDB.deleteReqRes({ threadId, requestId });
        await express.deleteReqRes({ threadId, requestId, responseId });

        /** Create and update 'title' property of the thread (OpenAI, IndexedDB, PostgresDB, localStorage) */
        const firstReqRes = await indexedDB.getFirstReqRes({ threadId });
        if (firstReqRes) {
            const threadName = await fastAPI.createThreadName({
                question: firstReqRes.requestBody,
                answer: firstReqRes.responseBody,
            });
            await express.updateThreadName({ threadId, threadName });
            await indexedDB.updateThreadName({ threadId, threadName });
            tabsStorage.updateName({
                workspaceName,
                agentName,
                tabId: threadId,
                tabName: threadName,
            });
        } else {
            await express.updateThreadName({ threadId, threadName: null });
            await indexedDB.updateThreadName({
                threadId,
                threadName: null,
            });
            tabsStorage.updateName({
                workspaceName,
                agentName,
                tabId: threadId,
                tabName: null,
            });
        }

        /** Update 'positionY' property of the current thread (IndexedDB) */
        await indexedDB.updateThreadPositionY({
            threadId,
            positionY: threadPositionY,
        });

        /** Create new thread (PostgresDB) */
        const newThread = await express.addThread({ agentId });
        if (!newThread) return;

        /** Add new thread (IndexedDB) */
        await indexedDB.addNewThread({
            id: newThread.id,
            agentId,
            createdAt: newThread.createdAt,
            updatedAt: newThread.updatedAt,
        });

        /** Add reqres to the 'body' property of the new thread (IndexedDB, PostgresDB) */
        const { requestId: newRequestId, responseId: newResponseId } =
            await express.addReqRes({
                threadId: newThread.id,
                requestBody,
                responseBody,
                responseType,
            });

        const reqres = {
            requestId: newRequestId,
            requestBody,
            responseId: newResponseId,
            responseBody,
            responseType,
            inferredAgentType,
            isNew: true,
        };
        await indexedDB.addReqRes({ threadId: newThread.id, reqres });

        /** Create and update 'name' property of the new thread (OpenAI, PostgresDB, IndexedDB) */
        const newThreadName = await fastAPI.createThreadName({
            question: requestBody,
            answer: responseBody,
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
            agentName,
            newTab: {
                id: newThread.id,
                workspaceId,
                agentId,
                name: newThreadName,
                isActive: true,
            },
        });

        navigate(`/${workspaceName}/${agentName}/${newThread.id}`);
    };

    return (
        threadBodyLength > 1 && (
            <Button onClick={handleClick} variant="ghost" size="icon">
                <Icons.Move />
            </Button>
        )
    );
});

export default MoveButton;
