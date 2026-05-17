import ollama


SYSTEM_PROMPT = """You are assisting a community health worker in a rural clinic.
Analyze the photo and describe ONLY what you visually observe:
1. Visible skin changes, rash, wound, swelling, or abnormality
2. Color, distribution, and pattern
3. Apparent severity: mild / moderate / severe
4. Whether it appears infected (pus, redness, warmth signs)

Rules:
- Do NOT diagnose
- Do NOT name specific diseases
- Use simple language the health worker can understand
- Be brief — 3 to 5 sentences maximum
- If image is unclear, say so honestly"""


def analyze_image(image_base64: str, context: str = "skin condition") -> dict:
    try:
        response = ollama.chat(
            model="gemma4:e4b",
            messages=[{
                "role": "user",
                "content": (
                    f"Please analyze this photo of a {context} "
                    "for a community health worker in a rural clinic."
                ),
                "images": [image_base64]
            }],
            system=SYSTEM_PROMPT
        )
        description = response["message"]["content"]
        lines = [l.strip() for l in description.split(".") if l.strip()]

        return {
            "description": description,
            "clinical_observations": lines[:4],
            "suggested_follow_up": (
                "Combine this visual observation with symptom triage "
                "for a complete assessment."
            ),
            "disclaimer": (
                "⚠️ This is visual pattern observation only — NOT a diagnosis. "
                "Always combine with full clinical assessment by a trained worker."
            )
        }

    except Exception as e:
        return {
            "description": "Image analysis is not available on this device.",
            "clinical_observations": [
                "Please describe the condition using text symptoms instead."
            ],
            "suggested_follow_up": "Use text symptom entry for triage.",
            "disclaimer": (
                f"Image analysis requires sufficient device RAM (6GB+). "
                f"All other ThunaiMed features work normally. Error: {str(e)}"
            )
        }