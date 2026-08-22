'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const processPayrollSchema = z.object({
  payrollMonth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
})

export async function processPayroll(prevState: unknown, formData: FormData) {
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

    const { payrollMonth } = processPayrollSchema.parse({
      payrollMonth: formData.get('payrollMonth'),
    })

    // Check if payroll already processed for this month
    const { data: existingPayroll } = await supabase
      .from('payroll')
      .select('id')
      .eq('payroll_month', payrollMonth)
      .limit(1)

    if (existingPayroll && existingPayroll.length > 0) {
      throw new Error(`Payroll already processed for ${payrollMonth}`)
    }

    // Fetch all employees
    const { data: employees, error: empError } = await supabase
      .from('employees')
      .select('id, basic_salary, allowances, deductions')

    if (empError) throw empError
    if (!employees || employees.length === 0) throw new Error('No employees found to process')

    // Prepare payroll records
    const payrollRecords = employees.map((emp) => {
      const basic = emp.basic_salary || 0
      const allow = emp.allowances || 0
      const deduc = emp.deductions || 0
      const net = basic + allow - deduc

      return {
        employee_id: emp.id,
        payroll_month: payrollMonth,
        basic_salary: basic,
        allowances: allow,
        deductions: deduc,
        net_salary: net > 0 ? net : 0,
        payment_status: 'paid', // Defaulting to paid for demo simplicity
      }
    })

    // Batch insert
    const { error: insertError } = await supabase
      .from('payroll')
      .insert(payrollRecords)

    if (insertError) throw insertError

    revalidatePath('/payroll')
    return { success: true, message: `Successfully processed payroll for ${payrollRecords.length} employees.` }
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message || 'Failed to process payroll.' }
  }
}
