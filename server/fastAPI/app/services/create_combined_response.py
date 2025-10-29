import asyncio
from .. import responses

async def create_combined_response(agentModel: str, agentSystemInstructions: str, prompt: str) -> dict:
    agent_type, response_type, response_text = await asyncio.gather(
        responses.infer_agent_type(prompt),
        responses.infer_response_type(prompt),
        responses.create_response(agentModel, agentSystemInstructions, prompt),
    )

    return {
        "inferredAgentType": agent_type.strip(),
        "inferredResponseType": response_type.strip(),
        "response": response_text.strip(),
    }
