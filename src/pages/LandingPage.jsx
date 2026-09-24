import { motion, useReducedMotion } from 'framer-motion'
import {
  Briefcase, Columns3, LayoutGrid, Table2, CalendarDays, GitBranch,
  BarChart3, CalendarClock, TrendingUp, ShieldCheck, KeyRound, Database,
  Download, ArrowRight,
} from 'lucide-react'
import { Button, Heading, Text } from '@/components/ui'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.08 },
  }),
}

const STAGES = [
  { label: 'Wishlist', dot: 'bg-amber-400' },
  { label: 'Applied', dot: 'bg-blue-500' },
  { label: 'Interviewing', dot: 'bg-purple-500' },
  { label: 'Offer', dot: 'bg-emerald-500' },
]

function Eyebrow({ children }) {
  return (
    <div className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-indigo-600">
      {children}
    </div>
  )
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25 flex items-center justify-center">
        <Briefcase size={18} />
      </div>
      <span className="text-lg font-bold tracking-tight text-slate-900">AppTracker</span>
    </div>
  )
}

function Header({ onLogin, onSignUp }) {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/70">
      <div className="w-full px-6 md:px-12 h-16 flex items-center justify-between gap-4">
        <Logo />
        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            type="button"
            onClick={onLogin}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-700 shadow-sm !transition-ui hover:border-slate-300 hover:!bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Log In
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={onSignUp}
            className="gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 px-5 py-2.5 font-semibold text-white shadow-md shadow-indigo-500/25 !transition-ui hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-white"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  )
}

function PipelineRail() {
  const reduce = useReducedMotion()
  const journey = reduce
    ? { duration: 0 }
    : { duration: 7, times: [0, 0.14, 0.28, 0.42, 0.62, 0.66, 0.9, 1], ease: 'easeInOut', repeat: Infinity, delay: 1.2 }
  return (
    <div className="mt-12 w-full max-w-xl mx-auto">
      <div className="relative">
        <div aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-[5px] h-px bg-[linear-gradient(90deg,#F59E0B,#3B82F6,#A855F7,#10B981)] opacity-60" />
        <div className="relative flex">
          {STAGES.map((s, i) => (
            <div key={s.label} className="flex-1 flex flex-col items-center gap-2">
              <motion.span
                className={`w-2.5 h-2.5 rounded-full ${s.dot} ring-4 ring-white shadow-sm`}
                animate={reduce ? {} : { scale: [1, 1.4, 1] }}
                transition={reduce ? {} : {
                  duration: 0.55,
                  times: [0, 0.45, 1],
                  repeat: Infinity,
                  repeatDelay: 6.45,
                  delay: 1.2 + i * 0.98,
                  ease: 'easeInOut',
                }}
              />
              <span className="font-mono text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.08em] sm:tracking-[0.16em] text-slate-700 whitespace-nowrap">
                {s.label}
              </span>
            </div>
          ))}
        </div>
        <motion.div
          aria-hidden="true"
          initial={reduce ? { left: '87.5%', opacity: 1 } : { left: '12.5%', opacity: 1 }}
          animate={reduce ? { left: '87.5%', opacity: 1 } : {
            left: ['12.5%', '37.5%', '62.5%', '87.5%', '87.5%', '87.5%', '12.5%', '12.5%'],
            opacity: [1, 1, 1, 1, 1, 0, 0, 1],
          }}
          transition={journey}
          className="absolute -top-8 -translate-x-1/2 flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 shadow-lg shadow-slate-900/10 px-2.5 py-1.5 text-[11px] text-slate-600 whitespace-nowrap"
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            initial={reduce ? { backgroundColor: '#10B981' } : { backgroundColor: '#F59E0B' }}
            animate={reduce ? { backgroundColor: '#10B981' } : {
              backgroundColor: ['#F59E0B', '#3B82F6', '#A855F7', '#10B981', '#10B981', '#10B981', '#F59E0B', '#F59E0B'],
            }}
            transition={journey}
          />
          <span><span className="font-semibold text-slate-900">Notion</span> · Senior PM</span>
        </motion.div>
      </div>
    </div>
  )
}

function BoardMock() {
  const reduce = useReducedMotion()
  return (
    <div className="relative max-w-5xl mx-auto">
      <motion.div
        variants={fadeUp} initial="hidden" animate="show" custom={3}
        className="relative z-10 rounded-2xl border border-slate-200/80 shadow-2xl shadow-slate-900/25 bg-white overflow-hidden backdrop-blur-xl transition-transform duration-500 ease-out hover:scale-[1.01]"
      >
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="font-mono text-[11px] text-slate-600">apptracker — board</span>
          <span className="w-10" />
        </div>
        <img
          src="/LandingPage/LandingPage1.png"
          alt="AppTracker board preview — applications moving through Wishlist, Applied, Interviewing, and Offer columns"
          className="w-full h-auto block"
          loading="eager"
        />
      </motion.div>

      <motion.div
        variants={fadeUp} initial="hidden" animate="show" custom={4}
        className="absolute -bottom-10 sm:-bottom-12 right-0 sm:-right-4 z-20 w-[46%] sm:w-[48%] origin-bottom-right rotate-2 rounded-xl bg-white border border-slate-200/80 shadow-2xl shadow-slate-900/35 ring-1 ring-slate-900/5 overflow-hidden transition-transform duration-500 ease-out hover:rotate-0 hover:scale-[1.02]"
      >
        <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-400" />
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>
        <img
          src="/LandingPage/LandingPage2.png"
          alt="AppTracker analytics and calendar views"
          className="w-full h-auto block"
          loading="lazy"
        />
      </motion.div>

      <motion.div
        animate={reduce ? {} : { y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-4 -right-4 z-20 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xl shadow-slate-900/10 px-3.5 py-2.5 flex items-center gap-2.5"
      >
        <span className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <CalendarClock size={18} />
        </span>
        <div>
          <div className="text-xs font-semibold text-slate-900">Interview at 2:00 PM</div>
          <div className="text-[11px] text-slate-600">Notion · System design</div>
        </div>
      </motion.div>

      <motion.div
        animate={reduce ? {} : { y: [0, 8, 0] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        className="absolute -bottom-4 -left-4 z-20 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xl shadow-slate-900/10 px-3.5 py-2.5 flex items-center gap-2.5"
      >
        <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <TrendingUp size={18} />
        </span>
        <div>
          <div className="text-xs font-semibold text-slate-900">3 offers this month</div>
          <div className="text-[11px] text-emerald-700 font-medium">Pipeline is healthy</div>
        </div>
      </motion.div>
    </div>
  )
}

function InlineCheck() {
  return (
    <svg className="w-4 h-4 text-emerald-500 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" className="fill-emerald-100" />
      <path d="M6 10.5l2.5 2.5L14 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Hero({ onLogin, onSignUp }) {
  const bullets = [
    'Five clear stages, from saved posting to signed offer',
    'Interview reminders so nothing catches you off guard',
    'Private by default — locked to your account, always exportable',
  ]
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_28%,#f1f5f9_0%,transparent_70%)]" />
        <div
          className="absolute inset-0 [mask-image:radial-gradient(ellipse_70%_65%_at_50%_30%,black,transparent)]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #e8edf5 1px, transparent 1px), linear-gradient(to bottom, #e8edf5 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            Free for your entire job hunt
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] text-slate-900 leading-[1.06]">
            Your whole job hunt,<br />
            <span className="bg-[linear-gradient(90deg,#F59E0B,#3B82F6,#A855F7,#10B981)] bg-clip-text text-transparent">one board.</span>
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="mt-5 text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
            Spreadsheets forget, inboxes bury. AppTracker keeps every company, interview, and note in a single pipeline — so you always know what&rsquo;s next.
          </motion.p>
          <motion.ul variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            {bullets.map(b => (
              <li key={b} className="flex items-center gap-1.5 text-slate-700 text-left">
                <InlineCheck />
                <span>{b}</span>
              </li>
            ))}
          </motion.ul>
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4} className="mt-6 flex flex-wrap justify-center items-center gap-3">
            <Button
              variant="primary"
              type="button"
              onClick={onSignUp}
              className="gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 px-7 py-3 !text-base font-semibold text-white shadow-md shadow-indigo-500/20 !transition-ui hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-px hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-white"
            >
              Create your board — free
              <ArrowRight size={16} />
            </Button>
            <Button
              variant="ghost"
              type="button"
              onClick={onLogin}
              className="gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-slate-700 dark:text-slate-700 bg-white font-semibold !transition-ui hover:border-slate-300 hover:!bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 shadow-sm hover:scale-[1.03] active:scale-[0.98]"
            >
              Log In
            </Button>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
            className="mt-4 font-mono text-[11px] font-medium text-slate-600">
            No credit card. No limits on applications.
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={6}>
            <PipelineRail />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function PreviewSection() {
  return (
    <section className="relative bg-slate-50/80 border-y border-slate-200/60 overflow-visible">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <BoardMock />
      </div>
    </section>
  )
}

const STATS = [
  { icon: GitBranch, value: '5 stages', label: 'from wishlist to signed offer', chip: 'bg-amber-50 text-amber-600' },
  { icon: LayoutGrid, value: '5 views', label: 'board, table, calendar, timeline, charts', chip: 'bg-indigo-50 text-indigo-600' },
  { icon: Download, value: '100%', label: 'of your data exportable as JSON', chip: 'bg-emerald-50 text-emerald-600' },
]

function StatsStrip() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {STATS.map((s, i) => (
          <motion.div key={s.label} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} custom={i}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-ui">
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.chip}`}>
              <s.icon size={18} />
            </span>
            <div>
              <div className="text-lg font-extrabold tracking-tight text-slate-900">{s.value}</div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-slate-600">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function MiniKanban() {
  const cols = [
    { dot: 'bg-amber-400', cards: ['w-10', 'w-8'] },
    { dot: 'bg-blue-400', cards: ['w-12', 'w-9'] },
    { dot: 'bg-purple-400', cards: ['w-10', 'w-7'] },
    { dot: 'bg-emerald-400', cards: ['w-11'] },
  ]
  return (
    <div className="mt-6 grid grid-cols-4 gap-2" aria-hidden="true">
      {cols.map((c, i) => (
        <div key={i} className="rounded-lg bg-slate-50 border border-slate-100 p-2">
          <span className={`block w-1.5 h-1.5 rounded-full ${c.dot} mb-2`} />
          <div className="space-y-1.5">
            {c.cards.map((w, j) => (
              <div key={j} className={`h-5 rounded-md ${w} bg-white border border-slate-200 shadow-sm`} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function MiniBars() {
  const reduce = useReducedMotion()
  const bars = [35, 60, 45, 75, 55, 95]
  return (
    <div className="mt-6 flex items-end gap-1.5 h-20" aria-hidden="true">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className={`flex-1 rounded-t-md ${i === bars.length - 1 ? 'bg-emerald-400' : 'bg-indigo-200'}`}
          initial={reduce ? { height: `${h}%` } : { height: 0 }}
          whileInView={{ height: `${h}%` }}
          viewport={{ once: true, margin: '-40px' }}
          transition={reduce ? { duration: 0 } : { duration: 0.7, delay: i * 0.07, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

function Features() {
  const tile = 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-ui flex flex-col'
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          <Eyebrow>Why AppTracker</Eyebrow>
          <Heading size="md" className="mt-2 !text-3xl !font-extrabold tracking-tight text-slate-900 dark:!text-slate-900">The details of a search, handled</Heading>
          <Text className="!text-base mt-3 max-w-xl">A job hunt is dozens of small threads. AppTracker ties them together so you can spend your energy on interviews, not admin.</Text>
        </motion.div>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} custom={0} className={`${tile} md:col-span-2`}>
            <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-50 text-indigo-600">
              <Columns3 size={18} />
            </span>
            <Heading size="sm" className="mt-4 !text-base !font-bold text-slate-900 dark:!text-slate-900">Move cards, not spreadsheets</Heading>
            <Text className="mt-2 leading-relaxed">Drag a card forward and the app does the bookkeeping — it prompts you to schedule the interview, timestamps the move, and keeps the full story behind every card.</Text>
            <MiniKanban />
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} custom={1} className={tile}>
            <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-50 text-amber-600">
              <CalendarClock size={18} />
            </span>
            <Heading size="sm" className="mt-4 !text-base !font-bold text-slate-900 dark:!text-slate-900">Never miss a round</Heading>
            <Text className="mt-2 leading-relaxed">Interviews surface in the header, the calendar, and the sidebar — with time-left countdowns as the moment approaches.</Text>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} custom={2} className={tile}>
            <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-50 text-violet-600">
              <LayoutGrid size={18} />
            </span>
            <Heading size="sm" className="mt-4 !text-base !font-bold text-slate-900 dark:!text-slate-900">Look at it any way you need</Heading>
            <Text className="mt-2 leading-relaxed">Prepping? Calendar. Comparing offers? Table. Reflecting? Timeline. Enter a job once and every view stays in sync.</Text>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} custom={3} className={tile}>
            <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-sky-50 text-sky-600">
              <BarChart3 size={18} />
            </span>
            <Heading size="sm" className="mt-4 !text-base !font-bold text-slate-900 dark:!text-slate-900">See your momentum</Heading>
            <Text className="mt-2 leading-relaxed">Response rates, pipeline health, and where each application stands — computed from your own activity.</Text>
            <MiniBars />
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} custom={4} className={tile}>
            <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
              <ShieldCheck size={18} />
            </span>
            <Heading size="sm" className="mt-4 !text-base !font-bold text-slate-900 dark:!text-slate-900">Private where it counts</Heading>
            <Text className="mt-2 leading-relaxed">Records are filtered to your account at the database level — not just hidden in the interface.</Text>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const VIEWS = [
  {
    icon: LayoutGrid, name: 'Board', desc: 'Drag between stages', chip: 'bg-indigo-50 text-indigo-600',
    art: (
      <div className="flex gap-1 h-14 w-full px-1" aria-hidden="true">
        {['bg-amber-200', 'bg-blue-200', 'bg-purple-200', 'bg-emerald-200'].map((c, i) => (
          <div key={i} className={`flex-1 rounded ${c} opacity-70`} />
        ))}
      </div>
    ),
  },
  {
    icon: Table2, name: 'Table', desc: 'Sort and compare', chip: 'bg-sky-50 text-sky-600',
    art: (
      <div className="w-full px-2 space-y-1.5" aria-hidden="true">
        <div className="h-1.5 rounded bg-slate-200" />
        <div className="h-1.5 rounded bg-slate-100 w-11/12" />
        <div className="h-1.5 rounded bg-slate-100 w-4/5" />
        <div className="h-1.5 rounded bg-indigo-200 w-5/6" />
      </div>
    ),
  },
  {
    icon: CalendarDays, name: 'Calendar', desc: 'This week’s interviews', chip: 'bg-amber-50 text-amber-600',
    art: (
      <div className="grid grid-cols-5 gap-1 w-full px-2" aria-hidden="true">
        {[10, 12, 10, 12, 10].map((h, i) => (
          <div key={i} className={`rounded-sm ${i === 2 ? 'bg-indigo-300' : 'bg-slate-200'}`} style={{ height: `${h * 4}px` }} />
        ))}
      </div>
    ),
  },
  {
    icon: GitBranch, name: 'Timeline', desc: 'How far you’ve come', chip: 'bg-violet-50 text-violet-600',
    art: (
      <div className="w-full px-3 flex items-center" aria-hidden="true">
        <span className="w-2 h-2 rounded-full bg-indigo-400" />
        <span className="flex-1 h-0.5 bg-indigo-200" />
        <span className="w-2 h-2 rounded-full bg-indigo-400" />
        <span className="flex-1 h-0.5 bg-indigo-200" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
      </div>
    ),
  },
  {
    icon: BarChart3, name: 'Analytics', desc: 'Where you stand', chip: 'bg-emerald-50 text-emerald-600',
    art: (
      <div className="flex items-end gap-1 h-14 w-full px-3" aria-hidden="true">
        {[40, 70, 55, 90].map((h, i) => (
          <div key={i} className={`flex-1 rounded-t ${i === 3 ? 'bg-emerald-300' : 'bg-indigo-200'}`} style={{ height: `${h}%` }} />
        ))}
      </div>
    ),
  },
]

function Views() {
  return (
    <section className="bg-slate-50/60 border-y border-slate-200/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          <Eyebrow>Five views</Eyebrow>
          <Heading size="md" className="mt-2 !text-3xl !font-extrabold tracking-tight text-slate-900 dark:!text-slate-900">Pick the lens that fits the moment</Heading>
          <Text className="!text-base mt-3 max-w-xl">Each view answers a different question about the same pipeline — switch freely, nothing gets re-entered.</Text>
        </motion.div>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-5">
          {VIEWS.map((v, i) => (
            <motion.div key={v.name} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} custom={i}
              className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-ui">
              <div className="flex items-center gap-2.5">
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${v.chip}`}>
                  <v.icon size={18} />
                </span>
                <div className="text-sm font-bold text-slate-900">{v.name}</div>
              </div>
              <div className="mt-3 flex-1 flex items-center">{v.art}</div>
              <div className="mt-3 font-mono text-[11px] font-medium text-slate-600">{v.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const SECURITY_POINTS = [
  { icon: Database, title: 'Filtered at the database, not the UI', body: 'Applications, interviews, notes, and history are scoped to your user id by row-level security policies.' },
  { icon: KeyRound, title: 'Sessions, not stored passwords', body: 'Sign-in runs on Supabase Auth. The app never sees or stores your raw password.' },
  { icon: Download, title: 'Leave whenever you want', body: 'Everything exports to JSON in one click. Your search history belongs to you, not to us.' },
]

function Security() {
  return (
    <section className="scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          <Eyebrow>Privacy</Eyebrow>
          <Heading size="md" className="mt-2 !text-3xl !font-extrabold tracking-tight text-slate-900 dark:!text-slate-900">Your search stays yours</Heading>
          <ul className="mt-7 space-y-5">
            {SECURITY_POINTS.map(p => (
              <li key={p.title} className="flex gap-3.5">
                <span className="mt-0.5 w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <p.icon size={18} />
                </span>
                <div>
                  <div className="text-sm font-bold text-slate-900">{p.title}</div>
                  <div className="mt-1 text-sm text-slate-600 leading-relaxed">{p.body}</div>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} custom={1}
          className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl shadow-indigo-950/20">
          <div className="font-mono text-[11px] text-slate-400 uppercase tracking-wide">what another user can see</div>
          <div className="mt-3 space-y-2 font-mono text-xs">
            <div className="rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2 text-slate-300">
              <span className="text-emerald-400">your_applications</span> → <span className="text-indigo-300">only yours</span>
            </div>
            <div className="rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2 text-slate-400">
              interviews · contacts · checklists · history
              <div className="text-slate-400 mt-0.5">inherited from the parent application</div>
            </div>
            <div className="rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2 text-slate-400">
              everyone else&rsquo;s data
              <div className="text-rose-400 mt-0.5">doesn&rsquo;t exist as far as you&rsquo;re concerned</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function CtaBand({ onSignUp }) {
  const reduce = useReducedMotion()
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
        className="relative overflow-hidden rounded-3xl bg-slate-950 px-8 py-14 text-center shadow-xl shadow-slate-900/20">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 overflow-hidden">
          <motion.div
            className="h-full w-[200%] bg-[linear-gradient(90deg,#F59E0B,#3B82F6,#A855F7,#10B981,#F59E0B,#3B82F6,#A855F7,#10B981)]"
            animate={reduce ? {} : { x: ['0%', '-50%'] }}
            transition={reduce ? {} : { duration: 4.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <div className="relative">
          <Heading size="md" className="!text-3xl !font-extrabold tracking-tight text-white">The next application is one drag away</Heading>
          <Text className="!text-base !text-slate-300 mt-3 max-w-md mx-auto">Make a free account, add your first posting, and watch the pipeline take shape.</Text>
          <Button
            variant="ghost"
            type="button"
            onClick={onSignUp}
            className="mt-7 inline-flex gap-2 rounded-xl bg-white !text-slate-900 !font-bold px-7 py-3 shadow-lg !transition-ui hover:!bg-slate-100 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Create your board — free
            <ArrowRight size={16} />
          </Button>
        </div>
      </motion.div>
    </section>
  )
}

function Footer({ onLogin, onSignUp }) {
  return (
    <footer className="border-t border-slate-200">
      <div className="w-full px-6 md:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-xs text-slate-500">© 2026 AppTracker. Built with React & Supabase.</span>
        </div>
        <div className="font-mono text-[11px] uppercase tracking-widest font-medium text-slate-600">Private by default · Export anytime</div>
        <nav className="flex items-center gap-6">
          <Button
            variant="ghost"
            type="button"
            onClick={onLogin}
            className="!p-0 text-sm font-medium !text-slate-600 hover:!text-slate-900 hover:!bg-transparent"
          >
            Log In
          </Button>
          <Button
            variant="ghost"
            type="button"
            onClick={onSignUp}
            className="!p-0 text-sm font-medium !text-slate-600 hover:!text-slate-900 hover:!bg-transparent"
          >
            Sign Up
          </Button>
          <a
            href="https://github.com/bulsu-rggnzls/Application-Tracker"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  )
}

export default function LandingPage({ onLogin, onSignUp }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      <Header onLogin={onLogin} onSignUp={onSignUp} />
      <main>
        <Hero onLogin={onLogin} onSignUp={onSignUp} />
        <PreviewSection />
        <StatsStrip />
        <Features />
        <Views />
        <Security />
        <CtaBand onSignUp={onSignUp} />
      </main>
      <Footer onLogin={onLogin} onSignUp={onSignUp} />
    </div>
  )
}
