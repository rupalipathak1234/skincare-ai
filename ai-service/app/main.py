from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import analysis

app = FastAPI(title="SkinCare AI Photo Analysis MVP")

# Only allow requests from backend, but for local dev we'll allow all for simplicity.
# The Node backend handles the frontend CORS.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis.router)

@app.get("/health")
def health_check():
    return {"status": "healthy"}
