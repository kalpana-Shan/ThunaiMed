import { useState } from 'react'
import { facilityRequest } from '../api'

export default function FacilityFinder({ copy }) {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [manualLat, setManualLat] = useState('11.0168')
  const [manualLon, setManualLon] = useState('76.9558')

  const findByGPS = () => {
    if (!navigator.geolocation) {
      setError('GPS is not supported on this device.')
      return
    }

    setLoading(true)
    setError('')

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const data = await facilityRequest(pos.coords.latitude, pos.coords.longitude)
          setResult(data)
        } catch {
          setError('Backend could not return nearest facility. Check API status.')
        } finally {
          setLoading(false)
        }
      },
      () => {
        setError(copy.permissionDenied)
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  const findManual = async (e) => {
    e.preventDefault()
    if (!manualLat || !manualLon) {
      setError('Enter both latitude and longitude.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const data = await facilityRequest(parseFloat(manualLat), parseFloat(manualLon))
      setResult(data)
    } catch {
      setError('Backend could not return nearest facility. Check API status.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="stack-lg">
      <div className="panel-card stack-lg">
        <div>
          <p className="section-eyebrow">Referral Logistics</p>
          <h3 className="section-title">{copy.facilityTitle}</h3>
          <p className="section-subtitle">{copy.facilityHint}</p>
        </div>

        <button onClick={findByGPS} disabled={loading} className="primary-button full-width">
          {loading ? 'Fetching current location...' : copy.useGps}
        </button>

        <div className="divider-label">{copy.manualFallback}</div>

        <form onSubmit={findManual} className="stack-md">
          <div className="grid-form grid-2">
            <div className="field-block">
              <label className="field-label">Latitude</label>
              <input value={manualLat} onChange={(e) => setManualLat(e.target.value)} className="app-input" type="number" step="0.0001" />
            </div>
            <div className="field-block">
              <label className="field-label">Longitude</label>
              <input value={manualLon} onChange={(e) => setManualLon(e.target.value)} className="app-input" type="number" step="0.0001" />
            </div>
          </div>

          {error && <div className="error-box">{error}</div>}

          <button type="submit" disabled={loading} className="secondary-button full-width">
            Find nearest facility manually
          </button>
        </form>
      </div>

      {result && (
        <div className="panel-card stack-md">
          <div className="result-header">
            <div>
              <p className="section-eyebrow">{copy.nearestFacility}</p>
              <h3 className="section-title">{result.name}</h3>
            </div>
            <div className="distance-pill">{result.distance_km} km</div>
          </div>

          <div className="vitals-grid">
            <div className="vital-chip"><span className="chip-key">Type</span><span className="chip-value">{result.type}</span></div>
            <div className="vital-chip"><span className="chip-key">District</span><span className="chip-value">{result.district}</span></div>
            <div className="vital-chip"><span className="chip-key">Phone</span><span className="chip-value">{result.phone || 'Not available'}</span></div>
          </div>

          {result.phone && (
            <a href={`tel:${result.phone}`} className="primary-button full-width center-link">Call facility now</a>
          )}

          <div className="soft-box">{result.note}</div>
        </div>
      )}
    </div>
  )
}