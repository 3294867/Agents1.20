import asyncio
from ..utils.get_client import get_client

async def create_outro(agentModel, agentSystemInstructions, prompt: str) -> str:
    async def event_generator():
        try:
            async with get_client().responses.stream(
                model=agentModel,
                instructions=agentSystemInstructions,
                input=[
                    {
                        "role": "system",
                        "content": (
                            "You have ALREADY responded to the prompt with the previous API call."
                            "Return ONLY a short follow-up offer for additional information.\n"
                            "Example:\n\n"
                            "Prompt: \"List all La Liga winners since 2020.\"\n"
                            "Response: \"Would you like more information on any of these seasons or the winning teams?\"\n\n"
                        )
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
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

    return event