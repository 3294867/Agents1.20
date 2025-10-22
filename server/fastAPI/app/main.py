from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models.request_models import CreateResponseRequest
from app.services.openai_service import generate_response

app = FastAPI(title="FastAPI AI Service")

# CORS for local dev (Express frontend -> FastAPI backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in prod
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/create-response")
async def create_response_endpoint(request: CreateResponseRequest):
    try:
        result = await generate_response(request.input)
        return {"message": "Success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
