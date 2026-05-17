import { useMemo, useState } from 'react'
import { logTranslation } from '../utils/mockStore'

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

function buildMockTranslation(input, fromLanguage, toLanguage) {
  if (!input.trim()) {
    return {
      translated_text: '',
      preserved_terms: [],
      warning: '',
      confidence: 'low'
    }
  }

  const medicalTerms = [
    'fever',
    'rash',
    'cough',
    'bleeding',
    'pregnant',
    'pregnancy',
    'allergy',
    'asthma',
    'diabetes',
    'vomiting',
    'diarrhoea',
    'diarrhea',
    'fracture',
    'burn',
    'pain',
    'tablet',
    'dose',
    'insulin',
    'paracetamol',
    'antibiotic',
    'chest pain',
    'breathlessness',
    'seizure'
  ]

  const lowered = input.toLowerCase()
  const preserved = medicalTerms.filter((term) => lowered.includes(term))

  return {
    translated_text: `[Mock ${fromLanguage} → ${toLanguage}] ${input}`,
    preserved_terms: preserved,
    warning: preserved.length > 0
      ? 'Critical medical terms were detected. Please confirm symptom severity, duration, and medicine names before acting.'
      : 'Review translation carefully before clinical use.',
    confidence: preserved.length >= 2 ? 'medium' : 'low'
  }
}

export default function TranslatorPanel() {
  const [fromLanguage, setFromLanguage] = useState('English')
  const [toLanguage, setToLanguage] = useState('Tamil')
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState(null)
  const [conversation, setConversation] = useState([])

  const canTranslate = useMemo(() => {
    return inputText.trim().length > 0 && fromLanguage && toLanguage
  }, [inputText, fromLanguage, toLanguage])

  const handleTranslate = () => {
    const mock = buildMockTranslation(inputText, fromLanguage, toLanguage)
    const entry = logTranslation({
      fromLanguage,
      toLanguage,
      original_text: inputText,
      translated_text: mock.translated_text,
      preserved_terms: mock.preserved_terms,
      warning: mock.warning,
      confidence: mock.confidence
    })

    setResult(entry)
    setConversation((prev) => [entry, ...prev])
  }

  const handleSwap = () => {
    setFromLanguage(toLanguage)
    setToLanguage(fromLanguage)
  }

  const handleClear = () => {
    setInputText('')
    setResult(null)
  }

  return (
    <section className="panel-card stack-lg">
      <div>
        <p className="section-eyebrow">Medical translator</p>
        <h3 className="section-title">Doctor ↔ Patient conversation bridge</h3>
        <p className="section-subtitle">
          Translate clinical conversations more safely by preserving symptoms, medicine names, and critical medical phrases for review.
        </p>
      </div>

      <div className="note-grid">
        <div className="field-block">
          <label className="field-label">From language</label>
          <select
            className="app-select"
            value={fromLanguage}
            onChange={(e) => setFromLanguage(e.target.value)}
          >
            {LANGUAGE_OPTIONS.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        <div className="field-block">
          <label className="field-label">To language</label>
          <select
            className="app-select"
            value={toLanguage}
            onChange={(e) => setToLanguage(e.target.value)}
          >
            {LANGUAGE_OPTIONS.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="translator-toolbar">
        <button type="button" className="icon-button" onClick={handleSwap}>
          Swap languages
        </button>
        <button type="button" className="icon-button" onClick={handleClear}>
          Clear text
        </button>
      </div>

      <div className="note-grid">
        <div className="field-block">
          <label className="field-label">Original conversation</label>
          <textarea
            className="app-textarea"
            rows={7}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Example: The child has had fever for two days, is refusing feeds, and took paracetamol last night."
          />
        </div>

        <div className="field-block">
          <label className="field-label">Translated output</label>
          <textarea
            className="app-textarea"
            rows={7}
            value={result?.translated_text || ''}
            readOnly
            placeholder="Translated output will appear here..."
          />
        </div>
      </div>

      <div className="translator-actions">
        <button
          type="button"
          className="primary-button"
          disabled={!canTranslate}
          onClick={handleTranslate}
        >
          Translate medically
        </button>
      </div>

      {result && (
        <div className="result-grid">
          <div className="note-card">
            <h4>Safety review</h4>
            <p>{result.warning}</p>
          </div>

          <div className="note-card">
            <h4>Confidence</h4>
            <p>{result.confidence}</p>
          </div>

          <div className="note-card">
            <h4>Preserved medical terms</h4>
            <p>
              {result.preserved_terms.length > 0
                ? result.preserved_terms.join(', ')
                : 'No critical medical terms detected in the current mock translation.'}
            </p>
          </div>
        </div>
      )}

      <div className="stack-md">
        <div>
          <p className="section-eyebrow">Conversation log</p>
          <h4 className="section-title">Recent translated exchanges</h4>
        </div>

        {conversation.length === 0 ? (
          <div className="empty-state">
            <span>💬</span>
            <div>
              <strong>No translated exchanges yet.</strong>
              <p className="empty-subtext">
                Completed translations will appear here for review and continuity.
              </p>
            </div>
          </div>
        ) : (
          <div className="history-list">
            {conversation.map((item) => (
              <article key={item.id} className="history-card">
                <div className="history-card-top">
                  <div className="history-meta">
                    <span className="history-language">{item.fromLanguage}</span>
                    <span className="history-language">→</span>
                    <span className="history-language">{item.toLanguage}</span>
                    <span className="history-time">{item.timestamp}</span>
                  </div>
                </div>

                <div className="history-content stack-md">
                  <div className="note-card">
                    <h4>Original</h4>
                    <p>{item.original_text}</p>
                  </div>

                  <div className="note-card">
                    <h4>Translated</h4>
                    <p>{item.translated_text}</p>
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