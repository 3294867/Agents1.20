from ..utils.get_client import get_client

async def create_table(prompt: str) -> str:
    response = await get_client().responses.create(
        model="gpt-4o-mini",
        input=[
            {
                "role": "system",
                "content": (
                    "You are a JSON generator. "
                    "Return ONLY stringified JSON, not plain text or explanations."
                    "Example:\n\n"
                    "Prompt:"
                    "List all La Liga winners since 2020\n\n"
                    "Response:"
                    "{\"columns\": [\"Season\", \"Winner\"], \"rows\": [[\"2020–21\", \"Atlético Madrid\"], [\"2021–22\", \"Real Madrid\"], [\"2022–23\", \"FC Barcelona\"], [\"2023–24\", \"Real Madrid\"], [\"2024–25\", \"Real Madrid\"]]} \n\n"
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
    )
    return response.output_text