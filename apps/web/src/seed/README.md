# MOR Directive 17/2011 seed

Populates Payload with 9 sector categories + 519 business sectors + 1 license requirement per sector + ministry approvals where applicable, all sourced from the official Ministry of Revenue directive (`docs/mor/MOR-Directive-17-2011-Revision-2.pdf`).

## Files

| File | Purpose |
|---|---|
| `mor.ts` | Main seed runner. Hits Payload Local API. Idempotent. |
| `data/sectors.json` | 519 parsed sectors with `mor_code`, `name_en`, `name_am`, raw abbreviations. Generated once from the MOR PDF — see "Regenerating" below. |
| `data/categories.ts` | 9 top-level categories (hand-authored from Annex 1 of the directive). |
| `data/authorities.ts` | 36 verification bodies / licensing authorities with abbreviation → full name mapping and a `splitEnglishAbbrev()` helper. |

## Run

From repo root (or `apps/web`):

```bash
pnpm --filter @bizbridge/web seed:mor
```

Prerequisites:
- `apps/web/.env` configured with `DATABASE_URL` and `PAYLOAD_SECRET`
- Payload migrations already applied (`pnpm payload:migrate`)

## What gets written

| Collection | Rows | Notes |
|---|---:|---|
| `sector-categories` | 9 | One per top-level MOR category. |
| `business-sectors` | 519 | One per official sector code. `mor_code` is the unique key; `slug` is `{slugify(name_en)}-{mor_code}`. `description_short` is auto-generated; replace with real teaser copy in admin. `description_full` is left blank for the editorial team. |
| `sector-license-requirements` | 519 | One "Business License" entry per sector with the issuing authority name. |
| `sector-approvals` | ~300 | Only where the verification body differs from the licensing authority (i.e. when an upstream ministry needs to certify competency before the trade license is issued). |

## Idempotency

The seed re-queries each row by its unique key (slug for categories, mor_code for sectors, sector+license_type for licenses, sector+approving_ministry for approvals) and updates rather than duplicating. You can re-run any time after editing `categories.ts`, `authorities.ts`, or `sectors.json`.

## What is NOT seeded (yet)

- **Official fees** (`sector-costs`): the directive lists licensing categories but not the specific fee schedule. Source these from `etrade.gov.et` or the MOR fee table separately; once compiled, write a `seed-costs.ts` script.
- **Certificates of competency** (`sector-competency-certificates`): the directive references competency verification bodies but doesn't enumerate certificate names. Compile separately when the certificate inventory is ready.
- **Steps** (`sector-steps`): structured step-by-step process per sector is a manual content task. The same step pattern (1. Trademark search, 2. Investment licence, 3. TIN, 4. Bank, 5. Trade licence, 6. Tax, …) applies to most sectors and can be templated.
- **Sector documents** (`sector-documents`): R2 uploads handled in Payload admin.

## Regenerating `sectors.json` from the PDF

The JSON was produced by a one-time parser (`tools/parse-mor.cjs` in your scratch dir during the Phase 1 session). If the MOR directive is revised, re-run the parser:

```bash
# Re-extract PDF text
node -e "const pdf = require('pdf-parse'); pdf(require('fs').readFileSync('docs/mor/MOR-Directive-17-2011-Revision-2.pdf')).then(d => process.stdout.write(d.text));" > /tmp/mor.txt

# Re-run parser (carry over the parser from the Phase 1 scratch dir, or
# re-build from this file's git history)
node tools/parse-mor.cjs
```

The parser is permissive about: parens/commas in names, code mismatches between the
Amharic and English columns, OCR glitches like "1ዐ" → "10", and trailing space inside
uppercase abbreviation strings.

## Known data quality notes

- English sector names are word-glued in the source PDF (e.g. "Growingofcereals"). The seed stores them as-is. Editors can split them in Payload admin for any sector that gets featured. CamelCase splits and parens/comma splits are applied automatically.
- 7 sectors had a typo in the directive where the MOR code in the English column doesn't exactly match the Amharic column; both values are preserved in `sectors.json` (`mor_code` and `mor_code_alt`). The Amharic-side code is treated as authoritative.
- The Amharic explanation PDF (`MOR-Directive-17-2011-Explanation-Amharic.pdf`) contains expanded descriptions per sector. Those flesh out `description_full` content — left for the editorial pass, not the structural seed.
