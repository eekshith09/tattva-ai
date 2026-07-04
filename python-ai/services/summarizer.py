import os
import sys
import time
import json
import logging
from typing import Optional, Tuple

from transformers import AutoTokenizer, AutoModelForSeq2SeqLM


logger = logging.getLogger("tattva_summarizer")
logger.setLevel(logging.INFO)


def _log_json(payload: dict) -> None:
    # Structured JSON logging to stdout
    sys.stdout.write(json.dumps(payload, ensure_ascii=False) + "\n")
    sys.stdout.flush()


# Model cache (loaded once)
_tokenizer = None
_model = None
_model_name_loaded: Optional[str] = None


def init_model() -> Tuple[str, str]:
    """Load the tokenizer/model once. Returns (model_name, status)."""
    global _tokenizer, _model, _model_name_loaded

    if _model is not None and _tokenizer is not None and _model_name_loaded:
        return _model_name_loaded, "already_loaded"

    model_name = os.environ.get("SUMMARIZER_MODEL", "sshleifer/distilbart-cnn-12-6")

    started_at = time.time()
    try:
        _log_json({
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "level": "INFO",
            "endpoint": "/summarize/text:startup",
            "model": model_name,
            "processingTimeMs": 0,
            "status": "loading_started",
        })

        _tokenizer = AutoTokenizer.from_pretrained(model_name)
        _model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
        _model.eval()

        _model_name_loaded = model_name
        elapsed_ms = int((time.time() - started_at) * 1000)

        _log_json({
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "level": "INFO",
            "endpoint": "/summarize/text:startup",
            "model": model_name,
            "processingTimeMs": elapsed_ms,
            "status": "loading_success",
        })

        return model_name, "loaded"
    except Exception as e:
        elapsed_ms = int((time.time() - started_at) * 1000)
        _log_json({
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "level": "ERROR",
            "endpoint": "/summarize/text:startup",
            "model": model_name,
            "processingTimeMs": elapsed_ms,
            "status": "loading_failed",
            "error": {
                "error_type": type(e).__name__,
                "error_message": str(e),
            },
        })
        raise


def _summarize_impl(text: str) -> str:
    global _tokenizer, _model

    if _model is None or _tokenizer is None:
        init_model()

    # Generation parameters (explicit; no max_length)
    generation_kwargs = {
        "max_new_tokens": 150,
        "min_new_tokens": 30,
        "num_beams": 4,
        "length_penalty": 2.0,
        "early_stopping": True,
        "do_sample": False,
    }

    # Tokenize / generate
    inputs = _tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
    )

    outputs = _model.generate(**inputs, **generation_kwargs)
    decoded = _tokenizer.decode(outputs[0], skip_special_tokens=True)
    return decoded.strip()


def summarize_text(text: str) -> Tuple[str, str, int]:
    """Return (success_model_name, summary, processing_time_ms)."""
    model_name, _ = init_model()

    started_at = time.time()
    try:
        summary = _summarize_impl(text)
        elapsed_ms = int((time.time() - started_at) * 1000)
        _log_json({
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "level": "INFO",
            "endpoint": "/summarize/text",
            "model": model_name,
            "processingTimeMs": elapsed_ms,
            "status": "success",
        })
        return model_name, summary, elapsed_ms
    except Exception as e:
        elapsed_ms = int((time.time() - started_at) * 1000)
        _log_json({
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "level": "ERROR",
            "endpoint": "/summarize/text",
            "model": model_name,
            "processingTimeMs": elapsed_ms,
            "status": "error",
            "error": {
                "error_type": type(e).__name__,
                "error_message": str(e),
            },
        })
        raise


# Backwards-compatible placeholder (kept for any legacy callers)
# NOTE: The /summarize/text route will no longer call this.

def summarize_text_placeholder(text: str) -> str:
    short = (text or "").strip()
    if not short:
        return "This is a placeholder summary from the Python AI service."
    return f"This is a placeholder summary from the Python AI service. (Input length: {len(short)})"


