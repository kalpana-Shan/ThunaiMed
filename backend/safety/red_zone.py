# =============================================================
# RED ZONE — HARDCODED WHO IMCI GENERAL DANGER SIGNS
# NO AI INVOLVED. Pure if-else keyword logic.
# Source: WHO IMCI Handbook 2020, Section 2, pg 12-14
#
# These checks run BEFORE every Gemma 4 call.
# If triggered, Gemma 4 is BYPASSED entirely.
# This cannot be overridden by the AI.
# =============================================================

DANGER_SIGNS = {
    # Cannot drink / breastfeed
    "cannot drink":               "Child cannot drink or breastfeed",
    "not drinking":               "Child cannot drink or breastfeed",
    "wont drink":                 "Child cannot drink or breastfeed",
    "won't drink":                "Child cannot drink or breastfeed",
    "refuses to drink":           "Child cannot drink or breastfeed",
    "not breastfeeding":          "Child cannot drink or breastfeed",
    "unable to drink":            "Child cannot drink or breastfeed",
    # Vomiting
    "vomiting everything":        "Vomits everything",
    "vomits everything":          "Vomits everything",
    "cannot keep anything down":  "Vomits everything",
    "throwing up everything":     "Vomits everything",
    # Convulsions / seizures
    "convulsion":                 "Has had convulsions",
    "convulsions":                "Has had convulsions",
    "seizure":                    "Has had convulsions",
    "seizures":                   "Has had convulsions",
    "fits":                       "Has had convulsions",
    "shaking uncontrollably":     "Has had convulsions",
    "epileptic":                  "Has had convulsions",
    # Consciousness
    "unconscious":                "Unconscious or lethargic",
    "not waking":                 "Unconscious or lethargic",
    "wont wake":                  "Unconscious or lethargic",
    "won't wake":                 "Unconscious or lethargic",
    "cannot wake":                "Unconscious or lethargic",
    "unresponsive":               "Unconscious or lethargic",
    "lethargic":                  "Lethargic — cannot be fully woken",
    "not responding":             "Unconscious or lethargic",
    "drowsy":                     "Abnormal drowsiness — possible lethargy",
    # Breathing
    "not breathing":              "Severe breathing difficulty",
    "stopped breathing":          "Severe breathing difficulty",
    "gasping":                    "Severe breathing difficulty",
    "blue lips":                  "Cyanosis — respiratory emergency",
    "blue fingernails":           "Cyanosis — respiratory emergency",
    "bluish lips":                "Cyanosis — respiratory emergency",
    "severe chest indrawing":     "Severe chest in-drawing (IMCI Red)",
    "chest indrawing":            "Chest in-drawing — urgent assessment needed",
    "grunting":                   "Respiratory distress — urgent assessment",
    # Neck stiffness (meningitis sign)
    "stiff neck":                 "Stiff neck (possible meningitis)",
    "neck stiff":                 "Stiff neck (possible meningitis)",
    "cannot bend neck":           "Stiff neck (possible meningitis)",
    # Fontanelle (in infants)
    "bulging fontanelle":         "Bulging fontanelle (possible meningitis/raised ICP)",
    "fontanelle bulging":         "Bulging fontanelle (possible meningitis/raised ICP)",
    # Severe dehydration
    "severe dehydration":         "Severe dehydration",
    "sunken eyes":                "Signs of severe dehydration",
    "very sunken eyes":           "Signs of severe dehydration",
    "skin pinch slow":            "Signs of severe dehydration (poor skin turgor)",
    "skin turgor":                "Signs of severe dehydration",
    "no tears":                   "Signs of dehydration",
    # Pallor (anaemia)
    "severe pallor":              "Severe palmar pallor (possible severe anaemia)",
    "very pale":                  "Possible severe anaemia — check palmar pallor",
    "pale palms":                 "Palmar pallor — possible anaemia",
    # Malnutrition signs
    "severe wasting":             "Severe acute malnutrition",
    "visible ribs":               "Severe wasting — possible SAM",
    "kwashiorkor":                "Severe acute malnutrition",
    "marasmus":                   "Severe acute malnutrition",
}


def check_red_zone(symptoms_text: str) -> dict:
    """
    Checks user-entered symptoms for WHO IMCI General Danger Signs.
    Returns REFER instruction immediately if ANY danger sign found.
    Gemma 4 is BYPASSED when this returns is_red_zone=True.
    """
    text = symptoms_text.lower()
    triggered = []

    for keyword, description in DANGER_SIGNS.items():
        if keyword in text and description not in triggered:
            triggered.append(description)

    if triggered:
        return {
            "is_red_zone": True,
            "danger_signs": triggered,
            "action": "REFER IMMEDIATELY TO NEAREST HEALTH FACILITY",
            "first_aid": [
                "Keep the child calm and as comfortable as possible",
                "Do NOT give food or water if child is unconscious or cannot swallow",
                "Keep airway clear — place child on side if unconscious",
                "Do NOT give any medicines unless already prescribed by a doctor",
                "Write down the time symptoms started",
                "Call ambulance or arrange emergency transport immediately",
                "Accompany the patient to the facility — do not send alone"
            ],
            "source": "WHO IMCI General Danger Signs, 2020 Edition, pg 12-14",
            "ai_bypassed": True,
            "disclaimer": (
                "⚠️ This response is HARDCODED — NOT generated by AI. "
                "These are WHO IMCI General Danger Signs that require immediate referral."
            )
        }

    return {"is_red_zone": False}