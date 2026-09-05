import { supabase } from './supabase'

// ---------- row <-> model mappers ----------

function rowToSalary(row) {
  if (row.salary_min == null && row.salary_max == null) return ''
  return {
    min: row.salary_min ?? '',
    max: row.salary_max ?? '',
    currency: row.salary_currency || 'PHP',
    period: row.salary_period || 'yearly',
  }
}

function salaryToColumns(salary) {
  if (!salary || typeof salary !== 'object' || (salary.min === '' && salary.max === '')) {
    return { salary_min: null, salary_max: null, salary_currency: null, salary_period: null }
  }
  return {
    salary_min: salary.min === '' ? null : Number(salary.min),
    salary_max: salary.max === '' ? null : Number(salary.max),
    salary_currency: salary.currency || 'PHP',
    salary_period: salary.period || 'yearly',
  }
}

function rowToApplication(row) {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    location: row.location || '',
    employmentType: row.employment_type || 'full-time',
    status: row.status || 'wishlist',
    starred: !!row.starred,
    dateApplied: row.date_applied ? row.date_applied.split('T')[0] : '',
    salary: rowToSalary(row),
    jobUrl: row.job_url || '',
    tags: row.tags || [],
    notes: row.notes || '',
    recruiter: row.recruiters?.[0]
      ? {
          name: row.recruiters[0].name || '',
          email: row.recruiters[0].email || '',
          linkedin: row.recruiters[0].linkedin || '',
        }
      : undefined,
    checklist: (row.checklist_items || []).map(ci => ({
      id: ci.id,
      text: ci.text,
      done: !!ci.done,
    })),
    interviews: (row.interviews || []).map(iv => ({
      id: iv.id,
      stageName: iv.stage_name || 'Interview',
      date: iv.date ? iv.date.split('T')[0] : '',
      time: iv.time || '',
      interviewer: iv.interviewer || '',
      platform: iv.platform || '',
      meetingLink: iv.meeting_link || '',
      notes: iv.notes || '',
    })),
    activityLog: (row.activity_logs || []).map(l => ({
      id: l.id,
      timestamp: l.timestamp,
      action: l.action,
      details: l.details || '',
    })),
  }
}

function applicationToColumns(app) {
  return {
    id: app.id,
    company: app.company,
    role: app.role,
    location: app.location || '',
    employment_type: app.employmentType || 'full-time',
    status: app.status || 'wishlist',
    starred: !!app.starred,
    date_applied: app.dateApplied || null,
    ...salaryToColumns(app.salary),
    job_url: app.jobUrl || '',
    tags: app.tags || [],
    notes: app.notes || '',
  }
}

function interviewToRow(applicationId, iv) {
  return {
    id: iv.id,
    application_id: applicationId,
    stage_name: iv.stageName || 'Interview',
    date: iv.date || null,
    time: iv.time || '',
    interviewer: iv.interviewer || '',
    platform: iv.platform || '',
    meeting_link: iv.meetingLink || '',
    notes: iv.notes || '',
  }
}

// ---------- queries ----------

const APPLICATION_SELECT = `
  *,
  recruiters ( id, name, email, linkedin ),
  interviews ( id, stage_name, date, time, interviewer, platform, meeting_link, notes ),
  activity_logs ( id, action, details, timestamp ),
  checklist_items ( id, text, done )
`

export async function fetchApplications() {
  const { data, error } = await supabase
    .from('applications')
    .select(APPLICATION_SELECT)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data || []).map(rowToApplication)
}

/**
 * Syncs a nested collection (interviews / checklist / activity log):
 * upserts every row and deletes rows that no longer exist in the model.
 */
async function syncChildren(table, applicationId, rows) {
  const { data: existing, error: fetchErr } = await supabase
    .from(table)
    .select('id')
    .eq('application_id', applicationId)
  if (fetchErr) throw fetchErr

  const keepIds = new Set(rows.map(r => r.id))
  const staleIds = (existing || []).map(r => r.id).filter(id => !keepIds.has(id))

  if (rows.length > 0) {
    const { error: upsertErr } = await supabase.from(table).upsert(rows)
    if (upsertErr) throw upsertErr
  }
  if (staleIds.length > 0) {
    const { error: deleteErr } = await supabase.from(table).delete().in('id', staleIds)
    if (deleteErr) throw deleteErr
  }
}

async function syncRecruiter(applicationId, recruiter) {
  if (recruiter && recruiter.name) {
    const { error } = await supabase.from('recruiters').upsert({
      application_id: applicationId,
      name: recruiter.name || '',
      email: recruiter.email || '',
      linkedin: recruiter.linkedin || '',
    }, { onConflict: 'application_id' })
    if (error) throw error
  } else {
    const { error } = await supabase.from('recruiters').delete().eq('application_id', applicationId)
    if (error) throw error
  }
}

/**
 * Full save (create or update): writes the application row plus all nested
 * collections so the database mirrors the client model exactly.
 */
export async function saveApplication(app) {
  const { error } = await supabase
    .from('applications')
    .upsert({ ...applicationToColumns(app), updated_at: new Date().toISOString() })
  if (error) throw error

  await syncRecruiter(app.id, app.recruiter)
  await syncChildren('interviews', app.id, (app.interviews || []).map(iv => interviewToRow(app.id, iv)))
  await syncChildren('checklist_items', app.id, (app.checklist || []).map(c => ({
    id: c.id,
    application_id: app.id,
    text: c.text,
    done: !!c.done,
  })))
  await syncChildren('activity_logs', app.id, (app.activityLog || []).map(l => ({
    id: l.id,
    application_id: app.id,
    action: l.action,
    details: l.details || '',
    timestamp: l.timestamp || new Date().toISOString(),
  })))
}

export async function deleteApplication(id) {
  const { error } = await supabase.from('applications').delete().eq('id', id)
  if (error) throw error
}

// ---------- import/export helpers ----------

export async function importApplications(apps) {
  for (const app of apps) {
    await saveApplication(app)
  }
}
