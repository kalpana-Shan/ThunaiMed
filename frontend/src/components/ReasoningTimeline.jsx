import { useState } from 'react'
import { ChevronDown, ChevronUp, ShieldCheck, FileText } from 'lucide-react'

export default function ReasoningTimeline({ steps = [], title = 'Reasoning Timeline' }) {
  const [open, setOpen] = useState(true)

  if (!steps || steps.length === 0) {
    return (
      <section className="panel-card">
        <div className="panel-card-header">
          <div>
            <p className="panel-kicker">Explainability</p>
            <h3 className="panel-title">{title}</h3>
          </div>
        </div>
        <div className="empty-state small-empty">
          <ShieldCheck size={18} />
          <p>No reasoning steps available yet.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="panel-card">
      <div className="panel-card-header">
        <div>
          <p className="panel-kicker">Explainability</p>
          <h3 className="panel-title">{title}</h3>
        </div>

        <button
          type="button"
          className="icon-toggle-btn"
          onClick={() => setOpen(prev => !prev)}
          aria-expanded={open}
          aria-label={open ? 'Collapse reasoning timeline' : 'Expand reasoning timeline'}
        >
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {open && (
        <div className="timeline-list">
          {steps.map((item, index) => (
            <article key={index} className="timeline-item">
              <div className="timeline-marker">
                <span>{item.step || index + 1}</span>
              </div>

              <div className="timeline-content">
                <h4 className="timeline-heading">
                  {item.observation || `Step ${index + 1}`}
                </h4>

                {item.reasoning && (
                  <p className="timeline-text">{item.reasoning}</p>
                )}

                {item.source && (
                  <div className="timeline-source">
                    <FileText size={14} />
                    <span>Source: {item.source}</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}