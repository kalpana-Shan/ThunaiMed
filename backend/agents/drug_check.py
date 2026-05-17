# =============================================================
# DRUG CHECK — WHO Essential Medicines dosing + contraindications
# Source: WHO Essential Medicines List, 23rd edition (2023)
#
# SCOPE: Weight-based dosing + contraindications ONLY.
# This is NOT a full drug interaction checker.
# Pure dictionary lookup — NO AI involved.
# =============================================================

WHO_DRUGS = {
    "paracetamol": {
        "also_known_as": ["acetaminophen", "calpol", "crocin", "dolo", "tylenol"],
        "dose_mg_per_kg": 15,
        "max_dose_mg": 1000,
        "frequency": "every 6 hours (maximum 4 doses per day)",
        "route": "oral",
        "form": "tablet or syrup",
        "contraindications": [
            "Severe liver disease",
            "Known allergy to paracetamol"
        ],
        "pregnancy_safe": True,
        "min_age_months": 0,
        "notes": "Most common first-line fever medicine. Safe for all ages including newborns with correct dose."
    },
    "amoxicillin": {
        "also_known_as": ["amoxil", "trimox", "moxatag"],
        "dose_mg_per_kg": 25,
        "max_dose_mg": 500,
        "frequency": "every 8 hours for 5 days",
        "route": "oral",
        "form": "capsule, tablet, or syrup",
        "contraindications": [
            "Penicillin allergy",
            "Mononucleosis (glandular fever) — causes rash",
            "Severe renal impairment"
        ],
        "pregnancy_safe": True,
        "min_age_months": 1,
        "notes": "First-line antibiotic for pneumonia, ear infections, and throat infections in children."
    },
    "oral rehydration salts": {
        "also_known_as": ["ors", "electral", "pedialyte", "orsol"],
        "dose_mg_per_kg": None,
        "dose_note": (
            "Plan A (mild diarrhoea, no dehydration): "
            "Give 50-100ml ORS after each loose stool at home. "
            "Continue breastfeeding. "
            "Plan B (moderate dehydration): "
            "Give 75ml per kg over 4 hours at clinic. Reassess after. "
            "Plan C (severe dehydration): "
            "IV fluids required — REFER IMMEDIATELY."
        ),
        "frequency": "After each loose stool as needed",
        "route": "oral",
        "form": "powder dissolved in 1 litre of clean water",
        "contraindications": [
            "Severe vomiting — cannot retain fluids (use IV instead)",
            "Unconscious child — NEVER give orally"
        ],
        "pregnancy_safe": True,
        "min_age_months": 0,
        "notes": "First-line treatment for diarrhoea dehydration. Always combine with Zinc for children under 5."
    },
    "zinc": {
        "also_known_as": ["zinc sulphate", "zincovit", "zinc acetate"],
        "dose_mg_per_kg": None,
        "fixed_dose_under_6mo": "10mg dispersible tablet once daily for 10-14 days",
        "fixed_dose_over_6mo": "20mg dispersible tablet once daily for 10-14 days",
        "frequency": "Once daily for 10-14 days",
        "route": "oral",
        "form": "dispersible tablet (dissolve in small amount of breast milk or water)",
        "contraindications": [],
        "pregnancy_safe": True,
        "min_age_months": 0,
        "notes": "Give with every episode of diarrhoea. Reduces duration and prevents recurrence for 2-3 months."
    },
    "cotrimoxazole": {
        "also_known_as": ["trimethoprim-sulfamethoxazole", "septran", "bactrim", "co-trimoxazole"],
        "dose_mg_per_kg": 4,
        "max_dose_mg": 160,
        "frequency": "Twice daily for 5 days",
        "route": "oral",
        "form": "tablet or syrup",
        "contraindications": [
            "Sulfa drug allergy",
            "G6PD deficiency — risk of haemolysis",
            "Severe renal or hepatic impairment",
            "Newborns under 1 month — risk of kernicterus"
        ],
        "pregnancy_safe": False,
        "min_age_months": 1,
        "notes": "Used for pneumonia, UTI, and ear infections. Always check allergy history before prescribing."
    },
    "vitamin a": {
        "also_known_as": ["retinol", "vitamin a supplement", "vit a"],
        "dose_mg_per_kg": None,
        "fixed_dose_under_6mo": "50,000 IU — single dose only",
        "fixed_dose_6_to_12mo": "100,000 IU — single dose only",
        "fixed_dose_over_12mo": "200,000 IU — single dose only",
        "frequency": "Single dose (do NOT repeat within 1 month)",
        "route": "oral",
        "form": "capsule or oil drops",
        "contraindications": [
            "Hypervitaminosis A (toxicity from excess)",
            "Pregnancy — high doses may cause birth defects (use only if directed by doctor)"
        ],
        "pregnancy_safe": False,
        "min_age_months": 0,
        "notes": "Give with measles, severe malnutrition, and night blindness. Never repeat within 1 month — risk of toxicity."
    },
    "metformin": {
        "also_known_as": ["glucophage", "glycomet", "obimet"],
        "dose_mg_per_kg": None,
        "fixed_dose": "500mg twice daily with meals (adult starting dose)",
        "frequency": "Twice daily with meals",
        "route": "oral",
        "form": "tablet",
        "contraindications": [
            "Renal impairment — eGFR below 30 ml/min",
            "Liver disease or jaundice",
            "Heart failure or shock",
            "Children under 10 years of age",
            "Before iodine contrast procedures — hold 48 hours before and after"
        ],
        "pregnancy_safe": False,
        "min_age_months": 120,
        "notes": "First-line diabetes medicine. Monitor kidney function every 6 months. Take with food to reduce stomach upset."
    },
    "iron": {
        "also_known_as": ["ferrous sulphate", "haemifer", "autrin", "ferrous gluconate"],
        "dose_mg_per_kg": 3,
        "max_dose_mg": 60,
        "frequency": "Once daily on empty stomach (or with food if nauseated)",
        "route": "oral",
        "form": "tablet or syrup",
        "contraindications": [
            "Haemochromatosis (iron overload disorder)",
            "Haemolytic anaemia",
            "Repeated blood transfusions"
        ],
        "pregnancy_safe": True,
        "min_age_months": 0,
        "notes": "Give for iron-deficiency anaemia. Take with vitamin C (lemon juice) to improve absorption. Stools will turn dark — this is normal."
    },
    "albendazole": {
        "also_known_as": ["zentel", "bendex", "wormicide"],
        "dose_mg_per_kg": None,
        "fixed_dose_1_2yr": "200mg — single dose (chewable)",
        "fixed_dose_over_2yr": "400mg — single dose (chewable)",
        "frequency": "Single dose (repeat every 6 months for prevention)",
        "route": "oral",
        "form": "chewable tablet",
        "contraindications": [
            "Pregnancy — especially first trimester",
            "Children under 1 year of age"
        ],
        "pregnancy_safe": False,
        "min_age_months": 12,
        "notes": "Deworming medicine. Crush tablet for young children. Safe to give even without confirmed worm infection in endemic areas."
    },
    "amoxicillin clavulanate": {
        "also_known_as": ["augmentin", "co-amoxiclav", "clavamox"],
        "dose_mg_per_kg": 25,
        "max_dose_mg": 500,
        "frequency": "Every 8 hours for 5-7 days",
        "route": "oral",
        "form": "tablet or syrup",
        "contraindications": [
            "Penicillin allergy",
            "Previous liver problems with amoxicillin-clavulanate",
            "Severe renal impairment"
        ],
        "pregnancy_safe": True,
        "min_age_months": 1,
        "notes": "Stronger antibiotic for resistant infections. Use only when amoxicillin alone has failed."
    },
}


def _normalize(name: str) -> str:
    return name.lower().strip()


def _find_drug(drug_name: str):
    """Finds drug by name or also_known_as alias."""
    key = _normalize(drug_name)

    # Direct match first
    if key in WHO_DRUGS:
        return key, WHO_DRUGS[key]

    # Search aliases
    for drug_key, drug_data in WHO_DRUGS.items():
        aliases = [_normalize(a) for a in drug_data.get("also_known_as", [])]
        if key in aliases:
            return drug_key, drug_data

    # Partial match (e.g. "amox" finds "amoxicillin")
    for drug_key, drug_data in WHO_DRUGS.items():
        if key in drug_key:
            return drug_key, drug_data

    return None, None


def check_drug(drug_name: str, weight_kg: float = None,
               age_months: int = None, is_pregnant: bool = False) -> dict:

    drug_key, drug = _find_drug(drug_name)

    if not drug:
        return {
            "drug": drug_name,
            "also_known_as": [],
            "dose": None,
            "notes": "",
            "contraindications": [],
            "warning": (
                f"'{drug_name}' was not found in the WHO Essential Medicines list. "
                "Consult a pharmacist or doctor for this medicine."
            ),
            "source": "WHO Essential Medicines List 2023"
        }

    # ── Calculate dose ────────────────────────────────────────────────
    dose_str = None

    if drug.get("dose_mg_per_kg") and weight_kg:
        raw = drug["dose_mg_per_kg"] * weight_kg
        capped = min(raw, drug.get("max_dose_mg", raw))
        dose_str = (
            f"{round(capped)}mg {drug['route']} ({drug['form']}) — "
            f"{drug['frequency']}"
        )
    elif drug.get("fixed_dose"):
        dose_str = f"{drug['fixed_dose']} {drug['route']} ({drug['form']})"
    elif drug.get("dose_note"):
        dose_str = drug["dose_note"]
    elif age_months is not None:
        # Age-based fixed doses
        if age_months < 6 and drug.get("fixed_dose_under_6mo"):
            dose_str = drug["fixed_dose_under_6mo"]
        elif 6 <= age_months < 12 and drug.get("fixed_dose_6_to_12mo"):
            dose_str = drug["fixed_dose_6_to_12mo"]
        elif age_months >= 12 and drug.get("fixed_dose_over_12mo"):
            dose_str = drug["fixed_dose_over_12mo"]
        elif 12 <= age_months < 24 and drug.get("fixed_dose_1_2yr"):
            dose_str = drug["fixed_dose_1_2yr"]
        elif age_months >= 24 and drug.get("fixed_dose_over_2yr"):
            dose_str = drug["fixed_dose_over_2yr"]

    # ── Build contraindications ───────────────────────────────────────
    contras = list(drug["contraindications"])

    if is_pregnant and not drug.get("pregnancy_safe"):
        contras.append(
            "⚠️ NOT recommended in pregnancy — consult a doctor before giving"
        )

    if age_months is not None and age_months < drug.get("min_age_months", 0):
        min_age = drug["min_age_months"]
        contras.append(
            f"⚠️ Not recommended under {min_age} months of age "
            f"(this patient is {age_months} months old)"
        )

    return {
        "drug": drug_key.title(),
        "also_known_as": drug.get("also_known_as", []),
        "dose": dose_str or "Provide weight or age to calculate dose",
        "notes": drug.get("notes", ""),
        "contraindications": (
            contras if contras else ["None listed for this medicine"]
        ),
        "warning": (
            "⚠️ ThunaiMed covers WHO Essential Medicines dosing and "
            "contraindications only. This is NOT a complete drug interaction "
            "checker. For patients on multiple medicines, always consult a "
            "pharmacist or doctor."
        ),
        "source": "WHO Essential Medicines List, 23rd edition (2023)"
    }