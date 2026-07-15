/**
 * The MOR Directive 17/2011 source PDF has word-glued English sector names
 * like "Softwaredevelopment(includingdesign,enrichmentand implementation)".
 * This helper renders a readable version at display time — no DB rewrite.
 *
 * Two mechanisms:
 * 1. OVERRIDES — hand-cleaned strings keyed by mor_code for high-traffic
 *    sectors we know will get the most eyeballs.
 * 2. Heuristic — greedy longest-match against a curated MOR-domain word list,
 *    plus punctuation spacing. Not perfect for every sector, but reduces the
 *    word-salad effect meaningfully across all 519.
 */

const OVERRIDES: Record<string, string> = {
  '39141': 'Software development (including design, enrichment, and implementation)',
  '72131': 'Computer network design and cable installation',
  '92191': 'Services of theater, music, film, modeling, dance, video, and photography — design works, etc.',
  '62111': 'Wholesale of photo, graphics, and visual equipment',
  '62222': 'Import trade in communication, computer, and related equipment',
  '62223': 'Export trade in communication, computers, computer peripheral equipment, and accessories',
  '62224': 'Wholesale trade in communication, computer hardware, and peripheral equipment',
  '63124': 'Retail trade of computer, computer equipment, and related appliances',
}

// Ordered longest-first so greedy match prefers "development" over "develop"
// and "software" over "soft". Only include words that plausibly appear in the
// MOR directive — no need for a full English dictionary.
const DICTIONARY = [
  // 12+ chars
  'photojournalism', 'transportation', 'implementation', 'communication', 'construction',
  'establishment', 'installation', 'manufacturing', 'international', 'professional',
  'accommodation', 'refrigeration', 'distribution', 'confectionery', 'entertainment',
  'commissioning', 'consultation', 'preservation', 'commercialisation', 'commercialization',
  'certification', 'registration', 'authorization', 'organization', 'preparation',
  'refinishing', 'photography', 'pharmaceutical', 'restaurants', 'agricultural',
  'accessories', 'photograph', 'engineering', 'processing', 'production', 'operations',
  'management', 'maintenance', 'accounting', 'marketing', 'compliance', 'insurance',
  'consulting', 'consultants', 'consultant', 'automotive', 'electronic', 'residential',
  'commercial', 'industrial', 'traditional', 'renovation', 'stationery', 'workshops',
  'livestock', 'medicinal', 'medicines', 'chemicals', 'including', 'additional',
  'community', 'household', 'furniture', 'furnishing', 'appliance', 'appliances',
  'equipment', 'personnel', 'facility', 'facilities', 'ministries', 'authority',
  'authorities', 'certificate', 'certificates', 'documents', 'templates', 'installation',
  'delegating',

  // 9-10 chars
  'agricultural', 'wholesale', 'personal', 'services', 'activity', 'products',
  'container', 'transport', 'planting', 'catering', 'training', 'delivery',
  'shipping', 'lighting', 'plumbing', 'painting', 'flooring', 'roofing', 'welding',
  'clothing', 'garments', 'footwear', 'textiles', 'ceramics', 'plastics', 'graphics',
  'workshop', 'domestic', 'fisheries', 'beverages', 'medicine', 'traditional',
  'brokerage', 'brokerage', 'brokerage', 'related', 'various', 'general', 'specific',

  // 6-8 chars
  'software', 'hardware', 'business', 'company', 'design', 'growing', 'raising',
  'breeding', 'fishing', 'hunting', 'mining', 'quarrying', 'trading', 'export',
  'import', 'sales', 'buying', 'selling', 'service', 'repair', 'rental', 'agency',
  'freight', 'goods', 'items', 'foods', 'grains', 'cereals', 'wheat', 'barley',
  'coffee', 'sugar', 'honey', 'water', 'power', 'energy', 'metal', 'metals',
  'iron', 'steel', 'wood', 'timber', 'paper', 'glass', 'stone', 'rubber',
  'plastic', 'leather', 'cotton', 'silk', 'wool', 'small', 'large', 'medium',
  'micro', 'store', 'shop', 'shops', 'market', 'office', 'factory', 'plant',
  'hotel', 'motel', 'lodge', 'resort', 'restaurant', 'cafe', 'bar', 'bakery',
  'clinic', 'hospital', 'school', 'college', 'video', 'photo', 'film', 'movie',
  'audio', 'music', 'dance', 'theater', 'model', 'modeling', 'network', 'cable',
  'system', 'systems', 'centre', 'center', 'centers', 'boat', 'boats', 'ship',
  'trucks', 'buses', 'motor', 'motors', 'vehicle', 'vehicles', 'wear', 'wears',
  'stone', 'stones', 'brick', 'bricks', 'tile', 'tiles', 'sand', 'gravel',
  'dairy', 'butter', 'cheese', 'yogurt', 'meat', 'poultry', 'fish', 'seafood',
  'fruit', 'fruits', 'vegetable', 'vegetables', 'flower', 'flowers', 'plant',
  'plants', 'seed', 'seeds', 'oil', 'oils', 'balance', 'scale', 'weight',
  'measure', 'measures', 'measuring', 'load', 'unload', 'loading', 'unloading',
  'collect', 'collection', 'collecting', 'delegate', 'delegating', 'other', 'others',

  // 4-5 chars
  'trade', 'grain', 'salt', 'tea', 'nuts', 'jute',
  'from', 'with', 'into', 'onto', 'upon', 'that', 'this', 'each', 'both',
  'more', 'less', 'high', 'low',

  // 3 chars (careful — sort last so longer matches take priority)
  'and', 'the', 'for', 'new', 'raw', 'own', 'net',

  // 2 chars — the tiny connectors that show up in MOR names constantly
  'of', 'in', 'on', 'at', 'to', 'by', 'as', 'or', 'up',
].sort((a, b) => b.length - a.length)

function splitStuckToken(token: string): string {
  const lower = token.toLowerCase()
  if (lower.length <= 3) return token

  const out: string[] = []
  let i = 0
  let carry = ''

  while (i < lower.length) {
    let matched: string | null = null
    for (const w of DICTIONARY) {
      if (w.length > lower.length - i) continue
      if (lower.substring(i, i + w.length) === w) {
        matched = w
        break
      }
    }
    if (matched) {
      if (carry) out.push(carry)
      out.push(token.substring(i, i + matched.length))
      carry = ''
      i += matched.length
    } else {
      carry += token[i]
      i++
    }
  }
  if (carry) out.push(carry)
  return out.join(' ')
}

export function humanizeSectorName(morCode: string | null | undefined, name: string): string {
  if (!name) return ''
  if (morCode && OVERRIDES[morCode]) return OVERRIDES[morCode]

  // Normalise punctuation spacing first
  let s = name
    .replace(/\s+/g, ' ')
    .replace(/([(])\s*/g, ' $1')
    .replace(/\s*([)])/g, '$1 ')
    .replace(/\s*([,;:])\s*/g, '$1 ')
    .replace(/\s+/g, ' ')
    .trim()

  // Handle any explicit CamelCase (rare here but harmless)
  s = s.replace(/([a-z])([A-Z])/g, '$1 $2')

  // Split any remaining stuck-word tokens using the dictionary
  const tokens = s.split(/(\s+|[(),])/)
  const rebuilt = tokens
    .map((t) => (/^[\s(),]+$/.test(t) ? t : splitStuckToken(t)))
    .join('')
    .replace(/\s+/g, ' ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\s+([,;:])/g, '$1')
    .trim()

  // Capitalise the first letter for headings
  return rebuilt.charAt(0).toUpperCase() + rebuilt.slice(1)
}
