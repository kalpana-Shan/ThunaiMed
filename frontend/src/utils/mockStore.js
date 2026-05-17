import { createCaseRecord, formatCaseForHistory, buildExportSummary } from './caseHelpers'

const listeners = new Set()

const state = {
  history: [],
  latestCase: null,
  translatorLog: [],
  visionLog: []
}

function emit() {
  listeners.forEach((listener) => listener(state))
}

export function getMockState() {
  return state
}

export function subscribeMockState(listener) {
  listeners.add(listener)
  listener(state)
  return () => listeners.delete(listener)
}

export function addCaseToHistory(result = {}, input = {}) {
  const record = formatCaseForHistory(result, input)
  state.latestCase = record
  state.history = [record, ...state.history].slice(0, 20)
  emit()
  return record
}

export function clearHistory() {
  state.history = []
  state.latestCase = null
  emit()
}

export function reopenCase(caseRecord) {
  state.latestCase = caseRecord || null
  emit()
  return state.latestCase
}

export function logTranslation(entry = {}) {
  const record = {
    id: crypto.randomUUID(),
    timestamp: new Date().toLocaleString(),
    ...entry
  }
  state.translatorLog = [record, ...state.translatorLog].slice(0, 20)
  emit()
  return record
}

export function logVisionEntry(entry = {}) {
  const record = {
    id: crypto.randomUUID(),
    timestamp: new Date().toLocaleString(),
    ...entry
  }
  state.visionLog = [record, ...state.visionLog].slice(0, 20)
  emit()
  return record
}

export function getLatestExportData() {
  return state.latestCase ? buildExportSummary(state.latestCase) : null
}