from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.summarizer import summarize_text

router = APIRouter(prefix="/summarize", tags=["summarize"])


class TextIn(BaseModel):
    text: str


@router.post("/text")
def summarize_text_route(payload: TextIn):
    trimmed = (payload.text or "").strip()

    if len(trimmed) < 100:
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "error": "Input text must contain at least 100 characters after trimming whitespace.",
            },
        )

    model_name, summary, processing_time_ms = summarize_text(trimmed)

    return {
        "success": True,
        "model": model_name,
        "summary": summary,
        "processingTimeMs": processing_time_ms,
    }


