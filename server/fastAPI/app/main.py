from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import json
from fastapi.middleware.cors import CORSMiddleware
from app.routes.api_routes import router as api_router
from app.models.request_models import ResponseRequest
from app.utils.get_client import get_client

app = FastAPI(title="FastAPI AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/")
def root():
    return {"message": "Server is running"}

@app.websocket("/api/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Client connected")

    try:
        while True:
            raw_data = await websocket.receive_text()
            print("Received:", raw_data)
            parsed_data = json.loads(raw_data)
            props = ResponseRequest(**parsed_data)

            async with get_client().responses.stream(
                model=props.agentModel,
                instructions=props.agentSystemInstructions,
                input=props.prompt
            ) as stream:
                async for event in stream:
                    if event.type == "response.output_item.added":
                        await websocket.send_text("[START]")
                    elif event.type == "response.output_text.delta":
                        await websocket.send_text(event.delta)
                    elif event.type == "response.output_text.done":
                        await websocket.send_text("[DONE]")
                    elif event.type == "response.error":
                        await websocket.send_text(f"data: [ERROR] {event.error}")

    except WebSocketDisconnect:
        print("Client disconnected")