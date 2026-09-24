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

export default function useApplications(userId) {
  const queryClient = useQueryClient()

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
    saveApplication(app).catch(err => console.error('Save failed:', err))
  }, [])

  const loadDemoData = useCallback(async () => {
    try {
      await seedMockApplications()
      const fresh = await fetchApplications()
      queryClient.setQueryData(['applications', userId], fresh)
    } catch (err) {
      console.error('Demo data load failed:', err)
    }
  }, [queryClient, userId])

  const deleteJob = useCallback((id) => {
    queryClient.setQueryData(['applications', userId], (old = []) => old.filter(a => a.id !== id))
    deleteApplication(id).catch(err => console.error('Delete failed:', err))
  }, [queryClient, userId])

  const exportData = useCallback(() => {
    exportToJSON(applications)
  }, [applications])

  const importData = useCallback(async (file) => {
    if (!file) return
    try {
      const data = await importFromJSON(file)
      await importApplications(data)
      queryClient.setQueryData(['applications', userId], data)
    } catch (err) {
      console.error('Import failed:', err)
    }
  }, [queryClient, userId])

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
