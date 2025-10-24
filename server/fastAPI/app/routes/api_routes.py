from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.models.request_models import CreateResponseRequest
from app.services.create_response import create_response
from app.services.infer_agent_type import infer_agent_type
from app.services.infer_response_type import infer_response_type
from app.services.create_thread_name import create_thread_name

router = APIRouter(prefix="/api", tags=["API Endpoints"])

@router.post("/create-response")
async def create_response_endpoint(request: CreateResponseRequest):
    try:
        result = await create_response(request.input)
        return {"message": "Success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/infer-response-type")
async def infer_response_type_endpoint(request: CreateResponseRequest):
    try:
        result = await infer_response_type(request.input)
        return {"message": "Success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/infer-agent-type")
async def infer_agent_type_endpoint(request: CreateResponseRequest):
    try:
        result = await infer_agent_type(request.input)
        return {"message": "Success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class CreateThreadNameInput(BaseModel):
    question: str
    answer: str

@router.post("/create-thread-name")
async def create_thread_name_endpoint(input: CreateThreadNameInput):
    try:
        result = await create_thread_name(input.model_dump())
        return {"message": "Success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))