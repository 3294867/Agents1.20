from fastapi.responses import StreamingResponse
import asyncio
from ..utils.get_client import get_client

async def create_intro(agentModel, agentSystemInstructions, prompt: str) -> str:
    async def event_generator():
        try:
            async with get_client().responses.stream(
                model=agentModel,
                instructions=agentSystemInstructions,
                input=[
                    {
                        "role": "system",
                        "content": (
                            "Acknowladge user request"
                            "Example:\n\n"
                            "Prompt:"
                            "List all La Liga winners since 2020\n\n"
                            "Response:"
                            "Sure, here is a list of La Liga winners since 2020:\n\n"
                        )
                    },
                    {
                        "role": "user",
                        "content": prompt
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