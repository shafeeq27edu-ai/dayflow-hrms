import { ProcessPayrollButton } from '@/components/dashboard/process-payroll-button'

interface PayrollRecord {
  id: string
  payroll_month: string
  basic_salary: number | null
  allowances: number | null
  deductions: number | null
  net_salary: number | null
  payment_status: string
  created_at: string
  employees?: {
    full_name: string
    employee_id: string
  }
}

interface HrPayrollProps {
  payrollData: PayrollRecord[]
}

export function HrPayroll({ payrollData }: HrPayrollProps) {
  // Determine current cycle from data, or default to current date
  const latestRecord = payrollData.length > 0 ? payrollData[0] : null;
  let currentCycleStr = 'Pending'
  
  let totalPayroll = 0;
  let totalTaxes = 0;
  let employeeCount = 0;

  if (latestRecord) {
    const latestMonth = latestRecord.payroll_month
    currentCycleStr = new Date(latestMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    
    const currentCycleRecords = payrollData.filter(r => r.payroll_month === latestMonth)
    employeeCount = currentCycleRecords.length
    totalPayroll = currentCycleRecords.reduce((sum, r) => sum + (r.basic_salary || 0) + (r.allowances || 0), 0)
    totalTaxes = currentCycleRecords.reduce((sum, r) => sum + (r.deductions || 0), 0)
  }

  return (
    <div className="flex flex-col gap-stack-lg">
      {/* Action Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h3 className="font-body-lg text-body-lg text-on-surface-variant">Current Cycle: {currentCycleStr}</h3>
        </div>
        <div className="flex flex-wrap gap-4">
          <button className="bg-surface text-primary border-2 border-primary py-2 px-4 font-label-md text-label-md lift-shadow flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">download</span>
            Export CSV
          </button>
          <ProcessPayrollButton />
        </div>
      </div>

      {/* Summary Cards Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div className="bg-surface-container-lowest border-2 border-primary p-6 flat-shadow">
          <p className="font-label-md text-label-md text-on-surface-variant uppercase border-b border-outline-variant pb-2 mb-4">Total Payroll Amount</p>
          <h4 className="font-headline-lg text-headline-lg text-primary">${totalPayroll.toLocaleString()}</h4>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 flex items-center gap-1">
            Calculated from basic salary + allowances
          </p>
        </div>
        
        <div className="bg-surface-container-lowest border-2 border-primary p-6 flat-shadow">
          <p className="font-label-md text-label-md text-on-surface-variant uppercase border-b border-outline-variant pb-2 mb-4">Taxes & Deductions</p>
          <h4 className="font-headline-lg text-headline-lg text-primary">${totalTaxes.toLocaleString()}</h4>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">Combined federal & state</p>
        </div>
        
        <div className="bg-surface-container-low border-2 border-primary p-6 flat-shadow">
          <p className="font-label-md text-label-md text-on-surface-variant uppercase border-b border-outline-variant pb-2 mb-4">Status</p>
          <h4 className="font-headline-lg text-headline-lg text-primary">{employeeCount > 0 ? 'Processed' : 'Pending Review'}</h4>
          <div className="mt-4 flex gap-2">
            <span className="px-3 py-1 bg-surface-variant text-on-surface-variant font-label-sm text-label-sm border border-outline-variant">
              {employeeCount} Employees Ready
            </span>
          </div>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="bg-surface-container-lowest border-2 border-primary overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-primary flex flex-col md:flex-row justify-between md:items-center bg-surface-container-low gap-4">
          <h4 className="font-headline-md text-headline-md text-primary">Employee Records</h4>
          <div className="flex gap-4">
            <div className="relative">
              <select className="appearance-none bg-surface border border-primary py-2 pl-4 pr-10 font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-secondary">
                <option>All Departments</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-2.5 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
            <div className="relative">
              <select className="appearance-none bg-surface border border-primary py-2 pl-4 pr-10 font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-secondary">
                <option>All Statuses</option>
                <option>Paid</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-2.5 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container border-b-2 border-primary">
                <th className="p-4 font-label-md text-label-md text-primary uppercase">Employee</th>
                <th className="p-4 font-label-md text-label-md text-primary uppercase">Period</th>
                <th className="p-4 font-label-md text-label-md text-primary uppercase text-right">Gross</th>
                <th className="p-4 font-label-md text-label-md text-primary uppercase text-right">Deductions</th>
                <th className="p-4 font-label-md text-label-md text-primary uppercase text-right">Net Salary</th>
                <th className="p-4 font-label-md text-label-md text-primary uppercase text-center">Status</th>
              </tr>
            </thead>
            <tbody className="font-data-mono text-data-mono text-primary divide-y divide-surface-variant">
              {payrollData.map((record) => {
                const gross = (record.basic_salary || 0) + (record.allowances || 0)
                
                return (
                  <tr key={record.id} className="hover:bg-surface-bright transition-colors">
                    <td className="p-4">
                      <div className="font-label-md text-primary font-body-md">{record.employees?.full_name}</div>
                      <div className="text-on-surface-variant text-sm font-body-md">{record.employees?.employee_id}</div>
                    </td>
                    <td className="p-4">{new Date(record.payroll_month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</td>
                    <td className="p-4 text-right">${gross.toLocaleString()}</td>
                    <td className="p-4 text-right text-error">-${(record.deductions || 0).toLocaleString()}</td>
                    <td className="p-4 text-right font-bold font-headline-md text-primary">${(record.net_salary || 0).toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-[#e8f5e9] text-[#1b5e20] text-xs font-bold tracking-wide border border-[#1b5e20]/20 uppercase">
                        {record.payment_status}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {payrollData.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-on-surface-variant font-body-md">
                    No payroll records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
