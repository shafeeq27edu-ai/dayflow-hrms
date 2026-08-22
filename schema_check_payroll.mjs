import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function check() {
  // Try fetching from payroll table if it exists
  const { data, error } = await supabase.from('payroll').select('*').limit(1)
  console.log('PAYROLL TABLE:', data, error ? error.message : '')
  
  const { data: payslip, error: pError } = await supabase.from('payslips').select('*').limit(1)
  console.log('PAYSLIPS TABLE:', payslip, pError ? pError.message : '')

  const { data: salary, error: sError } = await supabase.from('salaries').select('*').limit(1)
  console.log('SALARIES TABLE:', salary, sError ? sError.message : '')
}
check()
