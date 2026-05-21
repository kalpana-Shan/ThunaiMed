import { useMemo, useRef, useState } from 'react'

const LANGUAGE_OPTIONS = [
  'English',
  'Tamil',
  'Hindi',
  'Telugu',
  'Kannada',
  'Malayalam',
  'Bengali',
  'Marathi',
  'Gujarati',
  'Punjabi',
  'Urdu',
  'Odia',
  'Assamese',
  'Spanish',
  'French',
  'Portuguese',
  'Arabic',
  'Swahili',
  'Indonesian',
  'Filipino',
  'Turkish',
  'German',
  'Japanese',
  'Korean',
  'Chinese',
  'Vietnamese'
]

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

export default function TranslatorPanel() {
  const [fromLanguage, setFromLanguage] = useState('English')
  const [toLanguage, setToLanguage] = useState('Tamil')
  const [doctorTranscript, setDoctorTranscript] = useState('')
  const [patientTranscript, setPatientTranscript] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [conversation, setConversation] = useState([])
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [activeSpeaker, setActiveSpeaker] = useState('doctor')
  const [error, setError] = useState('')
  const recognitionRef = useRef(null)

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

  const canStart = useMemo(() => {
    return !!SpeechRecognition && !listening && !loading
  }, [SpeechRecognition, listening, loading])

  const speakText = (text, language) => {
    if (!window.speechSynthesis || !text?.trim()) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = SPEECH_LOCALES[language] || 'en-IN'
    utterance.rate = 1
    utterance.pitch = 1
    window.speechSynthesis.speak(utterance)
  }

  const sendToTranslate = async (text, source_language, target_language) => {
    const res = await fetch('http://localhost:8000/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        source_language,
        target_language
      })
    })

    const rawText = await res.text()
    if (!res.ok) throw new Error(rawText || 'Translation failed')
    return JSON.parse(rawText)
  }

  const handleStart = () => {
    setError('')

    if (!SpeechRecognition) {
      setError('Voice input is not supported in this browser. Use Chrome or Edge.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = SPEECH_LOCALES[activeSpeaker === 'doctor' ? fromLanguage : toLanguage] || 'en-IN'
    recognition.interimResults = false
    recognition.continuous = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setListening(true)

    recognition.onresult = async (e) => {
      const transcript = e.results?.[0]?.[0]?.transcript?.trim() || ''
      if (!transcript) {
        setError('No clear speech detected. Try again.')
        return
      }

      try {
        setLoading(true)

        if (activeSpeaker === 'doctor') {
          setDoctorTranscript(transcript)

          const result = await sendToTranslate(transcript, fromLanguage, toLanguage)
          const translated = result.translated_text || ''

          setTranslatedText(translated)
          setConversation((prev) => [
            {
              id: crypto.randomUUID(),
              role: 'doctor',
              source: fromLanguage,
              target: toLanguage,
              original: transcript,
              translated,
              timestamp: new Date().toLocaleString()
            },
            ...prev
          ])

          speakText(translated, toLanguage)
          setActiveSpeaker('patient')
        } else {
          setPatientTranscript(transcript)

          const result = await sendToTranslate(transcript, toLanguage, fromLanguage)
          const translated = result.translated_text || ''

          setTranslatedText(translated)
          setConversation((prev) => [
            {
              id: crypto.randomUUID(),
              role: 'patient',
              source: toLanguage,
              target: fromLanguage,
              original: transcript,
              translated,
              timestamp: new Date().toLocaleString()
            },
            ...prev
          ])

          speakText(translated, fromLanguage)
          setActiveSpeaker('doctor')
        }
      } catch (err) {
        setError(err?.message || 'Voice translation failed.')
      } finally {
        setLoading(false)
      }
    }

    recognition.onerror = (event) => {
      const errorType = event?.error || 'unknown'
      if (errorType === 'not-allowed') {
        setError('Microphone permission denied. Allow microphone access and try again.')
      } else if (errorType === 'no-speech') {
        setError('No speech detected. Speak closer to the microphone and try again.')
      } else {
        setError('Voice capture failed. Please try again.')
      }
      setListening(false)
      setLoading(false)
    }

    recognition.onend = () => {
      setListening(false)
      recognitionRef.current = null
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const handleStop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    window.speechSynthesis.cancel()
    setListening(false)
  }

  const handleSwap = () => {
    setFromLanguage(toLanguage)
    setToLanguage(fromLanguage)
    setDoctorTranscript('')
    setPatientTranscript('')
    setTranslatedText('')
    setConversation([])
    setActiveSpeaker('doctor')
    setError('')
  }

  const handleClear = () => {
    setDoctorTranscript('')
    setPatientTranscript('')
    setTranslatedText('')
    setConversation([])
    setError('')
    setActiveSpeaker('doctor')
  }

  return (
    <section className="panel-card stack-lg">
      <div>
        <p className="section-eyebrow">Medical translator</p>
        <h3 className="section-title">Doctor ↔ Patient voice bridge</h3>
        <p className="section-subtitle">
          Speak naturally, capture speech in the browser, translate it, and play the response aloud for the other person.
        </p>
      </div>

      <div className="note-grid">
        <div className="field-block">
          <label className="field-label">Doctor language</label>
          <select className="app-select" value={fromLanguage} onChange={(e) => setFromLanguage(e.target.value)}>
            {LANGUAGE_OPTIONS.map((language) => (
              <option key={language} value={language}>{language}</option>
            ))}
          </select>
        </div>

        <div className="field-block">
          <label className="field-label">Patient language</label>
          <select className="app-select" value={toLanguage} onChange={(e) => setToLanguage(e.target.value)}>
            {LANGUAGE_OPTIONS.map((language) => (
              <option key={language} value={language}>{language}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="translator-toolbar">
        <button type="button" className="icon-button" onClick={handleSwap}>Swap languages</button>
        <button type="button" className="icon-button" onClick={handleClear}>Clear chat</button>
      </div>

      <div className="note-card">
        <h4>Current turn</h4>
        <p>
          {activeSpeaker === 'doctor'
            ? `Doctor speaks in ${fromLanguage}.`
            : `Patient speaks in ${toLanguage}.`}
        </p>
      </div>

      <div className="translator-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="primary-button"
          disabled={!canStart}
          onClick={handleStart}
        >
          {listening ? 'Listening...' : loading ? 'Translating...' : '🎤 Speak'}
        </button>

        <button
          type="button"
          className="icon-button"
          onClick={handleStop}
          disabled={!listening}
        >
          Stop
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="note-grid">
        <div className="field-block">
          <label className="field-label">Doctor / Patient speech transcript</label>
          <textarea
            className="app-textarea"
            rows={6}
            value={activeSpeaker === 'doctor' ? doctorTranscript : patientTranscript}
            readOnly
            placeholder="Voice transcript will appear here..."
          />
        </div>

        <div className="field-block">
          <label className="field-label">Translated spoken output</label>
          <textarea
            className="app-textarea"
            rows={6}
            value={translatedText}
            readOnly
            placeholder="Translated output will appear here..."
          />
        </div>
      </div>

      <div className="stack-md">
        <div>
          <p className="section-eyebrow">Conversation log</p>
          <h4 className="section-title">Recent voice exchanges</h4>
        </div>

        {conversation.length === 0 ? (
          <div className="empty-state">
            <span>🎙️</span>
            <div>
              <strong>No voice exchanges yet.</strong>
              <p className="empty-subtext">
                Press Speak and start a voice conversation between doctor and patient.
              </p>
            </div>
          </div>
        ) : (
          <div className="history-list">
            {conversation.map((item) => (
              <article key={item.id} className="history-card">
                <div className="history-card-top">
                  <div className="history-meta">
                    <span className="history-language">{item.source}</span>
                    <span className="history-language">→</span>
                    <span className="history-language">{item.target}</span>
                    <span className="history-time">{item.timestamp}</span>
                  </div>
                </div>

                <div className="history-content stack-md">
                  <div className="note-card">
                    <h4>Original speech</h4>
                    <p>{item.original}</p>
                  </div>

                  <div className="note-card">
                    <h4>Spoken translation</h4>
                    <p>{item.translated}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}