from pydantic import BaseModel

class CreateResponseRequest(BaseModel):
    input: str

class CreateResponse(BaseModel):
    agentModel: str
    agentSystemInstructions: str
    prompt: str

class CreateThreadName(BaseModel):
    question: str
    answer: str