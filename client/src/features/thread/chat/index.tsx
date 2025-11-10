import { memo } from "react";
import hooks from "src/hooks";
import Answer from "./Answer";
import Question from "./question";
import styles from "./Chat.module.css";

const Chat = memo(() => {
    const { threadBody } = hooks.features.useThreadContext();

    return (
        <div id="chat" className={styles.chat}>
            {threadBody.length > 0 &&
                threadBody.map((i, idx) => (
                    <div key={idx} className={styles.messageGroup}>
                        <Question key={i.requestId} reqres={i} />
                        <Answer responseBody={i.responseBody} />
                    </div>
                ))}
        </div>
    );
});

export default Chat;
