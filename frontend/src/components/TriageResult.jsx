export default function TriageResult({ result }) {
  if (!result) return null

  const zone = String(result.zone || 'UNKNOWN').toUpperCase()

  return (
    <section className="panel-card stack-lg">
      <div className="result-header">
        <div>
          <p className="section-eyebrow">Clinical report</p>
          <h3 className="section-title">Structured triage summary</h3>
          <p className="section-subtitle">
            A clear, doctor-like summary of the assessment, actions, and safety guidance.
          </p>
        </div>

        <span className={`zone-badge zone-${zone.toLowerCase()}`}>
          {zone}
        </span>
      </div>

      <div className="result-grid">
        <div className="note-card">
          <h4>Summary</h4>
          <p>{result.summary || 'No summary available.'}</p>
        </div>

        <div className="note-card">
          <h4>Immediate action</h4>
          <p>{result.immediate_action || 'No immediate action recorded.'}</p>
        </div>

        <div className="note-card">
          <h4>Warning signs</h4>
          <p>{result.warning_signs || 'No warning signs provided in the current result.'}</p>
        </div>

        <div className="note-card">
          <h4>Follow-up</h4>
          <p>{result.follow_up || 'No follow-up guidance available.'}</p>
        </div>

        {result.first_aid && (
          <div className="note-card">
            <h4>First aid</h4>
            <p>{result.first_aid}</p>
          </div>
        )}

        {result.reasoning_steps?.length > 0 && (
          <div className="note-card">
            <h4>Clinical reasoning</h4>
            <p>
              This assessment includes {result.reasoning_steps.length} structured reasoning step
              {result.reasoning_steps.length > 1 ? 's' : ''}.
            </p>
          </div>
        )}
      </div>

      <div className="note-grid">
        <div className="note-card">
          <h4>What this means</h4>
          <p>
            This result is meant to help frontline staff understand urgency, next action, and the reason for the triage outcome.
          </p>
        </div>

        <div className="note-card">
          <h4>Important note</h4>
          <p>
            Use this output as decision support and verify critical symptoms, vitals, and danger signs before final action.
          </p>
        </div>
      </div>
    </section>
  )
}