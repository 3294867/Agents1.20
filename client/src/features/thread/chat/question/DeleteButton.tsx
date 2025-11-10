import { memo } from "react";
import express from "src/routes/express";
import indexedDB from "src/storage/indexedDB";
import hooks from "src/hooks";
import dispatchEvent from "src/events/dispatchEvent";
import tabsStorage from "src/storage/localStorage/tabsStorage";
import Button from "src/components/button";
import Icons from "src/assets/icons";

const DeleteButton = memo(() => {
    const {
        workspaceName,
        agentName,
        threadId,
        threadBodyLength
    } = hooks.features.useThreadContext();

    const {
        requestId,
        responseId
    } = hooks.features.useQuestionContext();

    const handleClick = async () => {
        await express.deleteReqRes({ threadId, requestId, responseId });
        await indexedDB.deleteReqRes({ threadId, requestId });

        if (threadBodyLength == 1) {
            await express.removeThreadName({ threadId });
            await indexedDB.removeThreadName({ threadId });
            tabsStorage.updateName({
                workspaceName,
                agentName,
                tabId: threadId,
                tabName: null,
            });
            dispatchEvent.threadNameUpdated({ threadName: null });
        }
    };

    return (
        <Button onClick={handleClick} variant="ghost" size="icon">
            <Icons.Delete />
        </Button>
    );
});

export default DeleteButton;
