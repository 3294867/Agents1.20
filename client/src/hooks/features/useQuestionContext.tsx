import { useContext } from "react";
import QuestionContext from 'src/features/thread/chat/question/QuestionContext';

const useQuestionContext = () => {
    const ctx = useContext(QuestionContext);
    if (!ctx) throw new Error("useQuestionContext must be within a Question");
    return ctx;
};

export default useQuestionContext;
