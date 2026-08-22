'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function checkIn() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const today = new Date().toISOString().split('T')[0]
  const now = new Date().toISOString()
  
  // Guard against duplicate check-in
  const { data: existingRecord } = await supabase
    .from('attendance')
    .select('id')
    .eq('employee_id', user.id)
    .eq('attendance_date', today)
    .single()

  if (existingRecord) {
    throw new Error('Already checked in for today')
  }

  const { data, error } = await supabase
    .from('attendance')
    .insert({
      employee_id: user.id,
      attendance_date: today,
      check_in: now,
      status: 'present'
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath('/dashboard')
  revalidatePath('/attendance')
  
  return { success: true, data }
}

export async function checkOut(recordId: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  // Fetch existing to calculate worked minutes
  const { data: record, error: fetchError } = await supabase
    .from('attendance')
    .select('*')
    .eq('id', recordId)
    .eq('employee_id', user.id)
    .single()
    
  if (fetchError || !record) throw new Error('Record not found or not owned by user')
  if (record.check_out) throw new Error('Already checked out')
  if (!record.check_in) throw new Error('Cannot check out without checking in')

  const now = new Date()
  const checkInTime = new Date(record.check_in)
  const workedMinutes = Math.floor((now.getTime() - checkInTime.getTime()) / 60000)

  const { data, error } = await supabase
    .from('attendance')
    .update({
      check_out: now.toISOString(),
      worked_minutes: workedMinutes
    })
    .eq('id', recordId)
    .eq('employee_id', user.id)
    .select()
    .single()

  if (error) throw error

  revalidatePath('/dashboard')
  revalidatePath('/attendance')

  return { success: true, data }
}
