import { useEffect, useState } from 'react'
import { clearHistory, reopenCase, subscribeMockState } from '../utils/mockStore'

export default function HistoryPanel({ onReopen }) {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const unsubscribe = subscribeMockState((state) => {
      setHistory(state.history || [])
    })
    return unsubscribe
  }, [])

  const handleClear = () => {
    clearHistory()
  }

  const handleReopen = (item) => {
    reopenCase(item)
    if (onReopen) onReopen(item)
  }

  return (
    <section className="panel-card stack-lg">
      <div className="history-header-row">
        <div>
          <p className="section-eyebrow">Case review</p>
          <h3 className="section-title">Clinical history and audit trail</h3>
          <p className="section-subtitle">
            Review previous assessments, verify earlier symptom entries, and reopen a case for continuity and safety.
          </p>
        </div>

        {history.length > 0 && (
          <button type="button" className="icon-button" onClick={handleClear}>
            Clear history
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <span>🕘</span>
          <div>
            <strong>No saved cases yet.</strong>
            <p className="empty-subtext">
              Completed triage results will appear here with time, zone, and summary.
            </p>
          </div>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <article key={item.id} className="history-card">
              <div className="history-card-top">
                <div className="history-meta">
                  <span className={`zone-badge zone-${String(item.zone || '').toLowerCase()}`}>
                    {item.zone || 'UNKNOWN'}
                  </span>
                  <span className="history-time">{item.timestamp}</span>
                  {item.language && (
                    <span className="history-language">{item.language}</span>
                  )}
                </div>

                <button
                  type="button"
                  className="icon-button"
                  onClick={() => handleReopen(item)}
                >
                  Reopen
                </button>
              </div>

              <div className="history-content stack-md">
                <div>
                  <h4 className="history-title">{item.summary || 'Untitled case summary'}</h4>
                  <p className="history-symptoms">
                    {item.symptoms || 'No symptom description stored.'}
                  </p>
                </div>

                <div className="note-grid">
                  <div className="note-card">
                    <h4>Immediate action</h4>
                    <p>{item.immediate_action || 'No immediate action recorded.'}</p>
                  </div>

                  <div className="note-card">
                    <h4>Clinical note</h4>
                    <p>{item.notes || 'No additional note available for this entry.'}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}