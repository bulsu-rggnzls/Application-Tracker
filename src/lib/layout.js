/**
 * Shared layout class strings — consolidate repeated container wrappers.
 * Prefer these over ad-hoc max-w / padding chains in page files.
 */

export const layout = {
  /** Dashboard page gutter */
  pageGutter: 'page-gutter overflow-x-hidden',

  /** Board + table content width */
  containerWide: 'container-wide w-full flex flex-col flex-1 min-h-0',

  /** Calendar / timeline / analytics content width */
  containerTight: 'container-wide-tight w-full flex-1 min-h-0 flex flex-col',

  /** App shell: fixed viewport, no scroll */
  appShell:
    'h-screen flex overflow-hidden bg-canvas text-text',

  /** App shell with soft brand gradient */
  appShellGradient:
    'h-screen flex overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/60 to-purple-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900',

  /** Primary column next to sidebar */
  mainColumn: 'flex-1 flex flex-col min-w-0 overflow-hidden max-w-full',

  /** Top bar chrome */
  topBar:
    'flex items-center justify-between w-full px-4 py-3 h-14 bg-surface border-b border-border shrink-0 relative z-40',

  /** Panel / card section header with bottom rule */
  panelHeader:
    'flex items-center justify-between px-4 py-3 border-b border-border-subtle',

  /** Modal content padding */
  modalBody: 'p-5 space-y-3.5',
  modalHeader: 'flex items-center justify-between p-5 border-b border-border-subtle',

  /** Marketing section */
  marketingSection:
    'container-marketing py-16 sm:py-20',

  /** Controls toolbar row */
  toolbarRow: 'flex items-center justify-between w-full gap-2 mb-3',
}

/** Standard interactive transition — apply everywhere hover/focus changes color */
export const transitionUI = 'transition-ui'

/** Focus ring utility for custom interactive elements */
export const focusRing = 'focus-ring'
