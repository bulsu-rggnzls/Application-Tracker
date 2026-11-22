import { useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchApplications,
  saveApplication,
  deleteApplication,
} from '../api/applicationsApi'
import { seedMockApplications } from '../api/mockSeed'
import { exportToExcel } from '@/utils/dataExport'
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
      exportToExcel(applications)
      showToast(`Exported ${applications.length} application${applications.length === 1 ? '' : 's'} to Excel (.xlsx)`, 'success')
    } catch (err) {
      console.error('Export failed:', err)
      showToast('Export failed', 'error')
    }
  }, [applications, showToast])

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
  }
}
