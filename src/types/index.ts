export type UserRole = 'employee' | 'hr' | 'admin'

export interface Employee {
  id: string
  employee_id: string
  full_name: string
  email: string
  phone?: string | null
  department: string
  designation: string
  date_of_joining: string
  role: UserRole
  basic_salary: number
  avatar_url?: string | null
  temporary_password_required: boolean
  created_at: string
}

export interface Attendance {
  id: string
  employee_id: string
  attendance_date: string
  check_in: string | null
  check_out: string | null
  status: 'present' | 'absent' | 'on_leave'
  worked_minutes: number
  created_at: string
}

export interface LeaveRequest {
  id: string
  employee_id: string
  leave_type: 'casual' | 'sick' | 'earned'
  start_date: string
  end_date: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export interface Payroll {
  id: string
  employee_id: string
  payroll_month: string // stored as date or YYYY-MM
  basic_salary: number
  allowances: number
  deductions: number
  net_salary: number
  created_at: string
}
