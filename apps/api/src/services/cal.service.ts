import { env } from '../env.js'

export interface CalAvailabilityRange {
  start: string
  end: string
}

export class CalService {
  async getAvailability(_calUsername: string): Promise<CalAvailabilityRange[]> {
    if (!env.CAL_API_KEY) throw new Error('CAL_API_KEY not configured')
    throw new Error('CalService.getAvailability not implemented — Phase 3')
  }

  async createBooking(_input: {
    calUsername: string
    startsAt: string
    durationMinutes: number
    attendeeEmail: string
    attendeeName: string
    notes?: string
  }): Promise<{ booking_id: string }> {
    if (!env.CAL_API_KEY) throw new Error('CAL_API_KEY not configured')
    throw new Error('CalService.createBooking not implemented — Phase 3')
  }
}

export const calService = new CalService()
