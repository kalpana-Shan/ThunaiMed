import { jsPDF } from 'jspdf'

export default function AuditReceipt({ caseData = {} }) {
  const handleExport = () => {
    const pdf = new jsPDF()
    let y = 16

    pdf.setFontSize(18)
    pdf.text('ThunaiMed Audit Receipt', 14, y)
    y += 10

    pdf.setFontSize(11)
    const lines = [
      `Date: ${new Date().toLocaleString()}`,
      `Patient: ${caseData.patientName || 'Anonymous'}`,
      `Age: ${caseData.age || '-'}`,
      `Weight: ${caseData.weight || '-'}`,
      `Zone: ${caseData.zone || '-'}`,
      `Language: ${caseData.language || '-'}`,
      '',
      'Reasoning Steps:'
    ]

    lines.forEach((line) => {
      pdf.text(line, 14, y)
      y += 7
    })

    ;(caseData.reasoningSteps || []).forEach((step, index) => {
      const wrapped = pdf.splitTextToSize(`${index + 1}. ${step}`, 180)
      pdf.text(wrapped, 14, y)
      y += wrapped.length * 6

      if (y > 270) {
        pdf.addPage()
        y = 16
      }
    })

    y += 4
    pdf.text('Disclaimer: This is a triage support receipt, not a diagnosis.', 14, y)
    pdf.save('thunaimed-audit-receipt.pdf')
  }

  return (
    <button type="button" onClick={handleExport} className="audit-button">
      Export Audit Receipt
    </button>
  )
}