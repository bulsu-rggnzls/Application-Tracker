import { supabase } from '@/lib/supabase'

const MAX_TOTAL_ATTACHMENT_BYTES = 20 * 1024 * 1024 // 20 MB

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result || '')
      const base64 = result.includes(',') ? result.split(',')[1] : result
      resolve(base64)
    }
    reader.onerror = () => reject(new Error(`Failed to read attachment: ${file.name}`))
    reader.readAsDataURL(file)
  })
}

export async function sendEmailDirect({ to, subject, body, from, attachments = [] }) {
  const totalBytes = attachments.reduce((sum, item) => sum + (item.rawSize || item.file?.size || 0), 0)
  if (totalBytes > MAX_TOTAL_ATTACHMENT_BYTES) {
    throw new Error('Total attachment size exceeds the 20 MB limit.')
  }

  const encodedAttachments = await Promise.all(
    attachments
      .filter((item) => item.file)
      .map(async (item) => ({
        filename: item.name,
        content: await fileToBase64(item.file),
      }))
  )

  const { data, error } = await supabase.functions.invoke('send-email', {
    body: {
      to,
      subject,
      body,
      replyTo: from?.email,
      senderName: from?.name,
      attachments: encodedAttachments,
    },
  })

  if (error) {
    let detailedMessage = error.message || 'Failed to send email'
    if (error.context && typeof error.context.json === 'function') {
      try {
        const errBody = await error.context.json()
        if (errBody?.error) detailedMessage = errBody.error
      } catch {
        // Ignore JSON parse fallback
      }
    }
    throw new Error(detailedMessage)
  }

  if (data?.error) {
    throw new Error(data.error)
  }

  return data
}
