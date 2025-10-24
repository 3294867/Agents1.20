from ..utils.get_client import get_client

async def infer_response_type(prompt: str) -> str:
    response = get_client().responses.create(
        model="gpt-5-nano",
        input=[
            {
                "role": "system",
                "content": (
                    "You are a formatting selector. Based on the user query, decide the most suitable output type.\n"
                    "Available types:\n"
                    "- paragraph → for descriptive or explanatory answers\n"
                    "- bullet-list → for items, steps, or enumerations\n"
                    "- table → for structured data like years, stats, or comparisons\n\n"
                    "Respond with exactly one word: 'paragraph', 'bullet-list', or 'table'."
                ),
            },
            {
                "role": "user",
                "content": prompt
            },
        ],
    )
    return response.output_text
