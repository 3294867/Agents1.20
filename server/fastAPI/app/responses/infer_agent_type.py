from ..utils.get_client import get_client

async def infer_agent_type(prompt: str) -> str:
    response = await get_client().responses.create(
        model="gpt-4o-mini",
        input=[
            {
                "role": "system",
                "content": (
                    "Choose the most appropriate agent type for the user query.\n"
                    "Available agent types:\n"
                    "- general\n"
                    "- data-analyst\n"
                    "- copywriter\n"
                    "- devops-helper\n\n"
                    "Respond with exactly one word: 'general', 'data-analyst', 'copywriter', or 'devops-helper'."
                ),
            },
            {
                "role": "user",
                "content": prompt
            },
        ],
    )
    return response.output_text