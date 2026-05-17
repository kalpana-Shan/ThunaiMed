import { useMemo, useState } from 'react'
import CaseInput from './components/CaseInput'
import TriageResult from './components/TriageResult'
import DrugChecker from './components/DrugChecker'
import FacilityFinder from './components/FacilityFinder'
import ReasoningTimeline from './components/ReasoningTimeline'
import LanguageSelector from './components/LanguageSelector'
import HistoryPanel from './components/HistoryPanel'
import TranslatorPanel from './components/TranslatorPanel'
import VisionPanel from './components/VisionPanel'
import ExportPanel from './components/ExportPanel'
import ClinicalOverview from './components/ClinicalOverview'
import { getCopy } from './i18n'

const MODULES = [
  { key: 'Triage', copyKey: 'navTriage', icon: '▣' },
  { key: 'Translate', copyKey: 'navTranslate', icon: '⇄' },
  { key: 'Vision', copyKey: 'navVision', icon: '◉' },
  { key: 'History', copyKey: 'navHistory', icon: '☰' },
  { key: 'Drug', copyKey: 'navDrug', icon: '✚' },
  { key: 'Facility', copyKey: 'navFacility', icon: '⌖' },
  { key: 'Export', copyKey: 'navExport', icon: '⇩' }
]

function PlaceholderPanel({ copy, titleKey, descriptionKey, bulletKeys = [] }) {
  return (
    <section className="panel-card stack-lg">
      <div>
        <p className="section-eyebrow">{copy.comingNext}</p>
        <h3 className="section-title">{copy[titleKey]}</h3>
        <p className="section-subtitle">{copy[descriptionKey]}</p>
      </div>

      {bulletKeys.length > 0 && (
        <ul className="side-list">
          {bulletKeys.map((key) => (
            <li key={key}>{copy[key]}</li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default function App() {
  const [activeModule, setActiveModule] = useState('Triage')
  const [triageResult, setTriageResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState('English')
  const copy = useMemo(() => getCopy(language), [language])

  const renderMainPanel = () => {
    if (activeModule === 'Triage') {
      return (
        <div className="stack-xl">
          <div className="workspace-header">
            <div>
              <p className="workspace-kicker">{copy.workspaceKicker}</p>
              <h2 className="workspace-title">{copy.navTriage}</h2>
              <p className="workspace-subtitle">{copy.triageWorkspaceSubtitle}</p>
            </div>
          </div>

          <CaseInput
            onResult={setTriageResult}
            loading={loading}
            setLoading={setLoading}
            language={language}
            copy={copy}
          />

          {triageResult && (
            <>
              <TriageResult result={triageResult} copy={copy} />
              {triageResult.reasoning_steps?.length > 0 && (
                <ReasoningTimeline steps={triageResult.reasoning_steps} />
              )}
            </>
          )}
        </div>
      )
    }

    if (activeModule === 'Translate') {
      return <TranslatorPanel copy={copy} language={language} />
    }

    if (activeModule === 'Vision') {
      return <VisionPanel copy={copy} />
    }

    if (activeModule === 'History') {
      return <HistoryPanel copy={copy} />
    }

    if (activeModule === 'Drug') {
      return (
        <div className="stack-xl">
          <div className="workspace-header">
            <div>
              <p className="workspace-kicker">{copy.workspaceKicker}</p>
              <h2 className="workspace-title">{copy.navDrug}</h2>
              <p className="workspace-subtitle">{copy.drugWorkspaceSubtitle}</p>
            </div>
          </div>
          <DrugChecker copy={copy} />
        </div>
      )
    }

    if (activeModule === 'Facility') {
      return (
        <div className="stack-xl">
          <div className="workspace-header">
            <div>
              <p className="workspace-kicker">{copy.workspaceKicker}</p>
              <h2 className="workspace-title">{copy.navFacility}</h2>
              <p className="workspace-subtitle">{copy.facilityWorkspaceSubtitle}</p>
            </div>
          </div>
          <FacilityFinder copy={copy} />
        </div>
      )
    }

    if (activeModule === 'Export') {
      return <ExportPanel copy={copy} />
    }

    return null
  }

  return (
    <div className="app-frame">
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo-mark">✚</div>
          <div>
            <h1 className="sidebar-logo-text">ThunaiMed</h1>
            <p className="sidebar-logo-subtext">{copy.appTag}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {MODULES.map((module) => (
            <button
              key={module.key}
              type="button"
              className={`sidebar-nav-item ${activeModule === module.key ? 'sidebar-nav-item-active' : ''}`}
              onClick={() => setActiveModule(module.key)}
            >
              <span className="sidebar-nav-icon">{module.icon}</span>
              <span>{copy[module.copyKey]}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="status-badge">{copy.sidebarStatus}</div>
          <p className="sidebar-footnote">{copy.sidebarFootnote}</p>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <div className="topbar-copy">
            <p className="topbar-kicker">{copy.topbarKicker}</p>
            <h2 className="topbar-title">{copy.topbarTitle}</h2>
          </div>

          <div className="topbar-tools">
            <div className="topbar-chip">{copy.topbarChip1}</div>
            <div className="topbar-chip">{copy.topbarChip2}</div>
            <LanguageSelector value={language} onChange={setLanguage} />
          </div>
        </header>

        <main className="app-content-grid">
          <section className="workspace-column">
            {renderMainPanel()}
          </section>

          <aside className="insight-column">
            <ClinicalOverview />
            <div className="panel-card stack-md">
              <div>
                <p className="section-eyebrow">{copy.panelRoadmapEyebrow}</p>
                <h3 className="section-title">{copy.panelRoadmapTitle}</h3>
              </div>
              <ul className="side-list">
                <li>{copy.panelRoadmapItem1}</li>
                <li>{copy.panelRoadmapItem2}</li>
                <li>{copy.panelRoadmapItem3}</li>
                <li>{copy.panelRoadmapItem4}</li>
              </ul>
            </div>

            <div className="panel-card stack-md">
              <div>
                <p className="section-eyebrow">{copy.panelSafetyEyebrow}</p>
                <h3 className="section-title">{copy.panelSafetyTitle}</h3>
              </div>
              <ul className="side-list muted">
                <li>{copy.panelSafetyItem1}</li>
                <li>{copy.panelSafetyItem2}</li>
                <li>{copy.panelSafetyItem3}</li>
                <li>{copy.panelSafetyItem4}</li>
              </ul>
            </div>

            <div className="panel-card stack-md soft-accent">
              <div>
                <p className="section-eyebrow">{copy.panelFocusEyebrow}</p>
                <h3 className="section-title">{copy.panelFocusTitle}</h3>
              </div>
              <p className="note-text">{copy.panelFocusNote}</p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  )
}