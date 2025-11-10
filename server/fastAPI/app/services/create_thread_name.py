from ..utils.get_client import get_client

async def create_thread_name(prompt: str) -> str:
    response = await get_client().responses.create(
        model="gpt-4o-mini",
        input=[
            {
                "role": "system",
                "content": (
                    "Return a short, clear title for the conversation that begins with question:\n"
                    f"{prompt}\n"
                    "Rules:\n"
                    "- Output only the title.\n"
                    "- Do not use quotes.\n"
                    "- Do not include 'Title:', or any extra words.\n"
                )
            },
        ]
    )
    return response.output_text