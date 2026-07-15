/**
 * Featured partner directory. Real local operators we send our customers to.
 *
 * TODO: Cheri to confirm URLs for Doxa Innovations and BR Photography (marked
 * "#" below) before public deploy. Fida Delivery URL is live.
 */

export type PartnerCategory =
  | 'hospitality'
  | 'logistics'
  | 'software'
  | 'legal'
  | 'accounting'
  | 'marketing'

export interface Partner {
  slug: string
  name: string
  tagline: string
  description: string
  category: PartnerCategory
  url: string
  city: string
  /** Initials shown as a brand mark when we don't have a real logo asset. */
  initials: string
  /** Optional tint for the brand mark. */
  tint?: 'brand' | 'warm' | 'cool' | 'sand'
  featured?: boolean
}

export const PARTNERS: Partner[] = [
  {
    slug: 'fida-delivery',
    name: 'Fida Delivery',
    tagline: 'On-demand delivery across Bishoftu',
    description:
      'Bishoftu-first delivery network — food, retail, courier, and last-mile logistics for local operators. Customer + rider apps, live dispatch, SOS support.',
    category: 'logistics',
    url: 'https://fidadelivery.et',
    city: 'Bishoftu',
    initials: 'Fd',
    tint: 'warm',
    featured: true,
  },
  {
    slug: 'doxa-innovations',
    name: 'Doxa Innovations',
    tagline: 'Software, product design, and technical build-outs',
    description:
      'End-to-end product studio building web + mobile apps for Ethiopian operators. Design, engineering, and post-launch support under one roof.',
    category: 'software',
    url: '#',
    city: 'Bishoftu',
    initials: 'Dx',
    tint: 'brand',
    featured: true,
  },
  {
    slug: 'br-photography',
    name: 'BR Photography',
    tagline: 'Brand + event photography, Bishoftu & Addis',
    description:
      'Product, brand, and event photography for hospitality and retail launches. Menu shoots, portraits, on-location work.',
    category: 'marketing',
    url: '#',
    city: 'Bishoftu',
    initials: 'BR',
    tint: 'cool',
    featured: true,
  },
]

export const CATEGORY_LABELS: Record<PartnerCategory, string> = {
  hospitality: 'Hospitality · F&B',
  logistics: 'Logistics · Delivery',
  software: 'Software · IT',
  legal: 'Legal · Compliance',
  accounting: 'Accounting · Tax',
  marketing: 'Marketing · Branding',
}

export const CATEGORY_ORDER: PartnerCategory[] = [
  'hospitality',
  'logistics',
  'software',
  'legal',
  'accounting',
  'marketing',
]
