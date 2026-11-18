export function exportToJSON(data, filename) {
  const dateStr = new Date().toISOString().split('T')[0]
  const finalFilename = filename || `job-applications-${dateStr}.json`
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = finalFilename
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 150)
}

export function importFromJSON(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file selected'))
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target.result
        const parsed = JSON.parse(text)
        
        let apps = null
        if (Array.isArray(parsed)) {
          apps = parsed
        } else if (parsed && typeof parsed === 'object') {
          if (Array.isArray(parsed.applications)) {
            apps = parsed.applications
          } else if (Array.isArray(parsed.data)) {
            apps = parsed.data
          }
        }

        if (!Array.isArray(apps)) {
          throw new Error('Invalid file format: Expected an array of job applications')
        }

        resolve(apps)
      } catch (err) {
        reject(new Error(err.message || 'Failed to parse JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
