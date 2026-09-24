'use client';;
import useComposeEmail from '../hooks/useComposeEmail';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Minus,
  Maximize2,
  Mail,
  ChevronDown,
  Smile,
  Paperclip,
  Link2,
  Sparkles,
  MoreHorizontal,
  Bold,
  Italic,
  Calendar,
  Upload,
  Check,
} from 'lucide-react';
import { Send } from 'lucide-react';

const EMOJIS = [
  '😊',
  '👍',
  '🙌',
  '🔥',
  '💡',
  '✅',
  '🚀',
  '💼',
  '📊',
  '🎯',
  '💬',
  '🤝',
  '⭐',
  '📌',
  '🎉',
  '💪',
  '🌟',
  '📈',
  '🔑',
  '⚡',
];

const AI_SUGGESTIONS = [
  "I'd love to schedule a quick call this week to discuss further.",
  'Please let me know if you have any questions — happy to help!',
  'Looking forward to your feedback on this.',
];

const SCHEDULE_OPTIONS = [
  { label: 'Tomorrow 9:00 AM', value: 'tom-9am' },
  { label: 'Tomorrow 2:00 PM', value: 'tom-2pm' },
  { label: 'Monday 10:00 AM', value: 'mon-10am' },
  { label: 'Monday 3:00 PM', value: 'mon-3pm' },
];

export const ComposeEmailCard = ({
  data,
  onSend,
  onClose,
}) => {
  const {
    showToolbar,
    toolbarPos,
    safeX,
    activePopover,
    setActivePopover,
    linkUrl,
    setLinkUrl,
    linkText,
    setLinkText,
    linkInserted,
    scheduledTime,
    attachedFiles,
    isDraggingOver,
    setIsDraggingOver,
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
    handleSchedule,
    handleFakeAttach,
    removeAttachment,
    toggleFromOpen,
    selectFrom,
  } = useComposeEmail(data);

  const springConfig = {
    type: 'spring',
    stiffness: 450,
    damping: 32,
    mass: 1
  };
  const popoverAnim = {
    initial: { opacity: 0, y: 8, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 8, scale: 0.96 },
    transition: { type: "spring", damping: 22, stiffness: 300 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...springConfig, damping: 38 }}
      className="z-10 flex max-h-[95vh] w-full flex-col overflow-hidden rounded-4xl border border-gray-200/60 bg-surface-inset text-text-secondary antialiased shadow-lg sm:max-h-[92vh] sm:rounded-[24px] lg:max-w-145 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
      {/* Header */}
      <div
        className="flex flex-none items-center justify-between bg-surface-inset py-3 pr-3 pl-4 sm:py-4 sm:pr-4 sm:pl-5 dark:bg-zinc-900">
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white sm:h-10 sm:w-10 sm:rounded-xl">
            <Mail size={18} className="sm:w-5.5" strokeWidth={1.5} />
          </div>
          <span
            className="text-[14px] font-semibold tracking-tight text-text sm:text-[15px] dark:text-zinc-100">
            Compose email
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            title="minimize"
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:text-black/70 sm:p-2 dark:hover:text-white/70">
            <Minus size={16} />
          </button>
          <button
            title="Maximize"
            className="hidden rounded-lg p-2 text-gray-400 transition-colors hover:text-black/70 sm:block dark:hover:text-white/70">
            <Maximize2 size={15} />
          </button>
          <button
            title="close"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:text-black/70 sm:p-2 dark:hover:text-white/70">
            <X size={18} />
          </button>
        </div>
      </div>
      {/* Scrollable Body */}
      <div
        className="custom-scrollbar flex-1 overflow-y-auto rounded-[18px] border border-border bg-white sm:rounded-4xl dark:border-zinc-800 dark:bg-zinc-950">
        <div className="space-y-2 px-4 pt-4 pb-2 sm:px-8 sm:pt-6">
          {/* From Section */}
          <div className="flex items-center text-[13px]">
            <span className="w-12 text-gray-400 sm:w-14">From</span>
            <div ref={fromRef} className="relative">
              <button
                onClick={toggleFromOpen}
                className="flex max-w-50 cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-0.5 shadow-sm transition-ui hover:border-gray-300 sm:max-w-none sm:px-2.5 sm:py-1 dark:border-zinc-800 dark:bg-zinc-900">
                <img
                  src={selectedFrom.avatar}
                  alt=""
                  className="h-4 w-4 shrink-0 rounded-full object-cover sm:h-5 sm:w-5" />
                <span className="truncate font-medium text-gray-700 dark:text-zinc-200">
                  {selectedFrom.name}
                </span>
                <ChevronDown
                  size={14}
                  className={`shrink-0 text-gray-400 transition-transform ${fromOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {fromOpen && (
                  <motion.div
                    {...popoverAnim}
                    className="absolute top-full left-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-gray-200 bg-white py-1.5 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
                    <p
                      className="px-4 pt-1.5 pb-1 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                      Switch account
                    </p>
                    {[
                      {
                        id: data.from.id,
                        name: data.from.name,
                        email: data.from.email ?? 'me@example.com',
                        avatar: data.from.avatar,
                      },
                      {
                        id: 'work',
                        name: 'Work',
                        email: 'work@company.com',
                        avatar: data.from.avatar,
                      },
                      {
                        id: 'personal',
                        name: 'Personal',
                        email: 'personal@gmail.com',
                        avatar: data.from.avatar,
                      },
                    ].map((acc) => (
                      <button
                        key={acc.email}
                        onClick={() => selectFrom(acc)}
                        className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800 ${selectedFrom.name === acc.name ? 'text-[var(--brand)]' : 'text-gray-700 dark:text-zinc-300'}`}>
                        <img
                          src={acc.avatar}
                          alt=""
                          className="h-5 w-5 shrink-0 rounded-full object-cover" />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium">
                            {acc.name}
                          </p>
                          <p className="truncate text-[10px] text-gray-400 dark:text-zinc-500">
                            {acc.email}
                          </p>
                        </div>
                        {selectedFrom.name === acc.name && (
                          <Check size={13} className="ml-auto shrink-0" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* To Section */}
          <div
            className="flex items-start border-b border-gray-100 py-2 text-[13px] dark:border-zinc-800">
            <span className="mt-2 w-12 text-gray-400 sm:w-14">To</span>
            <div className="flex flex-1 flex-wrap gap-1.5 sm:gap-2">
              {data.to.map((recipient) => (
                <div
                  key={recipient.id}
                  className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2 py-0.5 shadow-sm sm:gap-2 sm:px-2.5 sm:py-1 dark:border-zinc-800 dark:bg-zinc-900">
                  <img
                    src={recipient.avatar}
                    alt=""
                    className="h-4 w-4 rounded-full object-cover sm:h-5 sm:w-5" />
                  <span className="font-medium text-gray-700 dark:text-zinc-200">
                    {recipient.name}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="mt-2.5 ml-2 flex gap-2 text-[10px] font-medium text-gray-400 sm:ml-4 sm:gap-3 sm:text-[11px]">
              <button className="transition-colors hover:text-[var(--brand)]">
                CC
              </button>
              <button className="transition-colors hover:text-[var(--brand)]">
                BCC
              </button>
            </div>
          </div>

          {/* Subject Section */}
          <div
            className="flex items-center gap-2 border-b border-gray-100 py-2 sm:gap-4 dark:border-zinc-800">
            <span className="w-12 text-[13px] text-gray-400 sm:w-14">
              Subject
            </span>
            <input
              title="subject"
              type="text"
              defaultValue={data.subject}
              className="flex-1 bg-transparent text-[14px] font-medium text-gray-800 outline-none sm:text-[15px] dark:text-zinc-100" />
          </div>
        </div>

        {/* Editor Area */}
        <div className="relative min-h-37.5 px-4 py-2 sm:min-h-50 sm:px-8">
          <AnimatePresence>
            {showToolbar && (
              <motion.div
                ref={toolbarRef}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  left: safeX,
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={springConfig}
                className="absolute z-60 flex origin-bottom scale-90 items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-xl sm:scale-100 dark:border-zinc-800 dark:bg-zinc-900"
                style={{ top: toolbarPos.y }}>
                <button
                  className="flex items-center gap-2 rounded-xl bg-gray-50 px-2 py-1.5 whitespace-nowrap transition-colors hover:bg-gray-100 sm:px-3 dark:bg-zinc-800 dark:hover:bg-zinc-700">
                  <Sparkles size={14} className="text-[var(--brand)]" />
                  <span
                    className="text-[12px] font-semibold text-gray-700 sm:text-[13px] dark:text-zinc-200">
                    Ask AI
                  </span>
                </button>
                <div className="mx-1 h-4 w-px bg-gray-200 dark:bg-zinc-700" />
                <button
                  title="bold"
                  className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 sm:p-2 dark:hover:bg-zinc-800">
                  <Bold size={14} />
                </button>
                <button
                  title="italic"
                  className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 sm:p-2 dark:hover:bg-zinc-800">
                  <Italic size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            ref={bodyRef}
            contentEditable
            onMouseUp={handleSelection}
            onKeyUp={handleSelection}
            className="min-h-37.5 text-[14px] leading-relaxed whitespace-pre-wrap text-gray-700 outline-none sm:text-[15px] dark:text-zinc-300"
            dangerouslySetInnerHTML={{ __html: data.body }} />

          {/* Attachments Section */}
          <div className="mt-6 pb-4 sm:mt-8">
            <h4
              className="mb-3 text-[11px] font-medium tracking-widest text-text-subtle capitalize sm:mb-4 sm:text-[12px]">
              Attachments
            </h4>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {data.attachments.map((file) => (
                <motion.div
                  key={file.id}
                  whileHover={{ y: -2 }}
                  className="group flex cursor-pointer items-center gap-3 rounded-2xl border-[1.5px] border-border-subtle bg-white p-2 transition-ui hover:border-[var(--brand)]/30 sm:rounded-[14px] dark:border-zinc-800 dark:bg-zinc-900">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-[9px] font-bold text-gray-400 transition-colors group-hover:bg-[var(--brand-soft)] group-hover:text-[var(--brand)] sm:h-11 sm:w-11 sm:text-[10px] dark:bg-zinc-800 dark:group-hover:bg-[var(--brand)]/10">
                    {file.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className="truncate text-[13px] font-bold text-gray-800 sm:text-[14px] dark:text-zinc-200">
                      {file.name}
                    </p>
                    <p
                      className="text-[10px] font-normal text-gray-400 uppercase sm:text-[11px]">
                      {file.type} · {file.size}
                    </p>
                  </div>
                </motion.div>
              ))}
              {/* Dynamically added attachments */}
              {attachedFiles.map((fname) => (
                <motion.div
                  key={fname}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2 }}
                  className="group flex cursor-pointer items-center gap-3 rounded-2xl border-[1.5px] border-[var(--brand)]/20 bg-white p-2 transition-ui hover:border-[var(--brand)]/40 sm:rounded-[14px] dark:bg-zinc-900">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand-soft)] text-[9px] font-bold text-[var(--brand)] sm:h-11 sm:w-11 sm:text-[10px] dark:bg-[var(--brand)]/10">
                    {fname.split('.').pop()?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className="truncate text-[13px] font-bold text-gray-800 sm:text-[14px] dark:text-zinc-200">
                      {fname}
                    </p>
                    <p className="text-[10px] font-normal text-[var(--brand)] sm:text-[11px]">
                      Just added
                    </p>
                  </div>
                  <button
                    onClick={() => removeAttachment(fname)}
                    className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800">
                    <X size={12} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div
        className="flex flex-none flex-col justify-between gap-4 border-gray-100 bg-surface-inset px-4 py-3 sm:flex-row sm:items-center sm:px-6 sm:py-4 dark:border-zinc-800 dark:bg-zinc-900">
        {/* Icon Toolbar with popovers */}
        <div
          ref={popoverRef}
          className="relative flex items-center gap-0.5 text-gray-400 sm:gap-1">
          {/* More */}
          <div className="relative">
            <button
              title="more"
              onClick={() => togglePopover('more')}
              className="rounded-lg p-2 transition-ui hover:text-gray-600 dark:hover:text-zinc-200">
              <MoreHorizontal size={18} />
            </button>
            <AnimatePresence>
              {activePopover === 'more' && (
                <motion.div
                  {...popoverAnim}
                  className="absolute bottom-full left-0 z-50 mb-2 w-48 overflow-hidden rounded-2xl border border-gray-200 bg-white py-1.5 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
                  {[
                    { label: 'Discard draft', danger: true },
                    { label: 'Print', danger: false },
                    { label: 'Save as template', danger: false },
                    { label: 'Spell check', danger: false },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setActivePopover(null)}
                      className={`w-full px-4 py-2 text-left text-[13px] transition-colors ${
                        opt.danger
                          ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
                          : 'text-gray-700 hover:bg-gray-50 dark:text-zinc-300 dark:hover:bg-zinc-800'
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Emoji */}
          <div className="relative">
            <button
              title="emoji"
              onClick={() => togglePopover('emoji')}
              className="rounded-lg p-2 transition-ui hover:text-gray-600 dark:hover:text-zinc-200">
              <Smile size={18} />
            </button>
            <AnimatePresence>
              {activePopover === 'emoji' && (
                <motion.div
                  {...popoverAnim}
                  className="absolute bottom-full left-0 z-50 mb-2 w-52 rounded-2xl border border-gray-200 bg-white p-3 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
                  <p
                    className="mb-2 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                    Emoji
                  </p>
                  <div className="grid grid-cols-5 gap-1">
                    {EMOJIS.map((e) => (
                      <button
                        key={e}
                        onClick={() => insertEmoji(e)}
                        className="rounded-lg p-1 text-xl transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800">
                        {e}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Attach */}
          <div className="relative">
            <button
              title="attach"
              onClick={() => togglePopover('attach')}
              className="rounded-lg p-2 transition-ui hover:text-gray-600 dark:hover:text-zinc-200">
              <Paperclip size={18} />
            </button>
            <AnimatePresence>
              {activePopover === 'attach' && (
                <motion.div
                  {...popoverAnim}
                  className="absolute bottom-full left-0 z-50 mb-2 w-52 -translate-x-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl sm:w-56 sm:translate-x-0 dark:border-zinc-700 dark:bg-zinc-900">
                  <p
                    className="mb-3 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                    Attach File
                  </p>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingOver(true);
                    }}
                    onDragLeave={() => setIsDraggingOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingOver(false);
                      handleFakeAttach();
                    }}
                    onClick={handleFakeAttach}
                    className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-4 transition-ui ${isDraggingOver ? 'border-[var(--brand)] bg-[var(--brand-soft)] dark:bg-[var(--brand)]/10' : 'border-gray-200 hover:border-[var(--brand)]/50 hover:bg-gray-50 dark:border-zinc-700 dark:hover:bg-zinc-800'}`}>
                    <Upload size={20} className="text-gray-400" />
                    <p className="text-center text-[12px] text-gray-500 dark:text-zinc-400">
                      Click or drag files here
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Link */}
          <div className="relative">
            <button
              title="link"
              onClick={() => togglePopover('link')}
              className="rounded-lg p-2 transition-ui hover:text-gray-600 dark:hover:text-zinc-200">
              <Link2 size={18} />
            </button>
            <AnimatePresence>
              {activePopover === 'link' && (
                <motion.div
                  {...popoverAnim}
                  className="absolute bottom-full left-0 z-50 mb-2 w-56 -translate-x-16 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl sm:w-64 sm:translate-x-0 dark:border-zinc-700 dark:bg-zinc-900">
                  <p
                    className="mb-3 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                    Insert Link
                  </p>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="URL (e.g. https://...)"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] text-gray-800 transition-colors outline-none focus:border-[var(--brand)] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200" />
                    <input
                      type="text"
                      placeholder="Display text (optional)"
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] text-gray-800 transition-colors outline-none focus:border-[var(--brand)] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200" />
                    <button
                      onClick={insertLink}
                      disabled={!linkUrl}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand)] py-2 text-[13px] font-medium text-white transition-colors hover:bg-[var(--brand-stronger)] disabled:cursor-not-allowed disabled:opacity-40">
                      {linkInserted ? (
                        <>
                          <Check size={14} /> Inserted!
                        </>
                      ) : (
                        'Insert Link'
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Suggestions */}
          <div className="relative">
            <button
              title="ai"
              onClick={() => togglePopover('ai')}
              className="rounded-lg p-2 transition-ui hover:text-[var(--brand)]">
              <Sparkles size={18} />
            </button>
            <AnimatePresence>
              {activePopover === 'ai' && (
                <motion.div
                  {...popoverAnim}
                  className="absolute bottom-full left-0 z-50 mb-2 w-56 -translate-x-24 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl sm:w-72 sm:translate-x-0 dark:border-zinc-700 dark:bg-zinc-900">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles size={14} className="text-[var(--brand)]" />
                    <p
                      className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                      AI Suggestions
                    </p>
                  </div>
                  <div className="space-y-2">
                    {AI_SUGGESTIONS.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => insertAISuggestion(s)}
                        className="w-full rounded-xl bg-gray-50 px-3 py-2.5 text-left text-[13px] leading-relaxed text-gray-700 transition-colors hover:bg-[var(--brand-soft)] hover:text-[var(--brand)] dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-[var(--brand)]/10">
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mx-2 hidden h-5 w-px bg-gray-200 sm:block dark:bg-zinc-800" />
        </div>

        {/* Action Buttons */}
        <div
          className="flex min-w-0 items-center justify-between gap-2 border-t border-gray-200 pt-3 sm:justify-end sm:gap-3 sm:border-t-0 sm:pt-0 dark:border-zinc-800">
          <span
            className="max-w-[140px] min-w-0 truncate text-[11px] font-medium text-text-subtle sm:max-w-[180px]">
            {scheduledTime ? `📅 ${scheduledTime}` : 'Draft saved'}
          </span>
          <div className="flex flex-shrink-0 items-center gap-2">
            {/* Schedule */}
            <div className="relative">
              <button
                onClick={() => togglePopover('schedule')}
                className={`flex items-center justify-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[13px] font-normal transition-ui ${scheduledTime ? 'border-[var(--brand)]/40 bg-[var(--brand-soft)] text-[var(--brand)] dark:bg-[var(--brand)]/10' : 'border-gray-200 text-text-muted hover:bg-gray-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800'}`}>
                <Calendar size={15} strokeWidth={2.5} />
                {!scheduledTime && (
                  <span className="hidden sm:inline">Schedule</span>
                )}
              </button>
              <AnimatePresence>
                {activePopover === 'schedule' && (
                  <motion.div
                    {...popoverAnim}
                    className="absolute right-0 bottom-full z-50 mb-2 w-56 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
                    <p
                      className="mb-3 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                      Schedule Send
                    </p>
                    <div className="space-y-1.5">
                      {SCHEDULE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleSchedule(opt.label)}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13px] transition-colors ${scheduledTime === opt.label ? 'bg-[var(--brand-soft)] text-[var(--brand)] dark:bg-[var(--brand)]/10' : 'text-gray-700 hover:bg-gray-50 dark:text-zinc-300 dark:hover:bg-zinc-800'}`}>
                          {opt.label}
                          {scheduledTime === opt.label && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSend?.(data)}
              className="flex items-center gap-1.5 rounded-full bg-[var(--text)] px-4 py-1.5 text-[13px] font-medium whitespace-nowrap text-white shadow-md transition-ui hover:opacity-90 sm:px-5 sm:py-2 sm:text-[14px] dark:bg-white dark:text-black">
              <Send size={14} /> {scheduledTime ? 'Confirm' : 'Send'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ComposeEmailCard;