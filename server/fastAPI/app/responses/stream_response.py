import os
from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def stream_response(prompt: str):
    stream = await client.responses.stream(
        model="gpt-4o-mini",
        input=[{"role": "user", "content": prompt}],
    )

    async for event in stream:
        if event.type == "response.output_text.delta":
            print(event.delta)
            yield event.delta
        elif event.type == "response.completed":
            break
