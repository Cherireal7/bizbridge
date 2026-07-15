import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Log in to your BizBridge Ethiopia account.',
}

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tightish text-ink">Welcome back</h1>
      <p className="mt-1.5 text-sm text-ink-muted">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-brand hover:underline">
          Sign up
        </Link>
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
      <p className="mt-6 text-center text-xs text-ink-faint">
        <Link href="/forgot-password" className="hover:text-ink">
          Forgot your password?
        </Link>
      </p>
    </div>
  )
}
