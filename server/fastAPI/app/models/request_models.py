from pydantic import BaseModel

class CreateResponseRequest(BaseModel):
    input: str
