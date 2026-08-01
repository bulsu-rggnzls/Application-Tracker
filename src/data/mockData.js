import { v4 as uuidv4 } from 'uuid'

const now = new Date()

function daysAgo(n) {
  const d = new Date(now)
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function hoursFromNow(h) {
  const d = new Date(now)
  d.setHours(d.getHours() + h)
  return d.toISOString()
}

const mockData = [
  {
    id: uuidv4(),
    company: 'Stripe',
    role: 'Senior Frontend Engineer',
    location: 'Remote',
    salary: { min: 180000, max: 220000, currency: 'USD', period: 'yearly' },
    employmentType: 'full-time',
    status: 'interviewing',
    dateApplied: daysAgo(13),
    tags: ['React', 'TypeScript', 'GraphQL'],
    jobUrl: 'https://stripe.com/jobs',
    notes: 'Took the technical screen. Next round: system design.',
    interviews: [
      {
        id: uuidv4(),
        stageName: 'Technical Screen',
        date: daysAgo(-5),
        time: '10:00',
        interviewer: 'Sarah Chen',
        platform: 'Zoom',
        meetingLink: 'https://zoom.us/j/123',
        notes: 'Technical screen went well. LeetCode medium/hard.',
      },
      {
        id: uuidv4(),
        stageName: 'System Design',
        date: daysAgo(-2),
        time: '14:00',
        interviewer: 'Mike Rodriguez',
        platform: 'Google Meet',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        notes: 'System design round coming up.',
      },
      {
        id: uuidv4(),
        stageName: 'Behavioral',
        date: hoursFromNow(5),
        time: '16:00',
        interviewer: 'Emily Park',
        platform: 'Zoom',
        meetingLink: 'https://zoom.us/j/999',
        notes: 'Behavioral round with the hiring manager.',
      },
    ],
    activityLog: [
      { id: uuidv4(), timestamp: daysAgo(14), action: 'status_change', details: 'Added to wishlist' },
      { id: uuidv4(), timestamp: daysAgo(13), action: 'status_change', details: 'Applied via Stripe careers page' },
      { id: uuidv4(), timestamp: daysAgo(8), action: 'interview_scheduled', details: 'Technical screen scheduled with Sarah Chen' },
      { id: uuidv4(), timestamp: daysAgo(5), action: 'interview_completed', details: 'Completed technical screen' },
      { id: uuidv4(), timestamp: daysAgo(4), action: 'interview_scheduled', details: 'System design round scheduled with Mike Rodriguez' },
    ],
  },
  {
    id: uuidv4(),
    company: 'Linear',
    role: 'Full Stack Engineer',
    location: 'Remote',
    salary: { min: 160000, max: 200000, currency: 'USD', period: 'yearly' },
    employmentType: 'full-time',
    status: 'applied',
    dateApplied: daysAgo(5),
    tags: ['React', 'Rust', 'TypeScript'],
    jobUrl: 'https://linear.app/jobs',
    notes: 'Great product team. Need to review their API docs before interview.',
    interviews: [],
    activityLog: [
      { id: uuidv4(), timestamp: daysAgo(6), action: 'status_change', details: 'Added to wishlist' },
      { id: uuidv4(), timestamp: daysAgo(5), action: 'status_change', details: 'Applied via Linear careers page' },
    ],
  },
  {
    id: uuidv4(),
    company: 'Notion',
    role: 'Frontend Infrastructure Engineer',
    location: 'Hybrid (NYC)',
    salary: { min: 170000, max: 210000, currency: 'USD', period: 'yearly' },
    employmentType: 'full-time',
    status: 'wishlist',
    dateApplied: '',
    tags: ['React', 'Webpack', 'Performance'],
    jobUrl: 'https://notion.com/careers',
    notes: 'Dream company. Wait for the right role to open up.',
    interviews: [],
    activityLog: [
      { id: uuidv4(), timestamp: daysAgo(10), action: 'status_change', details: 'Added to wishlist' },
    ],
  },
  {
    id: uuidv4(),
    company: 'Vercel',
    role: 'Software Engineer, DX',
    location: 'Remote',
    salary: { min: 175000, max: 215000, currency: 'USD', period: 'yearly' },
    employmentType: 'full-time',
    status: 'offer',
    dateApplied: daysAgo(33),
    tags: ['Next.js', 'TypeScript', 'Open Source'],
    jobUrl: 'https://vercel.com/jobs',
    notes: 'Received offer. Negotiating equity package.',
    interviews: [
      {
        id: uuidv4(),
        stageName: 'Technical Screen',
        date: daysAgo(25),
        time: '11:00',
        interviewer: 'Lee Robinson',
        platform: 'Google Meet',
        meetingLink: 'https://meet.google.com/xyz-uvw-rst',
        notes: 'Technical screen - building a small Next.js app',
      },
      {
        id: uuidv4(),
        stageName: 'System Design',
        date: daysAgo(18),
        time: '13:00',
        interviewer: 'Raul N.',
        platform: 'Zoom',
        meetingLink: 'https://zoom.us/j/456',
        notes: 'System design and architecture discussion',
      },
      {
        id: uuidv4(),
        stageName: 'Final Round (CTO)',
        date: daysAgo(10),
        time: '15:00',
        interviewer: 'Guillermo R.',
        platform: 'Google Meet',
        meetingLink: 'https://meet.google.com/mno-pqr-stu',
        notes: 'Final round with CTO - went great!',
      },
    ],
    activityLog: [
      { id: uuidv4(), timestamp: daysAgo(35), action: 'status_change', details: 'Added to wishlist' },
      { id: uuidv4(), timestamp: daysAgo(33), action: 'status_change', details: 'Applied via Vercel careers page' },
      { id: uuidv4(), timestamp: daysAgo(28), action: 'interview_scheduled', details: 'Technical screen scheduled' },
      { id: uuidv4(), timestamp: daysAgo(25), action: 'interview_completed', details: 'Completed technical screen' },
      { id: uuidv4(), timestamp: daysAgo(22), action: 'interview_scheduled', details: 'System design round scheduled' },
      { id: uuidv4(), timestamp: daysAgo(18), action: 'interview_completed', details: 'Completed system design round' },
      { id: uuidv4(), timestamp: daysAgo(14), action: 'interview_scheduled', details: 'Final round scheduled with CTO' },
      { id: uuidv4(), timestamp: daysAgo(10), action: 'interview_completed', details: 'Completed final round' },
      { id: uuidv4(), timestamp: daysAgo(5), action: 'status_change', details: 'Received offer!' },
    ],
  },
  {
    id: uuidv4(),
    company: 'DoorDash',
    role: 'Staff Frontend Engineer',
    location: 'On-site (SF)',
    salary: { min: 200000, max: 250000, currency: 'USD', period: 'yearly' },
    employmentType: 'full-time',
    status: 'rejected',
    dateApplied: daysAgo(52),
    tags: ['React', 'Mobile', 'Web'],
    jobUrl: 'https://doordash.com/careers',
    notes: 'Rejected after final round. Good experience, need to work on system design.',
    interviews: [
      {
        id: uuidv4(),
        stageName: 'Phone Screen',
        date: daysAgo(45),
        time: '10:30',
        interviewer: 'Alex K.',
        platform: 'Zoom',
        meetingLink: 'https://zoom.us/j/789',
        notes: 'Initial phone screen',
      },
      {
        id: uuidv4(),
        stageName: 'On-site',
        date: daysAgo(38),
        time: '14:00',
        interviewer: 'Technical Panel',
        platform: 'Google Meet',
        meetingLink: '',
        notes: 'On-site: system design and coding',
      },
    ],
    activityLog: [
      { id: uuidv4(), timestamp: daysAgo(55), action: 'status_change', details: 'Added to wishlist' },
      { id: uuidv4(), timestamp: daysAgo(52), action: 'status_change', details: 'Applied' },
      { id: uuidv4(), timestamp: daysAgo(48), action: 'interview_scheduled', details: 'Phone screen scheduled' },
      { id: uuidv4(), timestamp: daysAgo(45), action: 'interview_completed', details: 'Completed phone screen' },
      { id: uuidv4(), timestamp: daysAgo(42), action: 'interview_scheduled', details: 'On-site scheduled' },
      { id: uuidv4(), timestamp: daysAgo(38), action: 'interview_completed', details: 'Completed on-site interviews' },
      { id: uuidv4(), timestamp: daysAgo(35), action: 'status_change', details: 'Rejected after final round' },
    ],
  },
]

export default mockData
