from ..utils.get_client import get_client

async def create_bullet_list(prompt: str) -> str:
    response = await get_client().responses.create(
        model="gpt-4o-mini",
        input=[
            {
                "role": "system",
                "content": (
                    "Return ONLY an array, not plain text or explanations."
                    "Example:\n\n"
                    "Prompt: \"List all La Liga winners since 2020\"\n\n"
                    "Response: [\"Atlético Madrid\", \"Real Madrid\", \"FC Barcelona\", \"Real Madrid\", \"Real Madrid\"] \n\n"
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
    )
    return response.output_text