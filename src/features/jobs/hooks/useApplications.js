import { useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchApplications,
  saveApplication,
  deleteApplication,
  importApplications,
} from '../api/applicationsApi'
import { seedMockApplications } from '../api/mockSeed'
import { exportToJSON, importFromJSON } from '@/utils/dataExport'
import { useUiStore } from '@/store/useUiStore'

export default function useApplications(userId) {
  const queryClient = useQueryClient()
  const showToast = useUiStore((s) => s.showToast)

  const { data: applications = [], isLoading: dataLoading, error, refetch } = useQuery({
    queryKey: ['applications', userId],
    queryFn: fetchApplications,
    enabled: !!userId,
  })

  const fetchError = error ? (error.message || 'Could not load your applications.') : null

  const setApplications = useCallback((updater) => {
    queryClient.setQueryData(['applications', userId], (old = []) =>
      typeof updater === 'function' ? updater(old) : updater
    )
  }, [queryClient, userId])

  const retry = useCallback(() => refetch(), [refetch])

  const persist = useCallback((app) => {
    saveApplication(app, userId).catch(err => console.error('Save failed:', err))
  }, [userId])

  const loadDemoData = useCallback(async () => {
    try {
      await seedMockApplications()
      const fresh = await fetchApplications()
      queryClient.setQueryData(['applications', userId], fresh)
      showToast('Demo data loaded successfully!', 'success')
    } catch (err) {
      console.error('Demo data load failed:', err)
      showToast('Failed to load demo data', 'error')
    }
  }, [queryClient, userId, showToast])

  const deleteJob = useCallback((id) => {
    queryClient.setQueryData(['applications', userId], (old = []) => old.filter(a => a.id !== id))
    deleteApplication(id).catch(err => console.error('Delete failed:', err))
  }, [queryClient, userId])

  const exportData = useCallback(() => {
    try {
      if (applications.length === 0) {
        showToast('No applications to export', 'info')
        return
      }
      exportToJSON(applications)
      showToast(`Exported ${applications.length} application${applications.length === 1 ? '' : 's'} to JSON`, 'success')
    } catch (err) {
      console.error('Export failed:', err)
      showToast('Export failed', 'error')
    }
  }, [applications, showToast])

  const importData = useCallback(async (file) => {
    if (!file) return
    try {
      const data = await importFromJSON(file)
      if (!Array.isArray(data) || data.length === 0) {
        showToast('JSON file contains no applications to import', 'info')
        return
      }
      const count = await importApplications(data, userId)
      await queryClient.invalidateQueries({ queryKey: ['applications', userId] })
      showToast(`Successfully imported ${count} application${count === 1 ? '' : 's'}!`, 'success')
    } catch (err) {
      console.error('Import failed:', err)
      showToast(`Import failed: ${err.message || 'Invalid format'}`, 'error')
    }
  }, [queryClient, userId, showToast])

  return {
    applications,
    setApplications,
    dataLoading,
    fetchError,
    retry,
    persist,
    loadDemoData,
    deleteJob,
    exportData,
    importData,
  }
}
