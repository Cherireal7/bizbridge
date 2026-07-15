/**
 * TeleBirr (Ethio Telecom) mobile-money checkout stub.
 *
 * The TeleBirr Open API uses RSA-encrypted JSON payloads signed with the merchant's
 * private key. This stub matches the call shape so the wiring is correct ahead of
 * the user supplying production credentials.
 *
 *   1. `initiate(order)` → returns a hosted-checkout URL or a QR payload
 *   2. `verifyNotification(payload)` → confirms a webhook came from TeleBirr
 *
 * Production constants live in apps/api/.env:
 *   TELEBIRR_APP_ID, TELEBIRR_APP_KEY, TELEBIRR_PUBLIC_KEY,
 *   TELEBIRR_SHORT_CODE, TELEBIRR_NOTIFY_URL.
 */

import { env } from '../env.js'

export interface TeleBirrCheckoutInput {
  amount: number
  currency: 'ETB'
  out_trade_no: string // our payment id / tx_ref
  subject: string
  return_url: string
  notify_url: string
  customer_email?: string
  customer_phone?: string
}

export interface TeleBirrCheckoutResult {
  checkout_url: string
  out_trade_no: string
  raw: unknown
}

export class TeleBirrService {
  get isConfigured(): boolean {
    // Production keys not bound yet — wired for when the user supplies them.
    return false
  }

  async initiate(_input: TeleBirrCheckoutInput): Promise<TeleBirrCheckoutResult> {
    throw new Error(
      'TeleBirr not configured. Set TELEBIRR_APP_ID, TELEBIRR_APP_KEY, TELEBIRR_PUBLIC_KEY in apps/api/.env',
    )
  }

  verifyNotification(_headers: Record<string, string | undefined>, _rawBody: string): boolean {
    if (!env.NODE_ENV) return false
    throw new Error('TeleBirr verifyNotification not implemented yet — Phase 2 stub')
  }
}

export const telebirrService = new TeleBirrService()
