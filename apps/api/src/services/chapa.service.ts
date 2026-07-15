/**
 * Chapa payments integration (Ethiopia).
 *
 * https://developer.chapa.co/docs/
 *
 *   1. `createCheckout` -> initialize a transaction, get a hosted checkout URL.
 *   2. Customer pays on the Chapa page; Chapa POSTs to our webhook with `tx_ref`.
 *   3. `verifyTransaction(tx_ref)` -> double-check status by calling Chapa's verify endpoint.
 *
 * Webhook signature is HMAC-SHA256 of the raw body with CHAPA_WEBHOOK_SECRET.
 */

import crypto from 'node:crypto'
import { env } from '../env.js'

const CHAPA_BASE = 'https://api.chapa.co/v1'

export interface ChapaCheckoutInput {
  amount: number
  currency: 'ETB' | 'USD'
  email: string
  first_name?: string
  last_name?: string
  phone_number?: string
  tx_ref: string
  callback_url: string
  return_url: string
  customization?: { title?: string; description?: string; logo?: string }
  meta?: Record<string, string | number>
}

export interface ChapaCheckoutResult {
  checkout_url: string
  tx_ref: string
  raw: unknown
}

export interface ChapaVerifyResult {
  status: 'success' | 'failed' | 'pending'
  amount: number
  currency: string
  tx_ref: string
  reference: string | null
  raw: unknown
}

export class ChapaService {
  private readonly secretKey: string | undefined
  private readonly webhookSecret: string | undefined

  constructor() {
    this.secretKey = env.CHAPA_SECRET_KEY
    this.webhookSecret = env.CHAPA_WEBHOOK_SECRET
  }

  get isConfigured() {
    return Boolean(this.secretKey)
  }

  async createCheckout(input: ChapaCheckoutInput): Promise<ChapaCheckoutResult> {
    if (!this.secretKey) {
      throw new Error('CHAPA_SECRET_KEY is not configured')
    }
    const payload = {
      amount: input.amount.toString(),
      currency: input.currency,
      email: input.email,
      first_name: input.first_name,
      last_name: input.last_name,
      phone_number: input.phone_number,
      tx_ref: input.tx_ref,
      callback_url: input.callback_url,
      return_url: input.return_url,
      customization: input.customization,
      meta: input.meta,
    }
    const res = await fetch(`${CHAPA_BASE}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    const data = (await res.json().catch(() => null)) as
      | { status?: string; message?: string; data?: { checkout_url?: string } }
      | null
    if (!res.ok || data?.status !== 'success' || !data?.data?.checkout_url) {
      throw new Error(
        `Chapa checkout init failed (${res.status}): ${data?.message ?? 'unknown error'}`,
      )
    }
    return { checkout_url: data.data.checkout_url, tx_ref: input.tx_ref, raw: data }
  }

  async verifyTransaction(tx_ref: string): Promise<ChapaVerifyResult> {
    if (!this.secretKey) {
      throw new Error('CHAPA_SECRET_KEY is not configured')
    }
    const res = await fetch(`${CHAPA_BASE}/transaction/verify/${encodeURIComponent(tx_ref)}`, {
      headers: { Authorization: `Bearer ${this.secretKey}` },
    })
    const data = (await res.json().catch(() => null)) as
      | {
          status?: string
          data?: {
            status?: string
            amount?: number | string
            currency?: string
            tx_ref?: string
            reference?: string
          }
        }
      | null
    if (!res.ok || !data) {
      throw new Error(`Chapa verify failed (${res.status})`)
    }
    const payment = data.data ?? {}
    const status: ChapaVerifyResult['status'] =
      payment.status === 'success'
        ? 'success'
        : payment.status === 'failed'
          ? 'failed'
          : 'pending'
    return {
      status,
      amount: Number(payment.amount ?? 0),
      currency: payment.currency ?? 'ETB',
      tx_ref: payment.tx_ref ?? tx_ref,
      reference: payment.reference ?? null,
      raw: data,
    }
  }

  verifyWebhookSignature(headers: Record<string, string | undefined>, rawBody: string): boolean {
    if (!this.webhookSecret) {
      throw new Error('CHAPA_WEBHOOK_SECRET is not configured')
    }
    const provided = headers['x-chapa-signature'] ?? headers['chapa-signature'] ?? ''
    if (!provided) return false
    const computed = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(rawBody, 'utf8')
      .digest('hex')
    if (provided.length !== computed.length) return false
    return crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(computed))
  }

  newTxRef(prefix = 'bb'): string {
    const r = crypto.randomBytes(8).toString('hex')
    return `${prefix}_${Date.now()}_${r}`
  }
}

export const chapaService = new ChapaService()
