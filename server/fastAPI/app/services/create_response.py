from ..utils.get_client import get_client

async def create_response(prompt: str) -> str:
    response = get_client().responses.create(
        model="gpt-5-nano",
        input=[
            {"role": "user", "content": prompt},
        ],
    )
    return response.output_text
