/**
 * Verification bodies (ብቃት አረጋጋጭ) and licensing authorities (ፈቃድ ሰጪ)
 * referenced in MOR Directive 17/2011. Codes come from the abbreviation key in the directive itself.
 *
 * Each `verif_lic_en` field in sectors.json is a concatenation of the verification-body
 * code followed by the licensing-authority code (e.g. "MOARTB" = "MOA" + "RTB"). The
 * splitter below uses a longest-prefix match against the registry.
 */

export interface Authority {
  code: string
  name_en: string
  name_am: string
  short_am: string
  level: 'federal' | 'regional'
  is_ministry: boolean
}

export const AUTHORITIES: Authority[] = [
  { code: 'MOTI', name_en: 'Ministry of Trade and Industry', name_am: 'የንግድና ኢንዱስትሪ ሚኒስቴር', short_am: 'ን/ኢ/ሚ', level: 'federal', is_ministry: true },
  { code: 'RTB', name_en: 'Regional Trade Bureau', name_am: 'የክልል ንግድ መስሪያ ቤት', short_am: 'ክ/ን/መ/ቤት', level: 'regional', is_ministry: false },
  { code: 'MOCT', name_en: 'Ministry of Culture and Tourism', name_am: 'የባህልና ቱሪዝም ሚኒስቴር', short_am: 'ባ/ቱ/ሚ', level: 'federal', is_ministry: true },
  { code: 'MOE', name_en: 'Ministry of Education', name_am: 'የትምህርት ሚኒስቴር', short_am: 'ት/ሚ', level: 'federal', is_ministry: true },
  { code: 'MOA', name_en: 'Ministry of Agriculture', name_am: 'የግብርና ሚኒስቴር', short_am: 'ግ/ሚ', level: 'federal', is_ministry: true },
  { code: 'MOUDC', name_en: 'Ministry of Urban Development and Construction', name_am: 'የከተማ ልማትና ኮንስትራክሽን ሚኒስቴር', short_am: 'ከ/ል/ኮ/ሚ', level: 'federal', is_ministry: true },
  { code: 'MOWIE', name_en: 'Ministry of Water, Irrigation and Energy', name_am: 'የውሃ፣ መስኖና ኢነርጂ ሚኒስቴር', short_am: 'ው/መ/ኢ/ሚ', level: 'federal', is_ministry: true },
  { code: 'MOMP', name_en: 'Ministry of Mines and Petroleum', name_am: 'የማዕድንና ነዳጅ ሚኒስቴር', short_am: 'ማ/ነ/ሚ', level: 'federal', is_ministry: true },
  { code: 'MOIT', name_en: 'Ministry of Innovation and Technology', name_am: 'የኢኖቬሽንና ቴክኖሎጂ ሚኒስቴር', short_am: 'ኢ/ቴ/ሚ', level: 'federal', is_ministry: true },
  { code: 'MOLSA', name_en: 'Ministry of Labor and Social Affairs', name_am: 'የሠራተኛና ማህበራዊ ጉዳይ ሚኒስቴር', short_am: 'ሰ/ማ/ጉ/ሚ', level: 'federal', is_ministry: true },
  { code: 'MOR', name_en: 'Ministry of Revenue', name_am: 'የገቢዎች ሚኒስቴር', short_am: 'ገ/ሚ', level: 'federal', is_ministry: true },
  { code: 'MOTR', name_en: 'Ministry of Transport', name_am: 'የትራንስፖርት ሚኒስቴር', short_am: 'ት/ሚ', level: 'federal', is_ministry: true },
  { code: 'SC', name_en: 'Sport Commission', name_am: 'የስፖርት ኮሚሽን', short_am: 'ስ/ኮ', level: 'federal', is_ministry: false },
  { code: 'EFCC', name_en: 'Environment, Forest and Climate Change Commission', name_am: 'የአካባቢ፣ ደንና የአየር ንብረት ለውጥ ኮሚሽን', short_am: 'አ/ደ/የአ/ን/ኮ', level: 'federal', is_ministry: false },
  { code: 'FMHACA', name_en: 'Ethiopian Food, Medicine and Healthcare Administration and Control Authority', name_am: 'የኢትዮጵያ የምግብ፣ የመድኃኒትና የጤና ክብካቤ አስተዳደርና ቁጥጥር ባለስልጣን', short_am: 'ም/መ/ጤ/አ/ቁ/ባ', level: 'federal', is_ministry: false },
  { code: 'EGIA', name_en: 'Ethiopian Geospatial Information Agency', name_am: 'የኢትዮጵያ ጂኦስፓሻል ኢንፎርሜሽን ኤጀንሲ', short_am: 'ኢ/ጂ/ኢ/ኤ', level: 'federal', is_ministry: false },
  { code: 'ENAO', name_en: 'Ethiopian National Accreditation Office', name_am: 'የኢትዮጵያ ብሔራዊ አክሬዲቴሽን ጽ/ቤት', short_am: 'ኢ/ብ/አ/ጽ', level: 'federal', is_ministry: false },
  { code: 'NMI', name_en: 'National Metrology Institute', name_am: 'ብሔራዊ የስነ-ልክ ኢንስቲትዩት', short_am: 'ብ/ስ/ኢ', level: 'federal', is_ministry: false },
  { code: 'HERQA', name_en: 'Higher Education Relevance and Quality Agency', name_am: 'የከፍተኛ ትምህርት አግባብነትና ጥራት ኤጀንሲ', short_am: 'ከ/ት/አ/ጥ/ኤ', level: 'federal', is_ministry: false },
  { code: 'FTVETA', name_en: 'Federal Technical and Vocational Education Training Agency', name_am: 'የፌደራል የቴክኒክና ሙያ ትምህርት ስልጠና ኤጀንሲ', short_am: 'ፌ/ቴ/ሙ/ት/ስ/ኤ', level: 'federal', is_ministry: false },
  { code: 'MAA', name_en: 'Maritime Affairs Authority', name_am: 'የማሪታይም ጉዳይ ባለስልጣን', short_am: 'ማ/ጉ/ባ', level: 'federal', is_ministry: false },
  { code: 'EWCPA', name_en: 'Ethiopian Wildlife Conservation and Protection Authority', name_am: 'የኢትዮጵያ የዱር እንስሳት ጥበቃና ልማት ባለስልጣን', short_am: 'ኢ/ዱ/ል/ጥ/ባ', level: 'federal', is_ministry: false },
  { code: 'ERPA', name_en: 'Ethiopian Radiation Protection Authority', name_am: 'የኢትዮጵያ ጨረራ መከላከያ', short_am: 'ኢ/ጨ/መ/ባ', level: 'federal', is_ministry: false },
  { code: 'EHAIA', name_en: 'Ethiopian Horticulture and Agricultural Investment Authority', name_am: 'የኢትዮጵያ ሆርቲካልቸርና ግብርና ኢንቨስትመንት ባለስልጣን', short_am: 'ኢ/ሆ/ግ/ኢ/ባ', level: 'federal', is_ministry: false },
  { code: 'EMI', name_en: 'Ethiopian Management Institute', name_am: 'የኢትዮጵያ ስራ አመራር ኢንስቲትዩት', short_am: 'ኢ/ሥ/አ/ኢ', level: 'federal', is_ministry: false },
  { code: 'ECAA', name_en: 'Ethiopian Civil Aviation Authority', name_am: 'የኢትዮጵያ ሲቪል አቬሽን ባለስልጣን', short_am: 'ኢ/ሲ/አ/ባ', level: 'federal', is_ministry: false },
  { code: 'CAA', name_en: 'Civil Aviation Authority', name_am: 'ሲቪል አቬሽን ባለስልጣን', short_am: 'ኢ/ሲ/አ/ባ', level: 'federal', is_ministry: false },
  { code: 'FTA', name_en: 'Federal Transport Authority', name_am: 'የፌዴራል ትራንስፖርት ባለስልጣን', short_am: 'ፌ/ት/ባ', level: 'federal', is_ministry: false },
  { code: 'EBA', name_en: 'Ethiopian Broadcast Authority', name_am: 'የኢትዮጵያ ብሮድካስት ባለስልጣን', short_am: 'ኢ/ብ/ባ', level: 'federal', is_ministry: false },
  { code: 'BA', name_en: 'Ethiopian Broadcast Authority', name_am: 'ብሮድካስት ባለስልጣን', short_am: 'ብ/ባ', level: 'federal', is_ministry: false },
  { code: 'EEA', name_en: 'Ethiopian Energy Authority', name_am: 'የኢትዮጵያ ኢነርጂ ባለስልጣን', short_am: 'ኢ/ኢ/ባ', level: 'federal', is_ministry: false },
  { code: 'FPC', name_en: 'Federal Police Commission', name_am: 'የፌዴራል ፖሊስ ኮሚሽን', short_am: 'ፌ/ፖ/ኮ', level: 'federal', is_ministry: false },
  { code: 'NBE', name_en: 'National Bank of Ethiopia', name_am: 'የኢትዮጵያ ብሔራዊ ባንክ', short_am: 'ኢ/ብ/ባ', level: 'federal', is_ministry: false },
  { code: 'ECTA', name_en: 'Ethiopian Coffee and Tea Authority', name_am: 'የኢትዮጵያ ቡናና ሻይ ባለስልጣን', short_am: 'ኢ/ቡ/ሻ/ባ', level: 'federal', is_ministry: false },
  { code: 'VDAFACA', name_en: 'Veterinary Drug and Animal Feed Administration and Control Authority', name_am: 'የእንስሳት መድኃኒትና መኖ አስተዳደርና ቁጥጥር ባለስልጣን', short_am: 'እ/መ/ዓ/ቁ/ባ', level: 'federal', is_ministry: false },
  { code: 'EAAB', name_en: 'Ethiopian Accounting and Auditing Board', name_am: 'የኢትዮጵያ የሂሳብ አያያዝና ኦዲት ቦርድ', short_am: 'ኢ/ሂ/አ/ኦ/ቦ', level: 'federal', is_ministry: false },
]

const SORTED_BY_LEN = [...AUTHORITIES].sort((a, b) => b.code.length - a.code.length)
const CODE_LOOKUP: ReadonlyMap<string, Authority> = new Map(AUTHORITIES.map((a) => [a.code, a]))

/**
 * Split a concatenated EN abbreviation string (e.g. "MOARTB") into its
 * [verification, licensing] components, using longest-prefix matching.
 */
export function splitEnglishAbbrev(combined: string): [Authority | null, Authority | null] {
  for (const a of SORTED_BY_LEN) {
    if (combined.startsWith(a.code)) {
      const remainder = combined.slice(a.code.length)
      if (remainder.length === 0) return [a, null]
      const rest = CODE_LOOKUP.get(remainder)
      if (rest) return [a, rest]
      // Try one more pass over remainder
      for (const b of SORTED_BY_LEN) {
        if (remainder.startsWith(b.code) && remainder.length === b.code.length) {
          return [a, b]
        }
      }
    }
  }
  return [null, null]
}

export function authorityName(code: string | null): string | null {
  if (!code) return null
  return CODE_LOOKUP.get(code)?.name_en ?? code
}
