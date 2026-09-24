import { useState, useEffect } from 'react'

const EMPTY = { date: '', time: '', platform: '', interviewer: '', notes: '' }

export default function useInterviewForm({ isOpen, job, onConfirm }) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (isOpen) setForm(EMPTY)
  }, [isOpen, job?.id])

  const update = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.date || !form.time) return
    onConfirm(job.id, form)
  }

  return { form, update, handleSubmit }
}
