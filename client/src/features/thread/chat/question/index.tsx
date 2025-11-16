import { memo, useState } from "react";
import { ReqRes } from "src/types";
import QuestionContext from './QuestionContext';
import hooks from "src/hooks";
import PauseRunButton from "./PauseRunButton";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import MoveButton from "./MoveButton";
import ChangeAgentButton from "./ChangeAgentButton";
import styles from "./Question.module.css";

const Question = memo(({ reqres }: { reqres: ReqRes }) => {
    const [input, setInput] = useState(reqres.requestBody);
    const [isEditing, setIsEditing] = useState(false);
    const { textareaRef } = hooks.features.useHandleQuestion({
        input,
        isEditing,
    });

    const context = {
        requestId: reqres.requestId,
        requestBody: reqres.requestBody,
        responseId: reqres.responseId,
        responseBody: reqres.responseBody,
        inferredAgentType: reqres.inferredAgentType,
        input,
        setInput,
        isEditing,
        setIsEditing,
        textareaRef
    };

    return (
        <QuestionContext.Provider value={context}>
            <div className={styles.container}>
                <div className={styles.actionButtonsOutside}>
                    <EditButton />
                    <DeleteButton />
                    <MoveButton />
                </div>
                <div id={`request_${reqres.requestId}`}>
                    <div>
                        <textarea
                            id={`textarea_${reqres.requestId}`}
                            ref={textareaRef}
                            disabled={!isEditing}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onBlur={() => setTimeout(() => setIsEditing(false), 100)}
                            spellCheck="false"
                            className={styles.textarea}
                        />
                        <div className={styles.actionButtonsInside}>
                            <ChangeAgentButton />
                            <PauseRunButton />
                        </div>
                    </div>
                </div>
            </div>
        </QuestionContext.Provider>
    );
});

export default Question;
