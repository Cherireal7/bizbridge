/**
 * 9 top-level categories from MOR Directive 17/2011.
 * Mapped to sector_codes by their first digit (or first 2 for category 4/5 distinguished by their range).
 * Derived from Annex 1 ("አባሪ 1") of the directive.
 */

export interface SectorCategorySeed {
  slug: string
  name_en: string
  name_am: string
  icon: string
  sort_order: number
  /** First digit of the mor_code that maps to this category. */
  mor_prefix: string
}

export const CATEGORIES: SectorCategorySeed[] = [
  {
    slug: 'agriculture-hunting-forestry-fishing',
    name_en: 'Agriculture, hunting, forestry and fishing',
    name_am: 'ግብርና፣ አደን፣ የደን ልማትና ዓሳ ማስገር',
    icon: 'sprout',
    sort_order: 1,
    mor_prefix: '1',
  },
  {
    slug: 'mining-and-quarrying',
    name_en: 'Mining and quarrying',
    name_am: 'የማዕድን ቁፋሮና ኳሪይንግ',
    icon: 'pickaxe',
    sort_order: 2,
    mor_prefix: '2',
  },
  {
    slug: 'manufacturing',
    name_en: 'Manufacturing',
    name_am: 'ማኑፋክቸሪንግ',
    icon: 'factory',
    sort_order: 3,
    mor_prefix: '3',
  },
  {
    slug: 'electricity-gas-water-waste',
    name_en: 'Electricity, gas, steam, water supply and waste management',
    name_am: 'የኤሌክትሪክ፣ የጋዝ፣ የእንፋሎት፣ የውኃ አቅርቦትና የቆሻሻ አያያዝ',
    icon: 'zap',
    sort_order: 4,
    mor_prefix: '4',
  },
  {
    slug: 'construction',
    name_en: 'Construction',
    name_am: 'ኮንስትራክሽን',
    icon: 'hard-hat',
    sort_order: 5,
    mor_prefix: '5',
  },
  {
    slug: 'wholesale-retail-hotels-import-export',
    name_en: 'Wholesale and retail trade; repair, hotels and restaurants; import and export businesses',
    name_am: 'የጅምላና ችርቻሮ ንግድ፣ ጥገና፣ የሆቴልና ሬስቶራንት፣ የአስመጪነትና ላኪነት ስራዎች',
    icon: 'store',
    sort_order: 6,
    mor_prefix: '6',
  },
  {
    slug: 'transport-storage-communication',
    name_en: 'Transport, storage and communication',
    name_am: 'የትራንስፖርት፣ የመጋዘንና የኮሙኒኬሽን ስራዎች',
    icon: 'truck',
    sort_order: 7,
    mor_prefix: '7',
  },
  {
    slug: 'finance-insurance-real-estate-business',
    name_en: 'Financial intermediation, insurance, real estate and business services',
    name_am: 'የፋይናንስ፣ ኢንሹራንስ፣ የሪልስቴትና የንግድ ስራዎች',
    icon: 'landmark',
    sort_order: 8,
    mor_prefix: '8',
  },
  {
    slug: 'community-social-personal-services',
    name_en: 'Community, social and personal services',
    name_am: 'የማህበረሰብ፣ ማህበራዊና የግል አገልግሎቶች',
    icon: 'users',
    sort_order: 9,
    mor_prefix: '9',
  },
]

export function categoryForMorCode(morCode: string): SectorCategorySeed | null {
  const prefix = morCode.slice(0, 1)
  return CATEGORIES.find((c) => c.mor_prefix === prefix) ?? null
}
