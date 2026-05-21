import { useState } from 'react'

export default function VoiceInput({ onTranscript, language = 'en-IN' }) {
  const [listening, setListening] = useState(false)
  const [error, setError] = useState('')

  const startListening = () => {
    setError('')

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setError('Voice input is not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = language
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || ''
      if (transcript) onTranscript?.(transcript)
    }

    recognition.onerror = () => {
      setError('Voice input failed. Try again.')
    }

    recognition.start()
  }

  return (
    <div className="voice-input">
      <button type="button" onClick={startListening} className="voice-button">
        {listening ? 'Listening...' : '🎤 Start Voice Input'}
      </button>
      {error ? <p className="voice-error">{error}</p> : null}
    </div>
  )
}