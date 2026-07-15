/**
 * Runtime feature flags read from env.
 *
 * Kept in one place so we can grep for every hidden surface. All flags are
 * NEXT_PUBLIC_* so they inline into client bundles too — server pages still
 * read them from process.env at request time, which is fine on Vercel.
 */

export const ENABLE_ACCOUNTS = process.env.NEXT_PUBLIC_ENABLE_ACCOUNTS === 'true'

/** Contact endpoints surfaced on the consult page and CTAs. */
export const CONSULT_EMAIL = process.env.NEXT_PUBLIC_CONSULT_EMAIL || 'cheridemeke7@gmail.com'
export const CONSULT_TELEGRAM = process.env.NEXT_PUBLIC_CONSULT_TELEGRAM || 'https://t.me/Cherireal7'
export const CONSULT_FORMSUBMIT = process.env.NEXT_PUBLIC_CONSULT_FORMSUBMIT || `https://formsubmit.co/${CONSULT_EMAIL}`
