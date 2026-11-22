import * as XLSX from 'xlsx'

export function exportToExcel(applications, filename) {
  if (!applications || !Array.isArray(applications)) return

  const rows = applications.map((app) => {
    const salaryStr = app.salary
      ? [
          app.salary.currency || '',
          app.salary.min ? Number(app.salary.min).toLocaleString() : '',
          app.salary.max ? `- ${Number(app.salary.max).toLocaleString()}` : '',
          app.salary.period ? `/${app.salary.period}` : '',
        ].filter(Boolean).join(' ').trim()
      : ''

    const recruiterInfo = [
      app.recruiter?.name,
      app.recruiter?.email ? `<${app.recruiter.email}>` : null,
    ].filter(Boolean).join(' ')

    const interviewsSummary = Array.isArray(app.interviews) && app.interviews.length > 0
      ? app.interviews
          .map((i) => `${i.stageName || 'Interview'}: ${i.date || ''} ${i.time || ''}`.trim())
          .join('; ')
      : ''

    const tagsStr = Array.isArray(app.tags) ? app.tags.join(', ') : (app.tags || '')

    return {
      'Company': app.company || '',
      'Role': app.role || '',
      'Status': app.status ? (app.status.charAt(0).toUpperCase() + app.status.slice(1)) : '',
      'Date Applied': app.dateApplied || '',
      'Location': app.location || '',
      'Employment Type': app.employmentType || '',
      'Salary': salaryStr,
      'Recruiter': recruiterInfo,
      'Recruiter Email': app.recruiter?.email || '',
      'Recruiter LinkedIn': app.recruiter?.linkedin || '',
      'Tags': tagsStr,
      'Job URL': app.jobUrl || '',
      'Interviews': interviewsSummary,
      'Notes': app.notes || '',
    }
  })

  const worksheet = XLSX.utils.json_to_sheet(rows)

  worksheet['!cols'] = [
    { wch: 22 }, // Company
    { wch: 26 }, // Role
    { wch: 15 }, // Status
    { wch: 14 }, // Date Applied
    { wch: 18 }, // Location
    { wch: 18 }, // Employment Type
    { wch: 22 }, // Salary
    { wch: 24 }, // Recruiter
    { wch: 26 }, // Recruiter Email
    { wch: 30 }, // Recruiter LinkedIn
    { wch: 25 }, // Tags
    { wch: 32 }, // Job URL
    { wch: 35 }, // Interviews
    { wch: 40 }, // Notes
  ]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Job Applications')

  const dateStr = new Date().toISOString().split('T')[0]
  const finalFilename = filename || `job-applications-${dateStr}.xlsx`

  XLSX.writeFile(workbook, finalFilename)
}
