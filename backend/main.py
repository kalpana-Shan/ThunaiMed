from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from models.schemas import (
    TriageRequest,
    DrugRequest,
    FacilityRequest,
    CaseLogRequest,
    ImageAnalysisRequest,
    TranslateRequest,
)
from agents.orchestrator import run_triage
from agents.drug_check import check_drug
from agents.facility import find_nearest_facility
from agents.outbreak import log_case
from agents.image_analyze import analyze_image
from agents.translate import translate_text
from db.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    print("✅ ThunaiMed API is running")
    print("📖 API docs: http://localhost:8000/docs")
    yield


app = FastAPI(
    title="ThunaiMed API",
    description=(
        "Offline clinical triage companion for community health workers. "
        "Powered by Gemma 4 E4B via Ollama."
    ),
    version="1.0.0",
    lifespan=lifespan
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "app": "ThunaiMed",
        "version": "1.0.0",
        "status": "running",
        "docs": "http://localhost:8000/docs"
    }


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/triage")
def triage(req: TriageRequest):
    """
    Main triage endpoint.
    Runs hardcoded red zone check first, then Gemma 4 reasoning.
    """
    try:
        return run_triage(
            symptoms=req.symptoms,
            age_months=req.age_months,
            weight_kg=req.weight_kg,
            language=req.language,
            image_base64=req.image_base64
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/translate")
def translate(req: TranslateRequest):
    """
    Medical translation endpoint.
    Uses Gemma 4 for multilingual translation with clinical term preservation.
    """
    try:
        return translate_text(
            text=req.text,
            source_language=req.source_language,
            target_language=req.target_language
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/drug")
def drug(req: DrugRequest):
    """
    Drug dosing + contraindications lookup.
    WHO Essential Medicines List only. No AI.
    """
    try:
        return check_drug(
            drug_name=req.drug_name,
            weight_kg=req.weight_kg,
            age_months=req.age_months,
            is_pregnant=req.is_pregnant
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/facility")
def facility(req: FacilityRequest):
    """
    Nearest health facility finder using Haversine formula.
    Static SQLite data — works fully offline.
    """
    try:
        return find_nearest_facility(
            latitude=req.latitude,
            longitude=req.longitude,
            facility_type=req.facility_type
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/log")
def log(req: CaseLogRequest):
    """
    Anonymized case logging. No PII stored.
    Triggers outbreak signal if 3+ RED cases today.
    """
    try:
        return log_case(
            symptoms=req.symptoms,
            zone=req.zone,
            action_taken=req.action_taken,
            language=req.language
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/image")
def image(req: ImageAnalysisRequest):
    """
    Photo analysis via Gemma 4 multimodal.
    Graceful fallback if device RAM insufficient.
    """
    try:
        return analyze_image(
            image_base64=req.image_base64,
            context=req.context
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))