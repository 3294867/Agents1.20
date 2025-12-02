from pydantic import BaseModel 
from typing import Literal, List
import json
from fastapi import WebSocket
from ..utils.get_client import get_client

class Request(BaseModel):
    responseType: str
    agentModel: str
    agentSystemInstructions: str
    prompt: str

Status = Literal["idle", "inprogress", "succeeded", "failed"]
OutputType = Literal["text", "bullet_list", "table"]

class Output(BaseModel):
    type: OutputType
    content: str
    status: Status

class Response(BaseModel):
    body: List[Output]
    status: Status

tools=[
    {
        "type": "custom",
        "name": "intro_generator",
        "description": """
            Return ONLY a short introductory sentence.\n
            Example:\n\n
            Prompt: \"List La Liga winners since 2020.\"\n
            Response: \"Sure! Here is a list of La Liga winners since 2020:\"\n\n 
        """
    },
    {
        "type": "custom",
        "name": "outro_generator",
        "description": """
            Return ONLY a short follow-up offer for additional information.\n
            Example:\n\n
            Prompt: \"List all La Liga winners since 2020.\"\n
            Response: \"Would you like more information on any of these seasons or the winning teams?\"\n\n
        """
    },
    {
        "type": "custom",
        "name": "bullet_list_data_generator",
        "description": """
            Return ONLY an array, not plain text or explanations.
            Example:\n\n
            Prompt: \"List all La Liga winners since 2020\"\n\n
            Response: \"[\"Atlético Madrid\", \"Real Madrid\", \"FC Barcelona\", \"Real Madrid\", \"Real Madrid\"]\" \n\n
        """
    },
    {
        "type": "custom",
        "name": "table_data_generator",
        "description": """
            You are a JSON generator.
            Return ONLY stringified JSON, not plain text or explanations.
            Example:\n\n
            Prompt: \"List all La Liga winners since 2020.\"\n
            Response: \"{\"columns\": [\"season\", \"winner\"], \"rows\": [{\"season\": \"2020–21\", \"winner\": \"Atlético Madrid\"}, {\"season\": \"2021–22\", \"winner\": \"Real Madrid\"}, {\"season\": \"2022–23\", \"winner\": \"FC Barcelona\"}, {\"season\": \"2023–24\", \"winner\": \"Real Madrid\"}, {\"season\": \"2024–25\", \"winner\": \"Real Madrid\"}]}\" \n\n
        """
    },
]

async def create_response(websocket: WebSocket):
    raw_data = await websocket.receive_text()
    parsed_data = json.loads(raw_data)
    props = Request(**parsed_data)

    async with get_client().responses.stream(
        model="gpt-5",
        instructions=props.agentSystemInstructions,
        tools=tools,
        input=[
            {
                "role": "system",
                "content": """
                    Use intro_generator, outro_generator, bullet_list_data_generator and table_data_generator tools
                    to return intro, main content and outro.
                    Choose between bullet_list_data_generator and table_data_generator depending on the passed responseBody.
                    For the text responseType return a string.
                """
            },
            {
                "role": "user",
                "content": f"prompt: {props.prompt}, responseType: {props.responseType}"
            }
        ],
        text_format=Response
    ) as stream:
        async for event in stream:
            print(event)
            if event.type == "response.output_item.added":
                await websocket.send_text("[START]")
            elif event.type == "response.output_text.delta":
                await websocket.send_text(event.delta)
            elif event.type == "response.output_text.done":
                await websocket.send_text("[DONE]")
            elif event.type == "response.error":
                await websocket.send_text(f"data: [ERROR] {event.error}")