from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import asyncio
from app.models.request_models import CreateResponseRequest, CreateResponse, CreateThreadName, CreateStream, InferAgentAndResponseTypes, CreateTable, Request
from app.services.create_combined_response import create_combined_response
from app.services.infer_agent_type import infer_agent_type
from app.services.infer_response_type import infer_response_type
from app.services.create_thread_name import create_thread_name
from app.services.create_intro import create_intro
from app.services.create_table import create_table
from app.services.create_outro import create_outro
from app.utils.get_client import get_client

router = APIRouter(prefix="/api", tags=["API Endpoints"])

@router.post("/create-response")
async def create_response_endpoint(request: CreateResponse):
    try:
        result = await create_combined_response(
            request.agentModel,
            request.agentSystemInstructions,
            request.prompt
        )
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

@router.post("/create-thread-name")
async def create_thread_name_endpoint(input: CreateThreadName):
    try:
        result = await create_thread_name(input.model_dump())
        return {"message": "Success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/infer-agent-and-response-types")
async def infer_agent_and_response_types_endpoint(request: InferAgentAndResponseTypes):
    try:
        agent_type, response_type = await asyncio.gather(
            infer_agent_type(request.prompt),
            infer_response_type(request.prompt)
        )
        return {"message": "Success", "data": {
            "inferredAgentType": agent_type,
            "inferredResponseType": response_type
        }}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stream")
async def stream(request: CreateStream):
    async def event_generator():
        try:
            async with get_client().responses.stream(
                model=request.agentModel,
                input=[
                    {
                        "role": "system",
                        "content": request.agentSystemInstructions
                    },
                    {
                        "role": "user",
                        "content": request.prompt
                    }
                ]
            ) as stream:
                async for event in stream:
                    if event.type == "response.output_item.added":
                        yield f"data: [START]\n\n"
                    elif event.type == "response.output_text.delta":
                        yield f"data: {event.delta}\n\n"
                        await asyncio.sleep(0)
                    if event.type == "response.output_text.done":
                        yield f"data: [DONE]\n\n"
                    elif event.type == "response.error":
                        yield f"data: [ERROR] {event.error}\n\n"

        except Exception as e:
            yield f"data: [ERROR] {str(e)}\n\n"
    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.post("/create-intro")
async def create_intro_endpoint(request: CreateResponse):
    await create_intro(
        request.agentModel,
        request.agentSystemInstructions,
        request.prompt 
    )
    
@router.post("/create-table")
async def create_table_endpoint(request: CreateTable):
    try:
        result = await create_table(request.prompt)
        return {"message": "Success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create-outro")
async def create_outro_endpoint(request: CreateResponse):
    await create_outro(
        request.agentModel,
        request.agentSystemInstructions,
        request.prompt
    )
