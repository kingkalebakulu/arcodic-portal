import { createClient } from '@supabase/supabase-js'

// ─────────────────────────────────────────────────────────
// STEP 1: Replace these two values with your Supabase project credentials.
// Find them at: https://supabase.com/dashboard → your project → Settings → API
// ─────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://vgpjqpwmzyrhubedxdye.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncGpxcHdtenlyaHViZWR4ZHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNjcyODQsImV4cCI6MjA5Mjk0MzI4NH0.2tnlDb3J4LY-tEBuS0wWXwXprm8CoqO_-XkaIE4AL5A'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ─────────────────────────────────────────────────────────
// CLIENT HELPERS
// ─────────────────────────────────────────────────────────

/** Fetch all clients (admin panel) */
export async function getClients() {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

/** Create a new client with generated EMPLID */
export async function createClient(name, email, emplid) {
  const { data, error } = await supabase
    .from('clients')
    .insert([{ name, email, emplid, status: 'new' }])
    .select()
    .single()
  if (error) throw error
  return data
}

/** Delete a client */
export async function deleteClient(emplid) {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('emplid', emplid)
  if (error) throw error
}

/** Verify a client EMPLID exists */
export async function verifyEmplid(emplid) {
  const { data, error } = await supabase
    .from('clients')
    .select('emplid, name, status')
    .eq('emplid', emplid)
    .single()
  if (error) return null
  return data
}

/** Save client submission data */
export async function saveSubmission(emplid, businessData, projectData, signatures) {
  const { error } = await supabase
    .from('submissions')
    .upsert([{
      emplid,
      business_data: businessData,
      project_data: projectData,
      signatures: Object.fromEntries(
        Object.entries(signatures).map(([k, v]) => [k, { mode: v.mode, date: v.date }])
      ),
      submitted_at: new Date().toISOString(),
    }])
  if (error) throw error

  // Mark client as complete
  await supabase
    .from('clients')
    .update({ status: 'complete' })
    .eq('emplid', emplid)
}
