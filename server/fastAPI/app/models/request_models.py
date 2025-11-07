from pydantic import BaseModel

class Request(BaseModel):
    prompt: str

class ResponseRequest(BaseModel):
    agentModel: str
    agentSystemInstructions: str
    prompt: str

class ThreadNameRequest(BaseModel):
    question: str
    answer: str