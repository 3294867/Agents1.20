from ..utils.get_client import get_client

async def create_thread_name(input: dict) -> str:
    question = input.get("question", "")
    answer = input.get("answer", "")

    response = await get_client().responses.create(
        model="gpt-4o-mini",
        input=[
            {
                "role": "system",
                "content": (
                    "Return a short, clear title for the conversation.\n"
                    "Rules:\n"
                    "- Output only the title.\n"
                    "- Do not use quotes.\n"
                    "- Do not include 'Title:', or any extra words.\n"
                )
            },
            {
                "role": "user",
                "content": (
                    f"Question: {question}\n"
                    f"Answer: {answer}"
                )
            }
        ]
    )
    return response.output_text