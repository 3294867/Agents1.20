import asyncio
from app.services.infer_agent_type import infer_agent_type
from app.services.infer_response_type import infer_response_type
from app.services.create_response import create_response

async def create_combined_response(agentModel: str, agentSystemInstructions: str, prompt: str) -> dict:
    agent_type, response_type, response_text = await asyncio.gather(
        infer_agent_type(prompt),
        infer_response_type(prompt),
        create_response(agentModel, agentSystemInstructions, prompt),
    )

    return {
        "inferredAgentType": agent_type.strip(),
        "inferredResponseType": response_type.strip(),
        "response": response_text.strip(),
    }
