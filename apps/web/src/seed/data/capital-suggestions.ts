/**
 * Curated capital-tier → sector-suggestion mapping. Used by /suggest to give
 * founders an idea of what business they can realistically open at their
 * budget in Ethiopia. Numbers are indicative starting capital in USD; ETB
 * conversion happens on the client.
 *
 * These are opinions, not official minimums. Actual capital requirements
 * depend on Ethiopian Investment Commission tiers (higher for foreigners,
 * see EIC guidelines) and sector-specific licences.
 */

export type CapitalTier = {
  key: string
  min_usd: number
  max_usd: number
  label: string
  headline: string
  vibe: string
  sector_codes: string[]
}

export const CAPITAL_TIERS: CapitalTier[] = [
  {
    key: 'micro',
    min_usd: 0,
    max_usd: 10_000,
    label: 'Micro',
    headline: 'Under $10k — start scrappy, keep it lean',
    vibe: 'Solo operator or small family business. Rented space, minimal inventory, mostly your own labour.',
    sector_codes: [
      '62114', // Minimarket
      '64118', // Cafe & breakfast
      '73147', // Internet cafe
      '11123', // Beekeeping
      '11122', // Poultry
      '39141', // Software dev (freelance)
      '85211', // Authorized accountant (solo)
      '86114', // Business consultancy
    ],
  },
  {
    key: 'small',
    min_usd: 10_000,
    max_usd: 50_000,
    label: 'Small',
    headline: '$10k–$50k — a real shop or a small team',
    vibe: 'A proper location, 3-10 employees, working capital for inventory or 6 months of salaries.',
    sector_codes: [
      '64114', // Restaurant
      '62113', // Supermarket
      '62513', // Retail computer equipment
      '11117', // Floriculture (small greenhouse)
      '31111', // Meat processing (small)
      '33112', // Apparel manufacture
      '61216', // Coffee/tea wholesale
      '86211', // Hotel/tourism consultancy
      '86311', // Health consultancy
      '72112', // Travel agency
    ],
  },
  {
    key: 'medium',
    min_usd: 50_000,
    max_usd: 500_000,
    label: 'Medium',
    headline: '$50k–$500k — hotels, factories, exporters',
    vibe: '10–50 staff, physical assets (kitchen, machines, showroom), regulated sector — need real financial planning.',
    sector_codes: [
      '64112', // Hotel (standard)
      '64113', // Star restaurant
      '85124', // Data center (small hosting)
      '35311', // Pharmaceuticals manufacture
      '51112', // Building contractor
      '66111', // Cereals export
      '66141', // Processed coffee export
      '66117', // Cut flowers export
      '62111', // Department store / mall (small)
      '21123', // Quarrying of minerals
    ],
  },
  {
    key: 'large',
    min_usd: 500_000,
    max_usd: 5_000_000,
    label: 'Large',
    headline: '$500k–$5M — investment-tier operations',
    vibe: 'Meets EIC foreign-investment capital thresholds. Star hotel, industrial-scale manufacturing, floriculture at scale.',
    sector_codes: [
      '64111', // Star hotel
      '11117', // Floriculture (industrial)
      '66141', // Coffee export at scale
      '35311', // Pharma manufacture (large)
      '39141', // Software house (team of 20+)
      '85124', // Data center (colocation)
      '21123', // Mining (formal)
      '86114', // Investment consultancy (retainer-scale)
    ],
  },
]

export function tierForUsd(amountUsd: number): CapitalTier {
  for (const t of CAPITAL_TIERS) {
    if (amountUsd >= t.min_usd && amountUsd < t.max_usd) return t
  }
  return CAPITAL_TIERS[CAPITAL_TIERS.length - 1]!
}
