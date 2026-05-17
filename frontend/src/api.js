const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export async function triageRequest(symptoms, ageMonths, weightKg, language = 'auto') {
  const res = await fetch(`${BASE_URL}/triage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      symptoms,
      age_months: ageMonths ? parseInt(ageMonths) : null,
      weight_kg: weightKg ? parseFloat(weightKg) : null,
      language
    })
  })
  if (!res.ok) throw new Error('Triage request failed')
  return res.json()
}

export async function drugRequest(drugName, weightKg, ageMonths, isPregnant = false) {
  const res = await fetch(`${BASE_URL}/drug`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      drug_name: drugName,
      weight_kg: weightKg ? parseFloat(weightKg) : null,
      age_months: ageMonths ? parseInt(ageMonths) : null,
      is_pregnant: isPregnant
    })
  })
  if (!res.ok) throw new Error('Drug request failed')
  return res.json()
}

export async function facilityRequest(latitude, longitude) {
  const res = await fetch(`${BASE_URL}/facility`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ latitude, longitude })
  })
  if (!res.ok) throw new Error('Facility request failed')
  return res.json()
}

export async function logCase(symptoms, zone, actionTaken, language = 'auto') {
  const res = await fetch(`${BASE_URL}/log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      symptoms,
      zone,
      action_taken: actionTaken,
      language
    })
  })
  if (!res.ok) throw new Error('Log request failed')
  return res.json()
}