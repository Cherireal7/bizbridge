/**
 * MOR Directive 17/2011 English sector names come out of the PDF word-glued
 * ("Growingofcereals", "Softwaredevelopment(includingdesign,enrichmentand
 * implementation)"). This helper reconstructs proper spacing.
 *
 * Two mechanisms:
 *  1. OVERRIDES — hand-cleaned strings keyed by mor_code.
 *  2. Heuristic split with strict validation: prefer intact tokens; only
 *     accept a split when every resulting fragment is either a known word or
 *     ≥ 3 chars. Prevents "Floriculture" → "Fl or iculture" and similar.
 */

const OVERRIDES: Record<string, string> = {
  '39141': 'Software development (including design, enrichment, and implementation)',
  '72131': 'Computer network design and cable installation',
  '92191': 'Services of theater, music, film, modeling, dance, video, and photography',
  '62111': 'Wholesale of photo, graphics, and visual equipment',
  '62222': 'Import trade in communication, computer, and related equipment',
  '62223': 'Export trade in communication, computers, and computer peripherals',
  '62224': 'Wholesale trade in communication and computer hardware',
  '63124': 'Retail trade of computers, computer equipment, and related appliances',
}

// Vocabulary the MOR directive actually uses. Sorted longest-first for greedy
// left-to-right matching. Words are lowercase; case is preserved from input.
const WORDS: string[] = [
  // 12+
  'commercialization', 'commercialisation', 'transportation', 'implementation',
  'confectionery', 'certification', 'refrigeration', 'entertainment',
  'authorization', 'organization', 'preparation', 'communication', 'installation',
  'construction', 'establishment', 'international', 'professional', 'accommodation',
  'distribution', 'photojournalism', 'commissioning', 'consultation', 'preservation',
  'registration',
  // 10-11
  'photography', 'manufacture', 'manufacturing', 'pharmaceutical', 'agricultural', 'consultancy',
  'engineering', 'accessories', 'stationery', 'commercial', 'residential',
  'industrial', 'traditional', 'renovation', 'automotive', 'electronic',
  'management', 'maintenance', 'processing', 'production', 'operations',
  'consulting', 'compliance', 'insurance', 'medicines', 'medicinal',
  'community', 'household', 'furniture', 'furnishing', 'facilities',
  'refinishing', 'contractor', 'contractors', 'quarrying', 'ministries',
  'certificate', 'certificates', 'consultant', 'consultants', 'containers',
  'appliances',
  // 8-9
  'wholesale', 'personal', 'services', 'activity', 'activities', 'products',
  'container', 'transport', 'planting', 'catering', 'training', 'delivery',
  'shipping', 'lighting', 'plumbing', 'painting', 'flooring', 'roofing',
  'welding', 'clothing', 'garments', 'footwear', 'textiles', 'ceramics',
  'plastics', 'graphics', 'workshop', 'workshops', 'domestic', 'fisheries',
  'beverages', 'medicine', 'brokerage', 'delegate', 'delegating',
  'agriculture', 'animals', 'livestock', 'petroleum', 'minerals', 'chemicals',
  'equipment', 'personnel', 'facility', 'authority', 'authorities',
  'accounting', 'auditing', 'marketing', 'stadium', 'extraction', 'evaporation',
  'excavation', 'exploration', 'digging', 'trapping', 'propagation',
  'producing', 'processing', 'preserving', 'edible',
  'fertilizers', 'fertilizer', 'support', 'related', 'similar', 'except',
  'seafood', 'ordinary', 'husbandry', 'husbandery', 'hunting', 'fishing',
  'cattle', 'sheep', 'goat', 'goats', 'camel', 'camels', 'donkey', 'donkeys',
  'silkworm', 'silkworms', 'poultry', 'pack', 'sea', 'their', 'fast',
  'animal', 'fodder', 'bird', 'game', 'yarn', 'yarns',
  'development', 'developments', 'starches', 'starch', 'noodles', 'macaroni',
  'pasta', 'cocoa', 'chocolate', 'candy', 'chewing', 'biscuits', 'biscuit',
  'bakery', 'confectionery', 'noodle', 'couscous', 'gum',
  'potable', 'alcohol', 'tobacco',
  'dairy', 'grinding', 'ground',
  'article', 'articles', 'spinning', 'weaving', 'apparel', 'textile',
  'fur', 'carpet', 'carpets', 'rugs', 'mat', 'mats',
  'tanning', 'finishing', 'hide', 'hides',
  'artificial', 'substitute', 'substitutes', 'wearing', 'wearings',
  'printing', 'pulp', 'paperboard', 'paperboards',
  'wooden', 'wood', 'bag', 'bags', 'sack', 'sacks',
  'wrap', 'wrapping', 'rapping', 'pack', 'packing', 'packaging',
  'material', 'materials', 'product', 'knitted', 'crocheted',
  'fabric', 'fabrics', 'salt', 'flour', 'grinding', 'ground',
  'made', 'make', 'used', 'basic', 'coke', 'oven',
  'primary', 'purpose', 'purposes', 'general', 'special',
  'plastics', 'plastic', 'synthetic', 'rubber', 'tires', 'tire',
  'batteries', 'battery', 'pesticides', 'pesticide', 'agrochemical',
  'paints', 'paint', 'varnish', 'varnishes', 'coating', 'coatings',
  'ink', 'inks', 'mastic', 'precursor',
  'cleaning', 'cosmetics', 'input', 'inputs', 'concrete',
  'cement', 'lime', 'plaster', 'glass', 'glasses',
  'metal', 'metals', 'metallic', 'nonmetallic',
  'nonferrous', 'ferrous', 'precious', 'aluminum', 'zinc', 'lid',
  'tantalum', 'nickel', 'copper',
  'structural', 'forging', 'pressing', 'stamping', 'metallurgy',
  'powder', 'roll', 'formingof', 'formed', 'forming',
  'weapons', 'ammunition', 'electrical', 'utility', 'utilities',
  'apparatus', 'machinery', 'machineries', 'machine', 'machines',
  'spare', 'parts', 'radiation', 'emitting', 'radioactive', 'source',
  'sources', 'radio', 'photographic', 'optical', 'instrument', 'instruments',
  'medical', 'appliance', 'appliances',
  'bicycle', 'bicycles', 'carriage', 'carriages',
  'trailer', 'trailers', 'railway', 'tramway', 'locomotive', 'locomotives',
  'rolling', 'stock', 'aircraft', 'spacecraft', 'aerospace',
  'produce', 'spring', 'springs', 'sponge', 'sponges', 'foam',
  'computer', 'computers', 'recreational', 'handicrafts', 'handicraft',
  'souvenir', 'souvenirs', 'artifact', 'artifacts', 'jewelry', 'jewelries',
  'stationary', 'stationery', 'button', 'buttons', 'buckle', 'buckles',
  'slide', 'fastener', 'fasteners', 'number', 'plate', 'plates',
  'sign', 'signs', 'display', 'displays', 'advertising',
  'recycling', 'waste', 'scrap', 'scraps',
  'brush', 'brushes', 'broom', 'brooms',
  'educational', 'chicken', 'checking',
  'generating', 'electricity', 'transmission', 'sale', 'electric', 'extending',
  'lines', 'transferring',
  'sanitary', 'perfumery', 'surgical', 'bone', 'controlling', 'navigation',
  'navigational', 'precision', 'measurement', 'measurements',
  'laboratory', 'kerosene', 'lubricants', 'lubricant', 'fuel', 'sporting',
  'sports', 'logs', 'log', 'greenhouse', 'greenhouses', 'geomembrane',
  'administration', 'operation', 'operations', 'road', 'roads', 'toll',
  'tollroad', 'tollroads', 'cable', 'cables', 'setup', 'storage',
  'warehousing', 'warehouse', 'customs', 'bonded',
  'finance', 'financing', 'institution', 'institutions',
  'removing', 'removal', 'bleach', 'contaminant', 'contaminants',
  'nitrogen', 'compound', 'compounds', 'agricultural',
  'inside', 'outside', 'inner', 'outer', 'value', 'added',
  'human', 'health', 'supplies', 'supply', 'medical', 'scientific',
  'testing', 'test', 'tests', 'testing',
  'wars', 'wear', 'goods', 'except', 'retail', 'food', 'education',
  'trades', 'crops', 'security', 'securities', 'dealing',
  'estimate', 'estimates', 'damage', 'damages', 'fixed', 'mobile',
  'property', 'properties', 'estimated',
  'assets', 'asset',
  'occupational', 'safety', 'health', 'protection', 'environmental',
  'per', 'pre', 'primary', 'secondary', 'tertiary', 'higher',
  'lower', 'centre', 'centres', 'college', 'colleges', 'boundary',
  'cross', 'short', 'long', 'term', 'terms', 'training',
  'technical', 'vocational', 'kindergarten', 'kg',
  'local', 'abroad', 'recruitment', 'linkage', 'linkages',
  'labor', 'labour', 'diagnostic', 'imaging',
  'clinic', 'clinics', 'supplementary', 'care',
  'legal', 'commercial', 'security',
  'raising', 'growing',
  'houses', 'house', 'housing', 'including', 'included',
  'cultivation', 'cultivating', 'cultivate',
  'renovation', 'recreation', 'operation', 'operational',
  'documentation', 'representation', 'representative',
  'application', 'foundation', 'orientation',
  'demonstration', 'transformation',
  'preparation', 'presentation', 'protection', 'production',
  'promotion', 'promotional', 'promotions',
  'reception', 'inspection', 'connection',
  'installation', 'situation',
  'combination', 'coordination',
  'television', 'program', 'programs', 'programme', 'programmes',
  'studio', 'studios', 'recording', 'records',
  'films', 'film', 'theatre', 'theater',
  'wildlife', 'taxidermy',
  'book', 'books', 'bookstore', 'library', 'libraries',
  'historic', 'building', 'buildings', 'cite', 'cites', 'sites',
  'recreation', 'recreations',
  'men', 'women', 'ladies', 'boys', 'girls',
  'hair', 'hairdressing', 'dressing',
  'different', 'differences', 'event', 'events', 'decorating',
  'decoration', 'decorations', 'decorative',
  'green', 'inside', 'outside', 'machine', 'machines',
  // 6-7
  'raising', 'growing', 'breeding', 'fishing', 'hunting', 'planting',
  'mining', 'trading', 'export', 'import', 'buying', 'selling',
  'service', 'repair', 'rental', 'agency', 'freight', 'related',
  'various', 'general', 'specific', 'network', 'system', 'systems',
  'centre', 'center', 'design', 'apparel', 'jewelry', 'jewellery',
  'garment', 'leather', 'cotton', 'coffee', 'sugarcane', 'pulses',
  'pepper', 'spices', 'flower', 'flowers', 'birds', 'poultry',
  'fisheries', 'seafood', 'grains', 'cereals', 'fruits', 'fruit',
  'vegetable', 'vegetables', 'plants', 'floriculture', 'beekeeping',
  'silkworm', 'silkworms', 'hatcheries', 'forestry', 'natural', 'crude',
  'exploration', 'quarry', 'stone', 'stones', 'brick', 'bricks',
  'tile', 'tiles', 'sand', 'gravel', 'metals', 'metal',
  'iron', 'steel', 'timber', 'paper', 'rubber', 'plastic',
  'software', 'hardware', 'business', 'company', 'refined', 'refinery',
  'refineries', 'balance', 'measure', 'measures', 'measuring', 'balance',
  'ordinary', 'special', 'operational',
  // 5
  'trade', 'grain', 'sugar', 'honey', 'water', 'power', 'energy',
  'wheat', 'barley', 'goods', 'items', 'foods', 'nuts',
  'store', 'shop', 'shops', 'market', 'office', 'motor', 'motors',
  'vehicle', 'vehicles', 'video', 'photo', 'movie', 'audio', 'music',
  'dance', 'model', 'plant', 'seed', 'seeds', 'salt', 'wear', 'wears',
  'small', 'large', 'medium', 'micro', 'metal', 'boats', 'ships',
  'buses', 'trucks', 'load', 'unload', 'loading', 'unloading',
  'collect', 'collection', 'delegate', 'other', 'others', 'crops',
  'meats',
  // 4
  'hotel', 'motel', 'lodge', 'resort', 'shop', 'cafe',
  'wood', 'iron', 'silk', 'wool', 'meat', 'fish', 'oil', 'oils',
  'sale', 'sales', 'rent', 'ship', 'boat', 'gold', 'tour',
  'from', 'with', 'into', 'onto', 'upon', 'that', 'this', 'each',
  'both', 'more', 'less', 'high', 'best', 'high',
  // 3 — connectors + short domain words
  'and', 'the', 'for', 'new', 'raw', 'own', 'net',
  'tea', 'ore', 'gas', 'egg', 'car', 'bus', 'air',
  // 2 — only connectors, guarded by the length-3+ rule below
  'of', 'in', 'on', 'at', 'to', 'by', 'as', 'or', 'up',
]

const DICTIONARY = [...new Set(WORDS)].sort((a, b) => b.length - a.length)
const WORD_SET = new Set(DICTIONARY)
const CONNECTORS = new Set(['of', 'in', 'on', 'at', 'to', 'by', 'as', 'or', 'and', 'the', 'for'])

/**
 * Segment a stuck token into words using dynamic programming to find the
 * lowest-cost segmentation. Every fragment must be either a known dictionary
 * word or ≥ 4 chars of pure unknown; short non-connector fragments carry a
 * high penalty. Returns the token unchanged if no valid segmentation exists.
 */
function splitStuckToken(token: string): string {
  const lower = token.toLowerCase()
  if (lower.length <= 4) return token
  if (WORD_SET.has(lower)) return token

  const n = lower.length
  // dp[i] = { cost, prev, wordLen } for best segmentation of lower[0..i]
  const dp: Array<{ cost: number; prev: number; wordLen: number } | null> = new Array(n + 1).fill(null)
  dp[0] = { cost: 0, prev: -1, wordLen: 0 }

  const cost = (frag: string): number => {
    if (WORD_SET.has(frag)) {
      // Bonus for known words — the longer the better.
      if (CONNECTORS.has(frag)) return -0.5
      return -1 - Math.min(1, frag.length / 12)
    }
    // Unknown fragment: reject short ones outright (< 4 chars). Longer ones
    // carry a moderate positive cost so DP still prefers segmentations with
    // more known-word fragments.
    if (frag.length < 4) return 999
    return 3
  }

  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      const prev = dp[j]
      if (!prev) continue
      const frag = lower.substring(j, i)
      const c = prev.cost + cost(frag)
      if (dp[i] === null || c < dp[i]!.cost) {
        dp[i] = { cost: c, prev: j, wordLen: i - j }
      }
    }
  }

  const best = dp[n]
  if (!best) return token
  // If total cost is huge, the segmentation is bad — leave the token intact.
  if (best.cost > 50) return token

  // Reconstruct segments
  const spans: { start: number; end: number }[] = []
  let cur = n
  while (cur > 0) {
    const step = dp[cur]!
    spans.unshift({ start: step.prev, end: cur })
    cur = step.prev
  }

  // Reject single-fragment (no split) as unchanged.
  if (spans.length <= 1) return token

  // Reject if any fragment is < 3 chars AND not a connector.
  for (const s of spans) {
    const frag = lower.substring(s.start, s.end)
    if (frag.length < 3 && !CONNECTORS.has(frag)) return token
  }

  return spans.map((s) => token.substring(s.start, s.end)).join(' ')
}

export function humanizeSectorName(morCode: string | null | undefined, name: string): string {
  if (!name) return ''
  if (morCode && OVERRIDES[morCode]) return OVERRIDES[morCode]

  // Normalise punctuation spacing first.
  let s = name
    .replace(/\s+/g, ' ')
    .replace(/([(])\s*/g, ' $1')
    .replace(/\s*([)])/g, '$1 ')
    .replace(/\s*([,;:])\s*/g, '$1 ')
    .replace(/\s+/g, ' ')
    .trim()

  // Handle any explicit CamelCase.
  s = s.replace(/([a-z])([A-Z])/g, '$1 $2')

  // Split any remaining stuck-word tokens using the dictionary. Also treat
  // `/` and `-` as splitters that don't get consumed themselves.
  const tokens = s.split(/(\s+|[(),/-])/)
  const rebuilt = tokens
    .map((t) => (/^[\s(),/-]+$/.test(t) ? t : splitStuckToken(t)))
    .join('')
    .replace(/\s+/g, ' ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\s+([,;:])/g, '$1')
    .trim()

  // Capitalise the first letter for headings.
  return rebuilt.charAt(0).toUpperCase() + rebuilt.slice(1)
}
