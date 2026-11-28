import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Mail,
  ChevronDown,
  Smile,
  Paperclip,
  Link2,
  Sparkles,
  Bold,
  Italic,
  Upload,
  Check,
  Send,
  Copy,
  Building2,
  BookOpen,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { Button, IconButton, Heading, Text, Input, Badge, GoogleIcon } from '@/components/ui'
import { cn } from '@/lib/utils'
import { sendEmailDirect } from '../api/emailApi'
import useComposeEmail, {
  EMAIL_TEMPLATES,
  buildGmailUrl,
  buildMailtoUrl,
} from '../hooks/useComposeEmail'

const EMOJIS = [
  '😊', '👍', '🙌', '🔥', '💡', '✅', '🚀', '💼',
  '📊', '🎯', '💬', '🤝', '⭐', '📌', '🎉', '💪',
  '🌟', '📈', '🔑', '⚡',
]

const AI_SUGGESTIONS = [
  "I would welcome the opportunity to discuss how my skill set aligns with your team's goals.",
  'Please let me know if you need any additional portfolio samples or references.',
  'Looking forward to your thoughts and next steps!',
]

export function ComposeEmailCard({
  data = {},
  user,
  applications = [],
  onSend,
  onClose,
}) {
  const fileInputRef = useRef(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [copied, setCopied] = useState(false)
  const [sending, setSending] = useState(false)

  const {
    toEmail,
    setToEmail,
    subject,
    setSubject,
    syncBodyText,
    selectedAppId,
    handleSelectApplication,
    validationError,
    setValidationError,
    validate,
    showToolbar,
    toolbarPos,
    safeX,
    activePopover,
    linkUrl,
    setLinkUrl,
    linkText,
    setLinkText,
    linkInserted,
    attachedFiles,
    fromOpen,
    selectedFrom,
    bodyRef,
    toolbarRef,
    popoverRef,
    fromRef,
    handleSelection,
    togglePopover,
    insertEmoji,
    insertLink,
    insertAISuggestion,
    applyTemplate,
    addFiles,
    removeAttachment,
    toggleFromOpen,
    selectFrom,
    getFullPayload,
  } = useComposeEmail({ data, user, applications })

  const handleCopyDraft = async () => {
    const payload = getFullPayload()
    let textToCopy = `To: ${payload.to}\nSubject: ${payload.subject}\n\n${payload.body}`
    if (payload.attachments?.length > 0) {
      const filesText = payload.attachments.map(a => `- ${a.name} (${a.size})`).join('\n')
      textToCopy += `\n\nAttachments:\n${filesText}`
    }

    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error('Failed to copy draft', e)
    }
  }

  const handleSendDirect = async () => {
    if (!validate() || sending) return
    const payload = getFullPayload()
    setSending(true)
    setValidationError('')
    try {
      await sendEmailDirect(payload)
      onSend?.({ ...payload, client: 'direct' })
    } catch (err) {
      console.error('Direct email send failed:', err)
      setValidationError(err.message || 'Failed to send email. Ensure the send-email Edge Function is deployed.')
    } finally {
      setSending(false)
    }
  }

  const handleSendGmail = () => {
    if (!validate()) return
    const payload = getFullPayload()
    const gmailUrl = buildGmailUrl(payload)
    window.open(gmailUrl, '_blank', 'noopener,noreferrer')
    onSend?.({ ...payload, client: 'gmail' })
  }

  const handleSendMailto = () => {
    if (!validate()) return
    const payload = getFullPayload()
    const mailtoUrl = buildMailtoUrl(payload)

    const link = document.createElement('a')
    link.href = mailtoUrl
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      document.body.removeChild(link)
    }, 150)

    onSend?.({ ...payload, client: 'mailto' })
  }

  const popoverAnim = {
    initial: { opacity: 0, y: 8, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 8, scale: 0.96 },
    transition: { type: 'spring', damping: 22, stiffness: 300 },
  }

  const appsWithRecruiters = applications.filter((a) => a.recruiter?.email)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.98 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface text-text shadow-2xl sm:max-w-2xl"
    >
      {/* Hidden real file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) {
            addFiles(e.target.files)
          }
          e.target.value = ''
        }}
      />

      {/* Header */}
      <div className="flex flex-none items-center justify-between border-b border-border-subtle px-5 py-3.5 bg-surface-muted/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm shadow-indigo-500/25">
            <Mail size={16} />
          </div>
          <div>
            <Heading size="sm">Compose Email</Heading>
            <Text variant="subtle-sm" className="mt-0.5">
              Draft outreach, interview follow-ups, or thank-you notes
            </Text>
          </div>
        </div>
        <IconButton
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="hover:bg-surface-muted"
        >
          <X size={16} />
        </IconButton>
      </div>

      {/* Main Fields Form */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3.5 scrollbar-thin">
        {/* Linked Application Selector (optional context) */}
        {applications.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs">
            <Building2 size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
            <Text variant="subtle" className="font-semibold shrink-0 !text-indigo-900 dark:!text-indigo-200">
              Application:
            </Text>
            <select
              value={selectedAppId}
              onChange={(e) => handleSelectApplication(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none font-medium text-indigo-700 dark:text-indigo-300 cursor-pointer truncate text-xs"
            >
              <option value="" className="text-text bg-surface">
                General email (No specific application linked)
              </option>
              {applications.map((app) => (
                <option key={app.id} value={app.id} className="text-text bg-surface">
                  {app.company} — {app.role} {app.recruiter?.name ? `(${app.recruiter.name})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* From Section */}
        <div className="flex items-center text-xs">
          <span className="w-16 font-medium text-text-subtle">From</span>
          <div ref={fromRef} className="relative">
            <Button
              type="button"
              variant="secondary"
              onClick={toggleFromOpen}
              className="!px-2.5 !py-1 !text-xs !gap-2 !rounded-lg"
            >
              <img
                src={selectedFrom.avatar}
                alt=""
                className="h-4 w-4 shrink-0 rounded-full object-cover"
              />
              <span className="truncate font-semibold text-text">{selectedFrom.name}</span>
              <span className="text-[11px] text-text-subtle truncate hidden sm:inline">
                &lt;{selectedFrom.email}&gt;
              </span>
              <ChevronDown
                size={13}
                className={`text-text-subtle transition-transform ${fromOpen ? 'rotate-180' : ''}`}
              />
            </Button>
            <AnimatePresence>
              {fromOpen && (
                <motion.div
                  {...popoverAnim}
                  className="absolute top-full left-0 z-50 mt-1.5 w-60 overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-xl"
                >
                  <Text variant="muted-sm" className="px-3 py-1 font-semibold uppercase tracking-wider">
                    Sender Profile
                  </Text>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => selectFrom(selectedFrom)}
                    className="w-full !justify-start !gap-2.5 !px-3 !py-2 !rounded-none !text-left"
                  >
                    <img src={selectedFrom.avatar} alt="" className="h-5 w-5 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-text truncate">{selectedFrom.name}</p>
                      <p className="text-[11px] text-text-subtle truncate">{selectedFrom.email}</p>
                    </div>
                    <Check size={14} className="ml-auto text-brand shrink-0" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* To Section */}
        <div className="flex flex-col gap-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-16 font-medium text-text-subtle">To</span>
            <Input
              type="email"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              placeholder="recruiter@company.com"
              containerClassName="flex-1 w-full"
              className="!py-1.5 !text-xs"
            />
          </div>

          {/* Quick recruiter suggestions if available */}
          {appsWithRecruiters.length > 0 && !toEmail && (
            <div className="flex items-center gap-1.5 pl-16 flex-wrap">
              <Text variant="muted-sm">Quick pick:</Text>
              {appsWithRecruiters.slice(0, 3).map((app) => (
                <Button
                  key={app.id}
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setToEmail(app.recruiter.email)
                    handleSelectApplication(app.id)
                  }}
                  className="!px-2 !py-0.5 !text-[11px] !rounded-full !bg-surface-muted hover:!bg-indigo-50 dark:hover:!bg-indigo-950/40 hover:!text-brand !h-auto"
                >
                  <span>{app.recruiter.name}</span>
                  <span className="text-[10px] text-text-subtle">({app.company})</span>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Subject Section */}
        <div className="flex items-center gap-2 text-xs">
          <span className="w-16 font-medium text-text-subtle">Subject</span>
          <Input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Application Follow-Up: Senior Frontend Engineer"
            containerClassName="flex-1 w-full"
            className="!py-1.5 !text-xs"
          />
        </div>

        {/* Quick Email Templates Bar */}
        <div className="flex items-center gap-2 pt-1 border-t border-border-subtle">
          <span className="text-[11px] font-semibold text-text-muted flex items-center gap-1 shrink-0">
            <BookOpen size={12} className="text-brand" /> Templates:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin py-1 flex-1">
            {EMAIL_TEMPLATES.map((tmpl) => (
              <Button
                key={tmpl.id}
                type="button"
                variant="ghost"
                onClick={() => applyTemplate(tmpl)}
                className="whitespace-nowrap !px-2.5 !py-1 !rounded-lg !text-[11px] !font-medium !bg-surface-muted hover:!bg-indigo-50 dark:hover:!bg-indigo-950/40 hover:!text-brand border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                title={tmpl.description}
              >
                {tmpl.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Validation Warning Alert */}
        {validationError && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-xs animate-in fade-in-0 duration-150">
            <AlertCircle size={14} className="shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Editor Area */}
        <div className="relative min-h-[160px] rounded-xl border border-border p-3 bg-surface-muted/40 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand-ring transition-all">
          <AnimatePresence>
            {showToolbar && (
              <motion.div
                ref={toolbarRef}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1, left: safeX }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute z-50 flex items-center gap-1 rounded-xl border border-border bg-surface p-1 shadow-xl"
                style={{ top: toolbarPos.y }}
              >
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    insertAISuggestion('I would welcome the opportunity to discuss my qualifications further.')
                  }
                  className="!px-2 !py-1 !text-xs !font-semibold !text-brand hover:!bg-indigo-50 dark:hover:!bg-indigo-950/40"
                >
                  <Sparkles size={13} />
                  <span>Ask AI</span>
                </Button>
                <div className="mx-1 h-3.5 w-px bg-border" />
                <IconButton
                  type="button"
                  title="Bold"
                  onClick={() => document.execCommand('bold', false, null)}
                  className="!p-1.5"
                >
                  <Bold size={13} />
                </IconButton>
                <IconButton
                  type="button"
                  title="Italic"
                  onClick={() => document.execCommand('italic', false, null)}
                  className="!p-1.5"
                >
                  <Italic size={13} />
                </IconButton>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            ref={bodyRef}
            contentEditable
            onMouseUp={handleSelection}
            onKeyUp={() => {
              handleSelection()
              syncBodyText()
            }}
            onInput={syncBodyText}
            className="min-h-[140px] text-xs sm:text-sm leading-relaxed text-text outline-none whitespace-pre-wrap"
          />

          {/* Attachments Section with Real Files */}
          {attachedFiles.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border-subtle flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                {attachedFiles.map((file) => (
                  <Badge
                    key={file.id || file.name}
                    variant="meta"
                    className="!px-2.5 !py-1 !rounded-lg !bg-surface !border !border-border shadow-xs !text-xs !gap-1.5"
                  >
                    <Paperclip size={12} className="text-brand shrink-0" />
                    <span className="font-medium text-text max-w-[160px] truncate">{file.name}</span>
                    {file.size && <span className="text-[10px] text-text-subtle">({file.size})</span>}
                    <IconButton
                      type="button"
                      onClick={() => removeAttachment(file.id || file.name)}
                      className="!p-0.5 text-text-subtle hover:text-rose-500 ml-1 hover:!bg-transparent"
                      title="Remove attachment"
                    >
                      <X size={12} />
                    </IconButton>
                  </Badge>
                ))}
              </div>
              <Text variant="muted-sm" className="!text-[11px] text-text-muted flex items-center gap-1.5">
                <AlertCircle size={12} className="text-indigo-500 shrink-0" />
                <span>Files are attached directly when clicking Send. (If opening Gmail/Mail App tabs, attach manually via 📎.)</span>
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* Footer Controls & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border-subtle bg-surface-muted/60 px-5 py-3.5">
        {/* Toolbar Popovers */}
        <div
          ref={popoverRef}
          className="relative flex items-center gap-1 self-start sm:self-auto text-text-subtle"
        >
          {/* Emoji */}
          <div className="relative">
            <IconButton
              type="button"
              title="Add Emoji"
              onClick={() => togglePopover('emoji')}
              className="!p-1.5 hover:bg-surface-muted"
            >
              <Smile size={16} />
            </IconButton>
            <AnimatePresence>
              {activePopover === 'emoji' && (
                <motion.div
                  {...popoverAnim}
                  className="absolute bottom-full left-0 z-50 mb-2 w-52 rounded-xl border border-border bg-surface p-2.5 shadow-2xl"
                >
                  <Text variant="muted-sm" className="mb-1.5 font-semibold uppercase tracking-wider">
                    Emojis
                  </Text>
                  <div className="grid grid-cols-5 gap-1">
                    {EMOJIS.map((e) => (
                      <Button
                        key={e}
                        type="button"
                        variant="ghost"
                        onClick={() => insertEmoji(e)}
                        className="!p-1 !h-auto text-base hover:bg-surface-muted"
                      >
                        {e}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Attach Real File Dropzone */}
          <div className="relative">
            <IconButton
              type="button"
              title="Attach File"
              onClick={() => togglePopover('attach')}
              className={cn(
                "!p-1.5 hover:bg-surface-muted",
                attachedFiles.length > 0 && "!text-brand"
              )}
            >
              <Paperclip size={16} />
            </IconButton>
            <AnimatePresence>
              {activePopover === 'attach' && (
                <motion.div
                  {...popoverAnim}
                  className="absolute bottom-full left-0 z-50 mb-2 w-64 rounded-xl border border-border bg-surface p-3.5 shadow-2xl"
                >
                  <Text variant="muted-sm" className="mb-2.5 font-semibold uppercase tracking-wider">
                    Attach Documents
                  </Text>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDraggingOver(true)
                    }}
                    onDragLeave={() => setIsDraggingOver(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setIsDraggingOver(false)
                      if (e.dataTransfer.files?.length) {
                        addFiles(e.dataTransfer.files)
                      }
                    }}
                    className={cn(
                      "w-full flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl border-2 border-dashed transition-ui cursor-pointer text-xs text-center",
                      isDraggingOver
                        ? "border-brand bg-indigo-50/70 dark:bg-indigo-950/40 text-brand"
                        : "border-border hover:border-brand hover:bg-surface-muted text-text-muted"
                    )}
                  >
                    <Upload size={18} className="text-brand shrink-0" />
                    <span className="font-semibold text-text">Choose file or drag & drop</span>
                    <span className="text-[10px] text-text-subtle">Resume, PDF, DOCX, or images</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Insert Link */}
          <div className="relative">
            <IconButton
              type="button"
              title="Insert Link"
              onClick={() => togglePopover('link')}
              className="!p-1.5 hover:bg-surface-muted"
            >
              <Link2 size={16} />
            </IconButton>
            <AnimatePresence>
              {activePopover === 'link' && (
                <motion.div
                  {...popoverAnim}
                  className="absolute bottom-full left-0 z-50 mb-2 w-60 rounded-xl border border-border bg-surface p-3 shadow-2xl space-y-2"
                >
                  <Text variant="muted-sm" className="font-semibold uppercase tracking-wider">
                    Insert Link
                  </Text>
                  <Input
                    type="text"
                    placeholder="URL (https://...)"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    containerClassName="w-full"
                    className="!py-1.5 !text-xs"
                  />
                  <Input
                    type="text"
                    placeholder="Text to display"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    containerClassName="w-full"
                    className="!py-1.5 !text-xs"
                  />
                  <Button
                    type="button"
                    variant="indigo"
                    onClick={insertLink}
                    disabled={!linkUrl}
                    className="w-full !py-1.5 !text-xs !rounded-lg justify-center"
                  >
                    {linkInserted ? 'Inserted!' : 'Insert Link'}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Suggestions */}
          <div className="relative">
            <IconButton
              type="button"
              title="AI Assist"
              onClick={() => togglePopover('ai')}
              className="!p-1.5 hover:bg-surface-muted text-brand"
            >
              <Sparkles size={16} />
            </IconButton>
            <AnimatePresence>
              {activePopover === 'ai' && (
                <motion.div
                  {...popoverAnim}
                  className="absolute bottom-full left-0 z-50 mb-2 w-72 rounded-xl border border-border bg-surface p-3 shadow-2xl space-y-1.5"
                >
                  <div className="flex items-center gap-1.5 mb-2 text-brand">
                    <Sparkles size={14} />
                    <Text variant="muted-sm" className="font-semibold uppercase tracking-wider !text-brand">
                      AI Suggestions
                    </Text>
                  </div>
                  {AI_SUGGESTIONS.map((s, i) => (
                    <Button
                      key={i}
                      type="button"
                      variant="ghost"
                      onClick={() => insertAISuggestion(s)}
                      className="w-full !justify-start !p-2 !rounded-lg !text-xs !text-left text-text hover:!bg-indigo-50 dark:hover:!bg-indigo-950/40 hover:!text-brand"
                    >
                      {s}
                    </Button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Buttons: Copy Draft + Mail App + Gmail + Direct Send */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCopyDraft}
            disabled={sending}
            className="!px-3 !py-1.5 !text-xs !rounded-xl !gap-1.5"
            title="Copy draft and attachment names to clipboard"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={handleSendMailto}
            disabled={sending}
            className="!px-3 !py-1.5 !text-xs !rounded-xl !gap-1.5 hover:!border-border-strong"
            title="Open in your default desktop mail app"
          >
            <Mail size={13} />
            <span>Mail App</span>
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={handleSendGmail}
            disabled={sending}
            className="!px-3 !py-1.5 !text-xs !rounded-xl !gap-1.5 hover:!border-border-strong"
            title="Open draft in Gmail web in a new tab"
          >
            <GoogleIcon className="w-3.5 h-3.5" />
            <span>Gmail</span>
          </Button>

          <Button
            type="button"
            variant="gradient"
            onClick={handleSendDirect}
            disabled={sending}
            className="!px-4 !py-1.5 !text-xs !rounded-xl !gap-1.5"
            title="Send email and attachments directly from the app"
          >
            {sending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            <span>{sending ? 'Sending...' : 'Send'}</span>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default ComposeEmailCard
