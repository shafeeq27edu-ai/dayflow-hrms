'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const editProfileSchema = z.object({
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
})

export async function editProfile(prevState: unknown, formData: FormData) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const data = editProfileSchema.parse({
      phone: formData.get('phone') || undefined,
      avatarUrl: formData.get('avatarUrl') || undefined,
    })

    const { error } = await supabase
      .from('employees')
      .update({
        phone: data.phone,
        avatar_url: data.avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) throw error

    revalidatePath(`/profile/${user.id}`)
    return { success: true, message: 'Profile updated successfully.' }
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message || 'Failed to update profile.' }
  }
}

const updateEmployeeHrSchema = z.object({
  id: z.string().uuid(),
  department: z.string().min(2),
  designation: z.string().min(2),
  basicSalary: z.coerce.number().min(0),
})

export async function updateEmployeeHr(prevState: unknown, formData: FormData) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Verify HR/Admin role
    const { data: currentUser } = await supabase
      .from('employees')
      .select('role')
      .eq('id', user.id)
      .single()

    if (currentUser?.role !== 'hr' && currentUser?.role !== 'admin') {
      throw new Error('Unauthorized. HR or Admin role required.')
    }

    const data = updateEmployeeHrSchema.parse({
      id: formData.get('id'),
      department: formData.get('department'),
      designation: formData.get('designation'),
      basicSalary: formData.get('basicSalary'),
    })

    const { error } = await supabase
      .from('employees')
      .update({
        department: data.department,
        designation: data.designation,
        basic_salary: data.basicSalary,
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.id)

    if (error) throw error

    revalidatePath(`/profile/${data.id}`)
    revalidatePath(`/employees`)
    return { success: true, message: 'Employee updated successfully.' }
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message || 'Failed to update employee.' }
  }
}
