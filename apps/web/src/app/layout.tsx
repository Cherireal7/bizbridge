import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { CurrencyProvider } from '@/components/providers/currency-provider'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'BizBridge Ethiopia — open a business in Bishoftu without the guesswork',
    template: '%s · BizBridge Ethiopia',
  },
  description:
    'The complete guide to opening a business in Bishoftu and across Ethiopia. 519 official sectors, real fees, real timelines, expert help on demand.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  applicationName: 'BizBridge Ethiopia',
  authors: [{ name: 'BizBridge' }],
  keywords: [
    'Ethiopia',
    'Bishoftu',
    'Debrezeit',
    'business setup',
    'MOR Directive 17/2011',
    'trade license',
    'diaspora investment',
  ],
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    title: 'BizBridge Ethiopia',
    description: 'Open a business in Ethiopia — verified, modern, no middlemen.',
    siteName: 'BizBridge Ethiopia',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BizBridge Ethiopia',
    description: 'Open a business in Ethiopia — verified, modern, no middlemen.',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#090C0E' },
    { media: '(prefers-color-scheme: light)', color: '#F8F5EF' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      style={
        {
          ['--font-sans' as string]: GeistSans.style.fontFamily,
          ['--font-mono' as string]: GeistMono.style.fontFamily,
        } as React.CSSProperties
      }
    >
      <body>
        <ThemeProvider defaultTheme="dark">
          <CurrencyProvider>
            {children}
            <Toaster position="bottom-right" theme="dark" richColors closeButton />
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
