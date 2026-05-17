const LANGUAGES = [
  { value: 'English', label: 'English' },
  { value: 'Tamil', label: 'தமிழ்' },
  { value: 'Hindi', label: 'हिन्दी' },
  { value: 'Telugu', label: 'తెలుగు' },
  { value: 'Kannada', label: 'ಕನ್ನಡ' },
  { value: 'Malayalam', label: 'മലയാളം' },
  { value: 'Bengali', label: 'বাংলা' },
  { value: 'Marathi', label: 'मराठी' },
  { value: 'Gujarati', label: 'ગુજરાતી' },
  { value: 'Punjabi', label: 'ਪੰਜਾਬੀ' },
  { value: 'Urdu', label: 'اردو' },
  { value: 'Odia', label: 'ଓଡ଼ିଆ' },
  { value: 'Assamese', label: 'অসমীয়া' },
  { value: 'Spanish', label: 'Español' },
  { value: 'French', label: 'Français' },
  { value: 'Portuguese', label: 'Português' },
  { value: 'Arabic', label: 'العربية' },
  { value: 'Swahili', label: 'Kiswahili' },
  { value: 'Indonesian', label: 'Bahasa Indonesia' },
  { value: 'Filipino', label: 'Filipino' },
  { value: 'Turkish', label: 'Türkçe' },
  { value: 'German', label: 'Deutsch' },
  { value: 'Japanese', label: '日本語' },
  { value: 'Korean', label: '한국어' },
  { value: 'Chinese', label: '中文' },
  { value: 'Vietnamese', label: 'Tiếng Việt' }
]

export default function LanguageSelector({ value, onChange }) {
  return (
    <div className="language-selector-wrap">
      <label htmlFor="language-select" className="field-label">
        Language
      </label>

      <select
        id="language-select"
        className="app-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {LANGUAGES.map((language) => (
          <option key={language.value} value={language.value}>
            {language.label}
          </option>
        ))}
      </select>
    </div>
  )
}