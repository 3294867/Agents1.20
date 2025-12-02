from ..utils.get_client import get_client

async def get_table_data(prompt: str) -> str:
    response = await get_client().responses.create(
        model="gpt-4o-mini",
        input=[
            {
                "role": "system",
                "content": (
                    "You are a JSON generator."
                    "Return ONLY stringified JSON, not plain text or explanations."
                    "Example:\n\n"
                    "Prompt: \"List all La Liga winners since 2020.\"\n"
                    "Response: \"{\"columns\": [\"season\", \"winner\"], \"rows\": [{\"season\": \"2020–21\", \"winner\": \"Atlético Madrid\"}, {\"season\": \"2021–22\", \"winner\": \"Real Madrid\"}, {\"season\": \"2022–23\", \"winner\": \"FC Barcelona\"}, {\"season\": \"2023–24\", \"winner\": \"Real Madrid\"}, {\"season\": \"2024–25\", \"winner\": \"Real Madrid\"}]}\" \n\n"
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
    )
    return response.output_text