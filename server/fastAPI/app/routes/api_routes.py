from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.models.request_models import ( Request, ResponseRequest )
from app.services.infer_agent_type import infer_agent_type
from app.services.infer_response_type import infer_response_type
from app.services.create_thread_name import create_thread_name
from app.services.create_intro import create_intro
from app.services.create_text_response import create_text_response
from app.services.create_bullet_list import create_bullet_list
from app.services.create_table import create_table
from app.services.create_outro import create_outro
from app.services.extract_research_paper_details import extract_research_paper_details

router = APIRouter(prefix="/api", tags=["API Endpoints"])

@router.post("/infer-agent-type")
async def infer_agent_type_endpoint(request: Request):
    try:
        result = await infer_agent_type(request.prompt)
        return {"message": "Success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/infer-response-type")
async def infer_response_type_endpoint(request: Request):
    try:
        result = await infer_response_type(request.prompt)
        return {"message": "Success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create-text-response")
async def create_text_response_endpoint(request: ResponseRequest):
    try:
        event_generator = await create_text_response(
            request.agentModel,
            request.agentSystemInstructions,
            request.prompt 
        )
        return StreamingResponse(event_generator(), media_type="text/event-stream")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create-intro")
async def create_intro_endpoint(request: ResponseRequest):
    try:
        event_generator = await create_intro(
            request.agentModel,
            request.agentSystemInstructions,
            request.prompt 
        )
        return StreamingResponse(event_generator(), media_type="text/event-stream")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create-outro")
async def create_outro_endpoint(request: ResponseRequest):
    try:
        result = await create_outro(
            request.agentModel,
            request.agentSystemInstructions,
            request.prompt 
        )
        return {"message": "Success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create-bullet-list")
async def create_bullet_list_endpoint(request: Request):
    try:
        result = await create_bullet_list(request.prompt)
        return {"message": "Success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create-table")
async def create_table_endpoint(request: Request):
    try:
        result = await create_table(request.prompt)
        return {"message": "Success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
@router.post("/create-thread-name")
async def create_thread_name_endpoint(request: Request):
    try:
        result = await create_thread_name(request.prompt)
        return {"message": "Success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/extract_research_paper_details")
async def extract_research_paper_details_endpoint():
    try:
        result = await extract_research_paper_details()
        return {"message": "Success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))