from ..utils.get_client import get_client

async def create_outro(agentModel, agentSystemInstructions, prompt: str) -> str:
    response = await get_client().responses.create(
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
    )
    return response.output_text