import { useState } from 'react'
import { triageRequest, logCase } from '../api'
import { addCaseToHistory } from '../utils/mockStore'

const SPEECH_LOCALES = {
  English: 'en-IN',
  Tamil: 'ta-IN',
  Hindi: 'hi-IN',
  Telugu: 'te-IN',
  Kannada: 'kn-IN',
  Malayalam: 'ml-IN',
  Bengali: 'bn-IN',
  Marathi: 'mr-IN',
  Gujarati: 'gu-IN',
  Punjabi: 'pa-IN',
  Urdu: 'ur-PK',
  Odia: 'or-IN',
  Assamese: 'as-IN',
  Spanish: 'es-ES',
  French: 'fr-FR',
  Portuguese: 'pt-BR',
  Arabic: 'ar-SA',
  Swahili: 'sw-KE',
  Indonesian: 'id-ID',
  Filipino: 'fil-PH',
  Turkish: 'tr-TR',
  German: 'de-DE',
  Japanese: 'ja-JP',
  Korean: 'ko-KR',
  Chinese: 'cmn-Hans-CN',
  Vietnamese: 'vi-VN'
}

export default function CaseInput({ onResult, loading, setLoading, language, copy }) {
  const [symptoms, setSymptoms] = useState('')
  const [ageYears, setAgeYears] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const [temperature, setTemperature] = useState('')
  const [pulse, setPulse] = useState('')
  const [spo2, setSpo2] = useState('')
  const [bp, setBp] = useState('')
  const [glucose, setGlucose] = useState('')
  const [notes, setNotes] = useState('')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [error, setError] = useState('')
  const [voiceStatus, setVoiceStatus] = useState('')
  const [isListening, setIsListening] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!symptoms.trim()) {
      setError('Please describe the symptoms before running assessment.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const composedSymptoms = [
        symptoms,
        ageYears ? `Age years: ${ageYears}` : '',
        weightKg ? `Weight: ${weightKg} kg` : '',
        temperature ? `Temperature: ${temperature} C` : '',
        pulse ? `Pulse: ${pulse} bpm` : '',
        spo2 ? `SpO2: ${spo2}%` : '',
        bp ? `Blood pressure: ${bp}` : '',
        glucose ? `Blood glucose: ${glucose}` : '',
        notes ? `Additional notes: ${notes}` : '',
        uploadedFile ? `Attached file: ${uploadedFile.name}` : ''
      ]
        .filter(Boolean)
        .join(' | ')

      const result = await triageRequest(
        composedSymptoms,
        ageYears ? parseInt(ageYears, 10) : null,
        weightKg,
        language
      )

      const caseRecord = addCaseToHistory(result, {
        symptoms: composedSymptoms,
        language,
        notes
      })

      onResult({
        ...result,
        uploaded_file: uploadedFile ? uploadedFile.name : null,
        collected_vitals: {
          ageYears,
          weightKg,
          temperature,
          pulse,
          spo2,
          bp,
          glucose
        },
        case_id: caseRecord.id,
        timestamp: caseRecord.timestamp
      })

      await logCase(composedSymptoms, result.zone, result.immediate_action, language)
    } catch {
      setError('Could not reach the backend. Make sure FastAPI is running on port 8000.')
    } finally {
      setLoading(false)
    }
  }

  const handleVoice = () => {
    setError('')
    setVoiceStatus('')

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setError('Voice input is not supported in this browser. Use Chrome or Edge.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = SPEECH_LOCALES[language] || 'en-IN'
    recognition.interimResults = false
    recognition.continuous = false
    recognition.maxAlternatives = 1

    setIsListening(true)
    setVoiceStatus(`Listening in ${language}... Speak clearly, one person at a time.`)

    recognition.start()

    recognition.onresult = (e) => {
      const transcript = e.results?.[0]?.[0]?.transcript?.trim() || ''
      if (!transcript) {
        setVoiceStatus('No clear speech detected. Please try again slowly.')
        return
      }

      setSymptoms((prev) => (prev ? `${prev} ${transcript}` : transcript))
      setVoiceStatus('Voice captured. Please verify the text before running triage.')
    }

    recognition.onerror = (event) => {
      const errorType = event?.error || 'unknown'
      if (errorType === 'not-allowed') {
        setError('Microphone permission denied. Please allow microphone access and try again.')
      } else if (errorType === 'no-speech') {
        setError('No speech detected. Speak closer to the microphone and try again.')
      } else if (errorType === 'audio-capture') {
        setError('No microphone was found. Check your microphone connection and browser permissions.')
      } else if (errorType === 'language-not-supported') {
        setError(`Speech recognition is not available for ${language} in this browser.`)
      } else {
        setError('Voice capture failed. Please speak slowly and review the transcript manually.')
      }
      setVoiceStatus('')
    }

    recognition.onend = () => {
      setIsListening(false)
    }
  }

  return (
    <div className="panel-card stack-lg">
      <div>
        <p className="section-eyebrow">Clinical Intake</p>
        <h3 className="section-title">{copy.triageTitle}</h3>
        <p className="section-subtitle">{copy.triageHint}</p>
      </div>

      <form onSubmit={handleSubmit} className="stack-md">
        <div className="field-block">
          <label className="field-label">{copy.symptoms}</label>
          <div className="textarea-wrap">
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={5}
              placeholder="Child with fever, poor feeding, chest indrawing, recent prescription given by local clinic..."
              className="app-textarea"
            />
            <button
              type="button"
              onClick={handleVoice}
              className="icon-button"
              disabled={isListening}
            >
              {isListening ? '🎙️ Listening...' : `🎙️ ${copy.voice}`}
            </button>
          </div>
          <p className="section-subtitle">
            Voice input is draft text only. Review and correct the captured symptoms before triage.
          </p>
          {voiceStatus && <p className="success-text">{voiceStatus}</p>}
        </div>

        <div className="grid-form grid-4">
          <div className="field-block">
            <label className="field-label">{copy.ageYears}</label>
            <input
              value={ageYears}
              onChange={(e) => setAgeYears(e.target.value)}
              className="app-input"
              type="number"
              placeholder="2"
            />
          </div>
          <div className="field-block">
            <label className="field-label">{copy.weightKg}</label>
            <input
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="app-input"
              type="number"
              placeholder="12"
            />
          </div>
          <div className="field-block">
            <label className="field-label">{copy.temperature}</label>
            <input
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="app-input"
              type="number"
              step="0.1"
              placeholder="38.5"
            />
          </div>
          <div className="field-block">
            <label className="field-label">{copy.pulse}</label>
            <input
              value={pulse}
              onChange={(e) => setPulse(e.target.value)}
              className="app-input"
              type="number"
              placeholder="108"
            />
          </div>
        </div>

        <div className="grid-form grid-4">
          <div className="field-block">
            <label className="field-label">{copy.spo2}</label>
            <input
              value={spo2}
              onChange={(e) => setSpo2(e.target.value)}
              className="app-input"
              type="number"
              placeholder="96"
            />
          </div>
          <div className="field-block">
            <label className="field-label">{copy.bp}</label>
            <input
              value={bp}
              onChange={(e) => setBp(e.target.value)}
              className="app-input"
              type="text"
              placeholder="100/70"
            />
          </div>
          <div className="field-block">
            <label className="field-label">{copy.glucose}</label>
            <input
              value={glucose}
              onChange={(e) => setGlucose(e.target.value)}
              className="app-input"
              type="text"
              placeholder="110 mg/dL"
            />
          </div>
          <div className="field-block" />
        </div>

        <div className="grid-form grid-2">
          <div className="field-block">
            <label className="field-label">{copy.upload}</label>
            <label className="upload-box">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                hidden
              />
              <span className="upload-title">Click to attach image or PDF</span>
              <span className="upload-subtitle">
                Prescription image, discharge summary, lab sheet, or handwritten note
              </span>
            </label>
            {uploadedFile && <p className="success-text">✓ {copy.uploaded}: {uploadedFile.name}</p>}
          </div>

          <div className="field-block">
            <label className="field-label">{copy.notes}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Allergy history, current medicines, pregnancy status, caregiver concerns..."
              className="app-textarea compact"
            />
          </div>
        </div>

        {error && <div className="error-box">{error}</div>}

        <button type="submit" disabled={loading} className="primary-button full-width">
          {loading ? 'Processing clinical assessment...' : copy.runTriage}
        </button>
      </form>
    </div>
  )
}