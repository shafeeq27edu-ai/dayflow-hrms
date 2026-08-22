'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitLeaveRequest(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const leaveType = formData.get('leaveType') as string
  const startDate = formData.get('startDate') as string
  const endDate = formData.get('endDate') as string
  const reason = formData.get('reason') as string

  if (!leaveType || !startDate || !endDate || !reason) {
    throw new Error('All fields are required')
  }

  if (new Date(startDate) > new Date(endDate)) {
    throw new Error('Start date cannot be after end date')
  }

  const { data: conflicts } = await supabase
    .from('leave_requests')
    .select('id')
    .eq('employee_id', user.id)
    .neq('status', 'rejected')
    .lte('start_date', endDate)
    .gte('end_date', startDate)

  if (conflicts && conflicts.length > 0) {
    throw new Error('You already have a leave request overlapping with these dates')
  }

  const { error } = await supabase
    .from('leave_requests')
    .insert({
      employee_id: user.id,
      leave_type: leaveType,
      start_date: startDate,
      end_date: endDate,
      reason: reason,
      status: 'pending'
    })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/time-off')
  return { success: true }
}

export async function updateLeaveRequestStatus(requestId: string, status: 'approved' | 'rejected') {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // verify HR/Admin
  const { data: currentUser } = await supabase.from('employees').select('role').eq('id', user.id).single()
  if (currentUser?.role !== 'admin' && currentUser?.role !== 'hr') {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('leave_requests')
    .update({ 
      status,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', requestId)

  if (error) throw new Error(error.message)

  revalidatePath('/time-off')
}
