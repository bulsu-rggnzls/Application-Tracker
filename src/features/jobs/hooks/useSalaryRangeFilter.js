import { useState } from 'react'

export default function useSalaryRangeFilter({ minSalary, maxSalary, sortHigh, onChange }) {
  const [localMin, setLocalMin] = useState(minSalary || '')
  const [localMax, setLocalMax] = useState(maxSalary || '')
  const hasSelection = minSalary || maxSalary || sortHigh

  function applyPreset(value) {
    if (!value) {
      onChange({ min: '', max: '', sortHigh: false })
      setLocalMin('')
      setLocalMax('')
    } else if (value === '200+') {
      onChange({ min: '200', max: '', sortHigh: false })
      setLocalMin('200')
      setLocalMax('')
    } else {
      const [lo, hi] = value.split('-')
      onChange({ min: lo, max: hi, sortHigh: false })
      setLocalMin(lo)
      setLocalMax(hi)
    }
  }

  function applyCustom() {
    onChange({ min: localMin, max: localMax, sortHigh })
  }

  return { localMin, setLocalMin, localMax, setLocalMax, hasSelection, applyPreset, applyCustom }
}
