import { createContext } from "react";
import { AgentType, ResponseBody } from "src/types";

export interface QuestionContextType {
    requestId: string;
    requestBody: string;
    responseId: string;
    responseBody: ResponseBody;
    inferredAgentType: AgentType;
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

const QuestionContext = createContext<QuestionContextType | null>(null);

export default QuestionContext;
