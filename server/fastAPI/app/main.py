from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.api_routes import router as api_router

app = FastAPI(title="FastAPI AI Service")

# CORS for local dev (Express -> FastAPI)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in prod
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/")
def root():
    return {"message": "Server is running"}