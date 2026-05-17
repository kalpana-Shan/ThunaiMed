export function createCaseRecord({
  zone = 'UNKNOWN',
  summary = '',
  symptoms = '',
  immediate_action = '',
  follow_up = '',
  warning_signs = '',
  first_aid = '',
  language = 'English',
  notes = '',
  reasoning_steps = []
} = {}) {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toLocaleString(),
    zone,
    summary,
    symptoms,
    immediate_action,
    follow_up,
    warning_signs,
    first_aid,
    language,
    notes,
    reasoning_steps
  }
}

export function formatCaseForHistory(result = {}, input = {}) {
  return createCaseRecord({
    zone: result.zone,
    summary: result.summary,
    symptoms: input.symptoms || '',
    immediate_action: result.immediate_action,
    follow_up: result.follow_up,
    warning_signs: result.warning_signs,
    first_aid: result.first_aid,
    language: input.language || 'English',
    notes: input.notes || '',
    reasoning_steps: result.reasoning_steps || []
  })
}

export function buildExportSummary(caseRecord = {}) {
  return {
    date: caseRecord.timestamp || new Date().toLocaleString(),
    zone: caseRecord.zone || 'UNKNOWN',
    summary: caseRecord.summary || 'No summary available',
    symptoms: caseRecord.symptoms || 'No symptoms recorded',
    immediate_action: caseRecord.immediate_action || 'No immediate action recorded',
    follow_up: caseRecord.follow_up || 'No follow-up recorded',
    warning_signs: caseRecord.warning_signs || 'No warning signs recorded',
    first_aid: caseRecord.first_aid || 'No first aid recorded',
    language: caseRecord.language || 'English'
  }
}

export function normalizeZone(zone) {
  return String(zone || 'UNKNOWN').trim().toUpperCase()
}

export function toLowerZone(zone) {
  return String(zone || 'UNKNOWN').trim().toLowerCase()
}