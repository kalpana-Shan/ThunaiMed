from pydantic import BaseModel
from typing import Optional, List
from enum import Enum


class TriageZone(str, Enum):
    GREEN = "GREEN"
    YELLOW = "YELLOW"
    RED = "RED"
    REFER = "REFER_IMMEDIATELY"


class ReasoningStep(BaseModel):
    step: int
    observation: str
    source: Optional[str] = None


class TriageRequest(BaseModel):
    symptoms: str
    age_months: Optional[int] = None
    weight_kg: Optional[float] = None
    language: Optional[str] = "auto"
    image_base64: Optional[str] = None


class TriageResponse(BaseModel):
    zone: str
    summary: str
    reasoning_steps: List[ReasoningStep]
    immediate_action: str
    first_aid: List[str]
    refer_within: Optional[str] = None
    source: str
    disclaimer: str
    ai_bypassed: bool = False


class DrugRequest(BaseModel):
    drug_name: str
    weight_kg: Optional[float] = None
    age_months: Optional[int] = None
    is_pregnant: Optional[bool] = False


class DrugResponse(BaseModel):
    drug: str
    dose: Optional[str]
    contraindications: List[str]
    warning: str
    source: str


class FacilityRequest(BaseModel):
    latitude: float
    longitude: float
    facility_type: Optional[str] = "any"


class FacilityResponse(BaseModel):
    name: str
    type: str
    distance_km: float
    phone: Optional[str]
    district: Optional[str]
    note: str


class CaseLogRequest(BaseModel):
    symptoms: str
    zone: str
    action_taken: str
    language: Optional[str] = "unknown"


class ImageAnalysisRequest(BaseModel):
    image_base64: str
    context: Optional[str] = "skin condition"


class ImageAnalysisResponse(BaseModel):
    description: str
    clinical_observations: List[str]
    suggested_follow_up: str
    disclaimer: str


class TranslateRequest(BaseModel):
    text: str
    source_language: str
    target_language: str