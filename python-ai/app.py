from fastapi import FastAPI

from routes.health import router as health_router
from routes.summarize import router as summarize_router

from services.summarizer import init_model

app = FastAPI(title="Tattva AI Python AI Service")


@app.on_event("startup")
def _startup_load_model() -> None:
    # Fail-fast: if model cannot load, we want the service to error on startup.
    init_model()


app.include_router(health_router)
app.include_router(summarize_router)


