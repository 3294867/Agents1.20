from ..utils.get_client import get_client

async def create_response(prompt: str) -> str:
    response = get_client().responses.create(
        model="gpt-4o-mini",
        input=[
            {"role": "user", "content": prompt},
        ],
    )
    return response.output_text
