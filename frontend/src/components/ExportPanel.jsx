import { useMemo, useState, useEffect } from 'react'
import { getLatestExportData, subscribeMockState } from '../utils/mockStore'

export default function ExportPanel() {
  const [latestCase, setLatestCase] = useState(null)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    const unsubscribe = subscribeMockState((state) => {
      setLatestCase(state.latestCase || null)
    })
    return unsubscribe
  }, [])

  const exportData = useMemo(() => {
    if (!latestCase) return null

    return getLatestExportData()
  }, [latestCase])

  const handleExport = () => {
    if (!exportData) {
      setStatus('No case available to export.')
      return
    }

    setStatus('Preparing audit receipt...')
    setTimeout(() => {
      setStatus('Export ready. Hook this to jsPDF when you connect the final PDF flow.')
    }, 300)
  }

  return (
    <section className="panel-card stack-lg">
      <div>
        <p className="section-eyebrow">Audit output</p>
        <h3 className="section-title">Export and clinical summary</h3>
        <p className="section-subtitle">
          Generate a shareable summary for handoff, review, or audit. This is designed to become a PDF receipt later.
        </p>
      </div>

      <div className="note-grid">
        <div className="note-card">
          <h4>What will be exported</h4>
          <p>Zone, summary, symptoms, immediate action, follow-up, warning signs, and first aid notes.</p>
        </div>

        <div className="note-card">
          <h4>Format</h4>
          <p>Client-side PDF or printable receipt when the export library is wired in.</p>
        </div>
      </div>

      <div className="result-grid">
        <button type="button" className="primary-button" onClick={handleExport}>
          Export clinical receipt
        </button>

        {status !== 'idle' && (
          <div className="note-card">
            <h4>Export status</h4>
            <p>{status}</p>
          </div>
        )}
      </div>

      {exportData && (
        <div className="history-card">
          <div className="history-card-top">
            <div className="history-meta">
              <span className={`zone-badge zone-${String(exportData.zone).toLowerCase()}`}>
                {exportData.zone}
              </span>
              <span className="history-time">{exportData.date}</span>
            </div>
          </div>

          <div className="history-content stack-md">
            <div className="note-card">
              <h4>Summary</h4>
              <p>{exportData.summary}</p>
            </div>

            <div className="note-card">
              <h4>Symptoms</h4>
              <p>{exportData.symptoms}</p>
            </div>

            <div className="note-card">
              <h4>Immediate action</h4>
              <p>{exportData.immediate_action}</p>
            </div>

            <div className="note-card">
              <h4>Follow-up</h4>
              <p>{exportData.follow_up}</p>
            </div>

            <div className="note-card">
              <h4>Warning signs</h4>
              <p>{exportData.warning_signs}</p>
            </div>

            <div className="note-card">
              <h4>First aid</h4>
              <p>{exportData.first_aid}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}