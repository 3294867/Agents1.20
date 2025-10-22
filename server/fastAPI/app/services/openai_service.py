import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

async def generate_response(prompt: str) -> str:
    print('prompt: ', prompt, 'key: ', api_key)
    client = OpenAI(api_key=api_key)
    response = client.responses.create(
        model="gpt-5-nano",
        input=[
            {"role": "user", "content": prompt},
        ],
    )
    print('response: ', response.output_text)
    return response.output_text
