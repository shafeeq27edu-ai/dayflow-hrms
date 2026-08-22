'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'

const employeeSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  department: z.string().min(2),
  designation: z.string().min(2),
  dateOfJoining: z.string(),
  role: z.enum(['employee', 'hr', 'admin']),
  basicSalary: z.coerce.number().min(0),
})

export async function createEmployee(prevState: unknown, formData: FormData) {
  try {
    const data = employeeSchema.parse({
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      department: formData.get('department'),
      designation: formData.get('designation'),
      dateOfJoining: formData.get('dateOfJoining'),
      role: formData.get('role'),
      basicSalary: formData.get('basicSalary'),
    })

    // Create admin client with service_role to bypass RLS and create users
    const cookieStore = cookies()
    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set() {},
          remove() {},
        },
      }
    )

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-10) + 'A1!'

    // 1. Create Auth User
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { full_name: data.fullName }
    })

    if (authError) throw new Error(authError.message)

    // 2. Generate Employee ID (EMP-XXXX)
    const empId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`

    // 3. Create Employee Record
    const { error: dbError } = await supabaseAdmin
      .from('employees')
      .insert({
        id: authData.user.id,
        employee_id: empId,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone || null,
        department: data.department,
        designation: data.designation,
        date_of_joining: data.dateOfJoining,
        role: data.role,
        basic_salary: data.basicSalary,
        temporary_password_required: true
      })

    if (dbError) {
      // Rollback auth user creation if db insert fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      throw new Error(dbError.message)
    }

    return { 
      success: true, 
      message: 'Employee created successfully!', 
      tempPassword 
    }

  } catch (error: unknown) {
    return { success: false, error: (error as Error).message || 'Failed to create employee' }
  }
}
