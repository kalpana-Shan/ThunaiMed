import json
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from safety.red_zone import check_red_zone
from rag.retriever import retrieve_context

# ── MOCK MODE ─────────────────────────────────────────────────────────
# Ollama is temporarily disabled.
# Returns realistic mock responses so frontend/UI can be built fully.
# To enable Gemma 4: set MOCK_MODE = False
MOCK_MODE = True
# ──────────────────────────────────────────────────────────────────────


SYSTEM_PROMPT = """You are ThunaiMed, an offline clinical triage assistant for
community health workers. You follow WHO IMCI protocols strictly.

RULES:
- You are NOT a doctor. Never claim to diagnose.
- Always show step-by-step reasoning.
- Always cite which WHO guideline your answer is based on.
- Respond in the SAME language the user writes in.
- If unsure, always default to YELLOW zone and advise referral.

OUTPUT FORMAT — always return valid JSON exactly like this:
{
  "zone": "GREEN" or "YELLOW" or "RED",
  "summary": "one sentence in user language",
  "reasoning_steps": [
    {"step": 1, "observation": "...", "source": "WHO IMCI 2020, pg X"},
    {"step": 2, "observation": "...", "source": "..."},
    {"step": 3, "observation": "...", "source": "..."}
  ],
  "immediate_action": "what the health worker should do right now",
  "first_aid": ["step 1", "step 2", "step 3"],
  "refer_within": "time frame e.g. within 24 hours / not needed / immediately"
}

Zone definitions (WHO IMCI):
- GREEN: Mild illness, home treatment, follow up in 5 days
- YELLOW: Moderate illness, specific treatment, refer if no improvement
- RED: Severe illness, refer urgently (but ONLY if not caught by hardcoded rules)
"""


def _format_rag_context(rag_context: list) -> str:
    if not rag_context:
        return "No additional WHO IMCI context retrieved."

    parts = []
    for i, item in enumerate(rag_context, start=1):
        parts.append(f"[WHO Context {i}] {item['content']}")
    return "\n".join(parts)


def _mock_response(symptoms: str, age_months: int, weight_kg: float, rag_context: list = None) -> dict:
    """
    Realistic mock triage response.
    Simulates what Gemma 4 would return.
    Used while Ollama is being set up.
    """
    symptoms_lower = symptoms.lower()

    # Determine zone from keywords
    if any(w in symptoms_lower for w in ["fever", "rash", "cough", "cold", "runny"]):
        zone = "YELLOW"
        summary = "Child shows signs of moderate febrile illness requiring monitoring."
        steps = [
            {
                "step": 1,
                "observation": f"Fever reported. In children aged {age_months} months, fever >38°C requires assessment for source of infection.",
                "source": "WHO IMCI 2020, Section 3 — Fever, pg 23"
            },
            {
                "step": 2,
                "observation": "Rash present alongside fever. Differential includes viral exanthem, measles, or allergic reaction. No danger signs detected.",
                "source": "WHO IMCI 2020, Section 5 — Fever with rash, pg 47"
            },
            {
                "step": 3,
                "observation": f"Weight {weight_kg}kg noted. Child is not severely malnourished. Assess for hydration status.",
                "source": "WHO IMCI 2020, Section 7 — Nutrition assessment, pg 61"
            },
            {
                "step": 4,
                "observation": "No general danger signs present. Classify as YELLOW — treat and monitor.",
                "source": "WHO IMCI 2020, General Danger Signs checklist, pg 12"
            }
        ]
        immediate_action = "Give paracetamol for fever. Keep child hydrated. Return immediately if condition worsens."
        first_aid = [
            f"Give paracetamol {round(15 * weight_kg)}mg orally every 6 hours for fever",
            "Ensure child drinks adequate fluids — ORS if diarrhoea present",
            "Dress child lightly — do not bundle in blankets during fever",
            "Monitor temperature every 4 hours",
            "Return to clinic if fever persists beyond 2 days or any danger sign appears"
        ]
        refer_within = "Within 24 hours if no improvement"

    elif any(w in symptoms_lower for w in ["diarrhoea", "diarrhea", "loose stool", "vomit"]):
        zone = "YELLOW"
        summary = "Child has diarrhoea with possible mild dehydration — needs ORS and zinc."
        steps = [
            {
                "step": 1,
                "observation": "Diarrhoea reported. Assess number of stools per day and presence of blood.",
                "source": "WHO IMCI 2020, Section 4 — Diarrhoea, pg 31"
            },
            {
                "step": 2,
                "observation": "Check for dehydration signs: sunken eyes, skin pinch, drinking status. If none present — Plan A treatment.",
                "source": "WHO IMCI 2020, Dehydration assessment, pg 33"
            },
            {
                "step": 3,
                "observation": "No severe dehydration signs detected. Classify as some or no dehydration — treat with ORS.",
                "source": "WHO IMCI 2020, Treatment Plan A, pg 35"
            }
        ]
        immediate_action = "Start ORS immediately. Give zinc for 10-14 days. Continue breastfeeding."
        first_aid = [
            "Give ORS 50-100ml after every loose stool",
            f"Give zinc {10 if age_months < 6 else 20}mg once daily for 10-14 days",
            "Continue breastfeeding throughout illness",
            "Do NOT give anti-diarrhoeal medicines",
            "Return immediately if child cannot drink or has sunken eyes"
        ]
        refer_within = "Return in 2 days for reassessment"

    else:
        zone = "GREEN"
        summary = "No serious illness signs detected. Home care with follow-up in 5 days."
        steps = [
            {
                "step": 1,
                "observation": "Symptoms reported are mild. No WHO IMCI danger signs identified.",
                "source": "WHO IMCI 2020, General Danger Signs, pg 12"
            },
            {
                "step": 2,
                "observation": "No fever, respiratory distress, or dehydration signs. Child is feeding normally.",
                "source": "WHO IMCI 2020, Assess and Classify, pg 15"
            },
            {
                "step": 3,
                "observation": "Classify as GREEN — no immediate treatment required. Supportive home care advised.",
                "source": "WHO IMCI 2020, Green classification, pg 18"
            }
        ]
        immediate_action = "Home care. Keep child well fed and hydrated. Follow up in 5 days."
        first_aid = [
            "Continue normal feeding and breastfeeding",
            "Ensure child drinks adequate clean water",
            "Keep child warm and comfortable",
            "Return immediately if any danger sign develops"
        ]
        refer_within = "Not needed unless condition worsens"

    if rag_context:
        for item in rag_context[:2]:
            steps.append({
                "step": len(steps) + 1,
                "observation": item["content"][:220],
                "source": item["source"]
            })

    return {
        "zone": zone,
        "summary": summary,
        "reasoning_steps": steps,
        "immediate_action": immediate_action,
        "first_aid": first_aid,
        "refer_within": refer_within,
        "source": "WHO IMCI 2020 [MOCK — Gemma 4 will replace this]",
        "disclaimer": (
            "ThunaiMed is a clinical support tool — NOT a diagnostic tool. "
            "Always apply your ASHA training and refer if you are unsure."
        ),
        "ai_bypassed": False
    }


def run_triage(symptoms: str, age_months: int = None,
               weight_kg: float = None, language: str = "auto",
               image_base64: str = None) -> dict:

    # LAYER 1: Hardcoded red zone — always runs, even in mock mode
    red = check_red_zone(symptoms)
    if red["is_red_zone"]:
        return {
            "zone": "RED",
            "summary": "DANGER SIGNS DETECTED - REFER IMMEDIATELY",
            "reasoning_steps": [
                {
                    "step": 1,
                    "observation": "Danger sign(s) detected: " + ", ".join(red["danger_signs"]),
                    "source": "WHO IMCI General Danger Signs 2020"
                }
            ],
            "immediate_action": red["action"],
            "first_aid": red["first_aid"],
            "refer_within": "IMMEDIATELY",
            "source": "WHO IMCI 2020",
            "disclaimer": red["disclaimer"],
            "ai_bypassed": True
        }

    # LAYER 2: Retrieve WHO IMCI context from local RAG
    rag_context = retrieve_context(symptoms, top_k=3)

    # LAYER 3: Mock or Ollama
    if MOCK_MODE:
        return _mock_response(
            symptoms=symptoms,
            age_months=age_months or 24,
            weight_kg=weight_kg or 12.0,
            rag_context=rag_context
        )

    # LAYER 4: Real Gemma 4 via Ollama
    try:
        import ollama

        context_parts = [f"Symptoms reported: {symptoms}"]
        if age_months is not None:
            years = age_months // 12
            months = age_months % 12
            age_str = f"{years} years {months} months" if years else f"{months} months"
            context_parts.append(f"Patient age: {age_str}")
        if weight_kg is not None:
            context_parts.append(f"Patient weight: {weight_kg} kg")
        if language and language != "auto":
            context_parts.append(f"Please respond in: {language}")

        patient_context = "\n".join(context_parts)
        rag_text = _format_rag_context(rag_context)
        patient_context = patient_context + "\n\nRetrieved WHO IMCI context:\n" + rag_text

        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": patient_context}
        ]

        if image_base64:
            messages[1]["images"] = [image_base64]

        response = ollama.chat(
            model="gemma4:e4b",
            messages=messages,
            format="json",
            options={"temperature": 0.1}
        )

        content = response["message"]["content"]
        result = json.loads(content)

        if result.get("zone") not in ["GREEN", "YELLOW", "RED"]:
            result["zone"] = "YELLOW"

        result["source"] = "WHO IMCI 2020 + Gemma 4 E4B (Ollama)"
        result["disclaimer"] = (
            "ThunaiMed is a clinical support tool — NOT a diagnostic tool. "
            "Always apply your ASHA training and refer if you are unsure."
        )
        result["ai_bypassed"] = False
        return result

    except json.JSONDecodeError:
        return _safe_fallback("Gemma 4 returned non-JSON response")
    except Exception as e:
        return _safe_fallback(str(e))


def _safe_fallback(reason: str) -> dict:
    return {
        "zone": "YELLOW",
        "summary": "AI analysis could not be completed. Use your ASHA training and refer if unsure.",
        "reasoning_steps": [
            {
                "step": 1,
                "observation": f"AI analysis unavailable: {reason}",
                "source": "System fallback"
            },
            {
                "step": 2,
                "observation": "Defaulting to YELLOW zone as a safety measure. Use the paper WHO IMCI checklist.",
                "source": "ThunaiMed safety fallback protocol"
            }
        ],
        "immediate_action": "Use the paper WHO IMCI checklist. Refer to nearest PHC if condition is unclear or worsening.",
        "first_aid": [
            "Monitor vital signs closely",
            "Keep patient comfortable",
            "Do not give medicines without clinical basis",
            "Refer if condition worsens at any point"
        ],
        "refer_within": "Within 24 hours if no improvement",
        "source": "Fallback - WHO IMCI 2020",
        "disclaimer": "AI analysis was unavailable. This is a conservative fallback response. Use your clinical training.",
        "ai_bypassed": False
    }