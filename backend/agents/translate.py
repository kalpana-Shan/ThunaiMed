import json
from typing import List
import ollama
from pydantic import BaseModel, Field


class MedicalTerm(BaseModel):
    term: str = Field(description="Original medical term or phrase.")
    preserved_as: str = Field(description="How the term should appear in the target language.")
    note: str = Field(default="", description="Short note if needed.")


class TranslateResponse(BaseModel):
    source_language: str
    target_language: str
    original_text: str
    translated_text: str
    medical_terms: List[MedicalTerm] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    summary: str = ""


def translate_text(text: str, source_language: str, target_language: str):
    system_prompt = """
You are a medical translation assistant for ThunaiMed.
Translate accurately and preserve clinical meaning.
Do not lose symptoms, dosages, negations, allergies, duration, severity, body parts, pregnancy status, or urgency.
Return ONLY valid JSON matching the schema.
"""

    user_prompt = f"""
Translate from {source_language} to {target_language}.
Preserve medical meaning carefully.

Text:
{text}
"""

    response = ollama.chat(
        model="gemma4:e2b",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        format=TranslateResponse.model_json_schema(),
    )

    content = response["message"]["content"]

    try:
        data = json.loads(content)
        return TranslateResponse(**data).model_dump()
    except Exception:
        return {
            "source_language": source_language,
            "target_language": target_language,
            "original_text": text,
            "translated_text": content,
            "medical_terms": [],
            "warnings": ["Model output could not be validated as JSON."],
            "summary": ""
        }