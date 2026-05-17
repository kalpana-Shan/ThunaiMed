import { useState } from 'react'
import { drugRequest } from '../api'

export default function DrugChecker({ copy }) {
  const [drugName, setDrugName] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const [ageMonths, setAgeMonths] = useState('')
  const [isPregnant, setIsPregnant] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const COMMON_DRUGS = ['Paracetamol', 'Amoxicillin', 'ORS', 'Zinc', 'Iron', 'Albendazole', 'Metformin']

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!drugName.trim()) {
      setError('Enter a medicine name.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const data = await drugRequest(drugName, weightKg, ageMonths, isPregnant)
      setResult(data)
    } catch {
      setError('Could not reach backend. Make sure FastAPI is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="stack-lg">
      <div className="panel-card stack-lg">
        <div>
          <p className="section-eyebrow">Medication Safety</p>
          <h3 className="section-title">{copy.drugTitle}</h3>
          <p className="section-subtitle">{copy.drugHint}</p>
        </div>

        <div className="pill-row">
          {COMMON_DRUGS.map((drug) => (
            <button key={drug} onClick={() => setDrugName(drug)} className={`pill ${drugName === drug ? 'pill-active' : ''}`}>
              {drug}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="stack-md">
          <div className="field-block">
            <label className="field-label">Medicine name</label>
            <input value={drugName} onChange={(e) => setDrugName(e.target.value)} className="app-input" placeholder="Paracetamol" />
          </div>

          <div className="grid-form grid-3">
            <div className="field-block">
              <label className="field-label">{copy.weightKg}</label>
              <input value={weightKg} onChange={(e) => setWeightKg(e.target.value)} className="app-input" type="number" placeholder="12" />
            </div>
            <div className="field-block">
              <label className="field-label">{copy.ageMonths}</label>
              <input value={ageMonths} onChange={(e) => setAgeMonths(e.target.value)} className="app-input" type="number" placeholder="24" />
            </div>
            <label className="checkbox-card">
              <input type="checkbox" checked={isPregnant} onChange={(e) => setIsPregnant(e.target.checked)} />
              <span>Pregnancy context</span>
            </label>
          </div>

          {error && <div className="error-box">{error}</div>}

          <button type="submit" disabled={loading} className="primary-button full-width">
            {loading ? 'Checking safety...' : 'Check medicine guidance'}
          </button>
        </form>
      </div>

      {result && (
        <div className="panel-card stack-md">
          <div className="result-header">
            <div>
              <p className="section-eyebrow">Result</p>
              <h3 className="section-title">{result.drug}</h3>
            </div>
            <div className="status-pill">{result.source}</div>
          </div>

          <div className="summary-card">
            <p className="summary-label">Recommended dose</p>
            <p className="summary-text">{result.dose}</p>
          </div>

          {result.notes && <div className="soft-box">{result.notes}</div>}

          {result.contraindications?.length > 0 && (
            <div className="danger-box">
              <p className="summary-label">Safety alerts</p>
              <ul className="side-list">
                {result.contraindications.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )}

          <div className="disclaimer-box">{result.warning}</div>
        </div>
      )}
    </div>
  )
}