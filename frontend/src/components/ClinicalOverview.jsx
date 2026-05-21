import { useEffect, useState } from 'react'
import { subscribeMockState } from '../utils/mockStore'

export default function ClinicalOverview() {
  const [state, setState] = useState({
    history: [],
    translatorLog: [],
    visionLog: [],
    latestCase: null
  })

  useEffect(() => {
    const unsubscribe = subscribeMockState((current) => {
      setState({
        history: current.history || [],
        translatorLog: current.translatorLog || [],
        visionLog: current.visionLog || [],
        latestCase: current.latestCase || null
      })
    })

    return unsubscribe
  }, [])

  const zone = state.latestCase?.zone || 'UNKNOWN'

  return (
    <section className="panel-card stack-lg">
      <div>
        <p className="section-eyebrow">Overview</p>
        <h3 className="section-title">Clinical workflow at a glance</h3>
        <p className="section-subtitle">
          A compact summary of triage activity, translator usage, image reviews, and the latest saved case.
        </p>
      </div>

      <div className="note-grid">
        <div className="note-card">
          <h4>Saved cases</h4>
          <p>{state.history.length}</p>
        </div>

        <div className="note-card">
          <h4>Translations</h4>
          <p>{state.translatorLog.length}</p>
        </div>

        <div className="note-card">
          <h4>Image reviews</h4>
          <p>{state.visionLog.length}</p>
        </div>

        <div className="note-card">
          <h4>Latest zone</h4>
          <p>{zone}</p>
        </div>
      </div>

      {state.latestCase ? (
        <div className="history-card">
          <div className="history-card-top">
            <div className="history-meta">
              <span className={`zone-badge zone-${String(state.latestCase.zone || '').toLowerCase()}`}>
                {state.latestCase.zone || 'UNKNOWN'}
              </span>
              <span className="history-time">{state.latestCase.timestamp}</span>
            </div>
          </div>

          <div className="history-content stack-md">
            <div className="note-card">
              <h4>Latest summary</h4>
              <p className="compact-preview">{state.latestCase.summary || 'No summary available.'}</p>
            </div>

            <div className="note-card">
              <h4>Latest symptoms</h4>
              <p className="compact-preview">{state.latestCase.symptoms || 'No symptom text available.'}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state compact-empty">
          <span>📋</span>
          <div>
            <strong>No latest case yet.</strong>
            <p className="empty-subtext">Run a triage to populate this overview.</p>
          </div>
        </div>
      )}
    </section>
  )
}