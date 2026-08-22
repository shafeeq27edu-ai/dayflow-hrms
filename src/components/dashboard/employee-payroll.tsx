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

interface EmployeePayrollProps {
  payrollData: PayrollRecord[]
}

export function EmployeePayroll({ payrollData }: EmployeePayrollProps) {
  const latestRecord = payrollData.length > 0 ? payrollData[0] : null;

  return (
    <div className="flex flex-col gap-stack-lg">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter">
        {/* Latest Payslip Breakdown (Spans 4 cols on XL) */}
        <div className="xl:col-span-4 bg-surface rounded border border-primary p-6 shadow-[4px_4px_0px_0px_rgba(27,28,26,1)]">
          <div className="mb-6 pb-4 border-b border-outline-variant text-center">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2">
              {latestRecord ? new Date(latestRecord.payroll_month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Current Cycle'}
            </h3>
            <div className="font-headline-xl text-headline-xl text-primary font-bold">
              ${(latestRecord?.net_salary || 0).toLocaleString()}
            </div>
            <p className="font-label-sm text-label-sm text-[#006A60] mt-1 font-medium bg-[#006A60]/10 inline-block px-2 py-0.5 rounded">
              {latestRecord?.payment_status?.toUpperCase() || 'NO DATA'}
            </p>
          </div>
          
          <div className="space-y-3 font-data-mono text-data-mono">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Basic Salary</span>
              <span className="text-primary">${(latestRecord?.basic_salary || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Allowances</span>
              <span className="text-primary">+${(latestRecord?.allowances || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Deductions</span>
              <span className="text-error">-${(latestRecord?.deductions || 0).toLocaleString()}</span>
            </div>
          </div>
          

        </div>

        {/* Payroll History Table (Spans 8 cols on XL) */}
        <div className="xl:col-span-8 bg-surface rounded border border-primary overflow-hidden shadow-[4px_4px_0px_0px_rgba(27,28,26,1)]">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
            <h3 className="font-label-md text-label-md text-primary tracking-wider">PAYROLL HISTORY</h3>
            <div className="flex gap-2">
              <button className="p-1 border border-outline-variant rounded hover:bg-surface-container text-on-surface-variant">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant">
                  <th className="p-4 font-semibold">Month</th>
                  <th className="p-4 font-semibold">Date Processed</th>
                  <th className="p-4 font-semibold text-right">Amount</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="font-data-mono text-data-mono text-primary divide-y divide-outline-variant/50">
                {payrollData.map((record) => (
                  <tr key={record.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="p-4">{new Date(record.payroll_month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</td>
                    <td className="p-4 text-on-surface-variant">{new Date(record.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="p-4 font-medium text-right">${(record.net_salary || 0).toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-[#e8f5e9] text-[#1b5e20] text-xs font-bold tracking-wide border border-[#1b5e20]/20 uppercase">
                        {record.payment_status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-on-surface-variant hover:text-primary transition-colors" title="Download">
                        <span className="material-symbols-outlined">download</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {payrollData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-on-surface-variant font-body-md">
                      No payroll records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
