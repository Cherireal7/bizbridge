/**
 * Featured partner directory. These are real local Bishoftu/Oromia/Ethiopia operators
 * we send our customers to. Outbound links are good for them (SEO) and for us (trust).
 *
 * Edit this list to add/remove featured partners. When the Partners Payload collection
 * lands, swap this for a DB query.
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
    slug: 'doxa-classic',
    name: 'Doxa Classic Restaurant',
    tagline: 'Highland dining, Bishoftu lakeside',
    description:
      'Refined Ethiopian + continental kitchen overlooking Lake Hora. Our reference for hospitality-sector operators — they share what scaling F&B in Bishoftu actually takes.',
    category: 'hospitality',
    url: 'https://doxaclassic.example',
    city: 'Bishoftu',
    initials: 'Dx',
    tint: 'brand',
    featured: true,
  },
  {
    slug: 'feeder-delivery',
    name: 'Feeder Delivery',
    tagline: 'Last-mile delivery, Bishoftu + Addis corridor',
    description:
      'Same-day delivery network covering Bishoftu, Modjo, and the Addis road. Our go-to logistics partner for new F&B and retail operators getting product out the door.',
    category: 'logistics',
    url: 'https://feederdelivery.example',
    city: 'Bishoftu',
    initials: 'Fd',
    tint: 'warm',
    featured: true,
  },
  {
    slug: 'lake-tech-collective',
    name: 'Lake Tech Collective',
    tagline: 'Software & IT setup for Bishoftu SMEs',
    description:
      'POS, inventory, accounting software setup. Configures Loyverse / Wave / TallyPrime for local operators. Handles wifi, networking, and basic IT.',
    category: 'software',
    url: 'https://laketech.example',
    city: 'Bishoftu',
    initials: 'Lt',
    tint: 'cool',
  },
  {
    slug: 'addis-business-law',
    name: 'Addis Business Law',
    tagline: 'Commercial registration, contracts, compliance',
    description:
      'Boutique business-law practice handling commercial registrations, foreign investor onboarding, and contract review. Our lawyer-consultation partner for Pro members.',
    category: 'legal',
    url: 'https://addisbizlaw.example',
    city: 'Addis Ababa',
    initials: 'AB',
    tint: 'brand',
  },
  {
    slug: 'oromia-accounting',
    name: 'Oromia Accounting Group',
    tagline: 'Bookkeeping, tax, VAT registration',
    description:
      'Local CPA-level firm specializing in new-business onboarding — TIN, VAT, payroll, and the first-year compliance cycle.',
    category: 'accounting',
    url: 'https://oromiaaccg.example',
    city: 'Adama',
    initials: 'OA',
    tint: 'sand',
  },
  {
    slug: 'bishoftu-marketing-co',
    name: 'Bishoftu Marketing Co.',
    tagline: 'Brand, social, web for local businesses',
    description:
      'Branding and social-media partner for hospitality and retail launches. Handles photography, menu design, Google Business setup, and the first 90 days of content.',
    category: 'marketing',
    url: 'https://bishoftumarketing.example',
    city: 'Bishoftu',
    initials: 'BM',
    tint: 'warm',
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
