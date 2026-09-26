import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import analysis

app = FastAPI(title="SkinCare AI Photo Analysis MVP")

# Allow CORS origins based on environment variable, fallback to localhost for development
allowed_origins_str = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5000,http://127.0.0.1:5000")
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis.router)

@app.get("/health")
def health_check():
    return {"status": "healthy"}
