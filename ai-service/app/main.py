from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="SkinCare AI Service")

class HealthResponse(BaseModel):
    status: str
    service: str

@app.get("/api/v1/health", response_model=HealthResponse)
def health_check():
    return {"status": "ok", "service": "ai-service"}
