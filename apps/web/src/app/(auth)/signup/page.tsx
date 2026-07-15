import type { Metadata } from 'next'
import Link from 'next/link'
import { SignupForm } from './signup-form'

export const metadata: Metadata = {
  title: 'Create an account',
  description: 'Sign up for BizBridge Ethiopia.',
}

export default function SignupPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tightish text-ink">Create your account</h1>
      <p className="mt-1.5 text-sm text-ink-muted">
        Already have one?{' '}
        <Link href="/login" className="font-medium text-brand hover:underline">
          Log in
        </Link>
      </p>
      <div className="mt-8">
        <SignupForm />
      </div>
      <p className="mt-6 text-center text-xs text-ink-faint">
        Free forever · No card required
      </p>
    </div>
  )
}
