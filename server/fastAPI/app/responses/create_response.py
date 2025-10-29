from ..utils.get_client import get_client

async def create_response(agentModel, agentSystemInstructions, prompt: str) -> str:
    response = await get_client().responses.create(
        model=agentModel,
        input=[
            {
                "role": "system",
                "content": agentSystemInstructions
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
    )
    return response.output_text