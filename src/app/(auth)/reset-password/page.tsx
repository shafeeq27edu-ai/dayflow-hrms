import { Metadata } from 'next'
import { ResetPasswordForm } from './reset-password-form'

export const metadata: Metadata = {
  title: 'Dayflow - Reset Password',
  description: 'Set your new Dayflow account password',
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-4 antialiased">
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-50 mix-blend-multiply z-0">
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern height="40" id="grid-pattern" patternUnits="userSpaceOnUse" width="40">
              <path className="text-surface-variant" d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
            </pattern>
          </defs>
          <rect fill="url(#grid-pattern)" height="100%" width="100%"></rect>
        </svg>
      </div>
      
      <div className="relative z-10 w-full max-w-[480px]">
        <div className="text-center mb-stack-lg">
          <h1 className="font-headline-xl text-headline-xl text-primary mb-stack-sm tracking-tight">Dayflow</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Update Your Password</p>
        </div>
        
        <div className="bg-surface-container-lowest border border-primary p-stack-lg rounded shadow-[4px_4px_0px_0px_rgba(27,28,26,1)] transition-transform duration-300">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  )
}
