import { v4 as uuidv4 } from 'uuid'
import { saveApplication } from './applicationsApi'

const now = new Date()
const daysAgo = n => {
  const d = new Date(now)
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}
const daysAhead = n => {
  const d = new Date(now)
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

const log = (action, details, n) => ({
  id: uuidv4(),
  timestamp: new Date(new Date(now).setDate(now.getDate() - n)).toISOString(),
  action,
  details,
})

const MOCK_APPLICATIONS = [
  {
    id: uuidv4(),
    company: 'Stripe',
    role: 'Senior Frontend Engineer',
    location: 'Remote',
    employmentType: 'full-time',
    status: 'interviewing',
    starred: true,
    dateApplied: daysAgo(13),
    salary: { min: 180000, max: 220000, currency: 'USD', period: 'yearly' },
    jobUrl: 'https://stripe.com/jobs',
    tags: ['React', 'TypeScript', 'GraphQL'],
    notes: 'Took the technical screen. Next round: system design.',
    recruiter: { name: 'Sarah Chen', email: 'sarah.chen@stripe.com', linkedin: 'https://linkedin.com/in/sarahchen' },
    checklist: [
      { id: uuidv4(), text: 'Review Stripe API docs', done: true },
      { id: uuidv4(), text: 'Prep system design examples', done: false },
    ],
    interviews: [
      { id: uuidv4(), stageName: 'Technical Screen', date: daysAgo(5), time: '10:00', interviewer: 'Sarah Chen', platform: 'Zoom', meetingLink: '', notes: 'Went well — LeetCode medium.' },
      { id: uuidv4(), stageName: 'System Design', date: daysAhead(2), time: '14:00', interviewer: 'Mike Rodriguez', platform: 'Google Meet', meetingLink: '', notes: 'Design a payment flow.' },
    ],
    activityLog: [
      log('status_change', 'Added Stripe — Senior Frontend Engineer', 14),
      log('status_change', 'Applied via Stripe careers page', 13),
      log('interview_scheduled', 'Technical screen scheduled with Sarah Chen', 8),
      log('interview_completed', 'Completed technical screen', 5),
      log('interview_scheduled', 'System design scheduled with Mike Rodriguez', 3),
    ],
  },
  {
    id: uuidv4(),
    company: 'Linear',
    role: 'Full Stack Engineer',
    location: 'Remote',
    employmentType: 'full-time',
    status: 'applied',
    starred: true,
    dateApplied: daysAgo(12),
    salary: { min: 160000, max: 200000, currency: 'USD', period: 'yearly' },
    jobUrl: 'https://linear.app/jobs',
    tags: ['React', 'Rust'],
    notes: 'Great product team.',
    checklist: [],
    interviews: [],
    activityLog: [
      log('status_change', 'Added Linear — Full Stack Engineer', 13),
      log('status_change', 'Applied via Linear careers page', 12),
    ],
  },
  {
    id: uuidv4(),
    company: 'Notion',
    role: 'Frontend Infrastructure Engineer',
    location: 'Hybrid (NYC)',
    employmentType: 'full-time',
    status: 'wishlist',
    starred: false,
    dateApplied: '',
    salary: { min: 170000, max: 210000, currency: 'USD', period: 'yearly' },
    jobUrl: 'https://notion.com/careers',
    tags: ['React', 'Performance'],
    notes: 'Dream company. Wait for the right role.',
    checklist: [],
    interviews: [],
    activityLog: [
      log('status_change', 'Added Notion — Frontend Infrastructure Engineer', 10),
    ],
  },
  {
    id: uuidv4(),
    company: 'Vercel',
    role: 'Software Engineer, DX',
    location: 'Remote',
    employmentType: 'full-time',
    status: 'offer',
    starred: false,
    dateApplied: daysAgo(33),
    salary: { min: 175000, max: 215000, currency: 'USD', period: 'yearly' },
    jobUrl: 'https://vercel.com/jobs',
    tags: ['Next.js', 'Open Source'],
    notes: 'Received offer. Negotiating equity.',
    checklist: [],
    interviews: [
      { id: uuidv4(), stageName: 'Technical Screen', date: daysAgo(25), time: '11:00', interviewer: 'Lee Robinson', platform: 'Google Meet', meetingLink: '', notes: 'Built a small Next.js app.' },
      { id: uuidv4(), stageName: 'Final Round (CTO)', date: daysAgo(10), time: '15:00', interviewer: 'Guillermo R.', platform: 'Google Meet', meetingLink: '', notes: 'Went great!' },
    ],
    activityLog: [
      log('status_change', 'Added Vercel — Software Engineer, DX', 35),
      log('status_change', 'Applied via Vercel careers page', 33),
      log('interview_completed', 'Completed final round with CTO', 10),
      log('status_change', 'Received offer!', 5),
    ],
  },
  {
    id: uuidv4(),
    company: 'DoorDash',
    role: 'Staff Frontend Engineer',
    location: 'On-site (SF)',
    employmentType: 'full-time',
    status: 'rejected',
    starred: false,
    dateApplied: daysAgo(52),
    salary: { min: 200000, max: 250000, currency: 'USD', period: 'yearly' },
    jobUrl: 'https://doordash.com/careers',
    tags: ['React', 'Web'],
    notes: 'Rejected after final round. Work on system design.',
    checklist: [],
    interviews: [
      { id: uuidv4(), stageName: 'On-site', date: daysAgo(38), time: '14:00', interviewer: 'Technical Panel', platform: 'Onsite', meetingLink: '', notes: 'System design and coding.' },
    ],
    activityLog: [
      log('status_change', 'Added DoorDash — Staff Frontend Engineer', 55),
      log('status_change', 'Applied via DoorDash careers page', 52),
      log('interview_completed', 'Completed on-site interviews', 38),
      log('status_change', 'Rejected after final round', 35),
    ],
  },
]

/**
 * Seeds the 5 demo applications into Supabase for the logged-in user.
 * Intentionally generates fresh UUIDs every run, so re-seeding just adds more rows.
 */
export async function seedMockApplications() {
  for (const app of MOCK_APPLICATIONS) {
    await saveApplication({ ...app, id: uuidv4() })
  }
}
