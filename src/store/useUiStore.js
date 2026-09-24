import { create } from 'zustand'

export const useUiStore = create((set) => ({
  viewMode: 'board',
  activeView: 'board',
  drawerOpen: false,
  modalOpen: false,
  editingJob: null,
  composeOpen: false,
  logoutModalOpen: false,

  setViewMode: (viewMode) => set({ viewMode }),
  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
  openEdit: (job) => set({ editingJob: job, modalOpen: true }),
  openAdd: () => set({ editingJob: null, modalOpen: true }),
  closeModal: () => set({ modalOpen: false }),
  handleViewChange: (view) =>
    set(() => ({
      activeView: view,
      ...(view === 'board' || view === 'table' ? { viewMode: view } : {}),
    })),
  openComposeEmail: () => set({ composeOpen: true }),
  closeComposeEmail: () => set({ composeOpen: false }),
  openLogoutModal: () => set({ logoutModalOpen: true }),
  closeLogoutModal: () => set({ logoutModalOpen: false }),
}))
