from pydantic import BaseModel

class Request(BaseModel):
    prompt: str

class CreateResponseRequest(BaseModel):
    input: str

class InferAgentAndResponseTypes(BaseModel):
    prompt: str

class CreateResponse(BaseModel):
    agentModel: str
    agentSystemInstructions: str
    prompt: str

class CreateThreadName(BaseModel):
    question: str
    answer: str

class CreateStream(BaseModel):
    agentModel: str
    agentSystemInstructions: str
    responseType: str
    prompt: str

class CreateTable(BaseModel):
    prompt: str