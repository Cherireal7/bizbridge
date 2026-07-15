// Parse the extracted MOR directive text into structured sector JSON.
// Permissive: handles parens/commas/Amharic punctuation in names,
// 4-9 digit code runs, serial-mismatch between Amharic/English re-occurrence,
// and the "1ዐ" OCR glitch for sector 10.

const fs = require('fs');
const path = require('path');

// Resolves paths relative to the apps/web package root.
// MOR_TXT can override the input path.
const ENG_PDF_TXT =
  process.env.MOR_TXT ||
  path.resolve(__dirname, '../../../docs/mor/MOR-Directive-17-2011-Revision-2.txt');
const OUT_JSON = path.resolve(__dirname, '../src/seed/data/sectors.json');
const OUT_REPORT = path.resolve(__dirname, '../src/seed/data/sectors.report.txt');

const text = fs.readFileSync(ENG_PDF_TXT, 'utf8');
const rawLines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

const NOISE = new Set([
  'ተራ', 'ቁ.', 'የዋናዘርፍመደቦችዘርፍ', 'ዋና', 'ክፍልክፍል',
  'የፈቃድ', 'መስጫ', 'መደብ', 'ብቃት', 'አረጋጋጭፈቃድሰጪ',
  'Ser', 'No', 'NoTitleofcategory', 'Titleofcategory',
  'Divis', 'ion', 'Major', 'groupGroup', 'group', 'Group',
  'Licensing', 'category', 'Verification', 'body', 'authority',
]);
const lines = rawLines.filter((l) => !NOISE.has(l) && !/^\d{1,3}$/.test(l));

const isEndOfRow = (s) => /\d{4,}[A-Z][A-Z/]*$/.test(s);
const startsWithSerial = (s) => /^\d{1,3}[ሀ-፿(]/.test(s);

const rows = [];
let buf = [];
let collecting = false;

for (const line of lines) {
  if (startsWithSerial(line)) {
    if (collecting && buf.length) rows.push(buf.join(' '));
    buf = [line];
    collecting = true;
  } else if (collecting) {
    buf.push(line);
  }
  if (collecting && isEndOfRow(line)) {
    rows.push(buf.join(' '));
    buf = [];
    collecting = false;
  }
}
if (collecting && buf.length) rows.push(buf.join(' '));

const parsed = [];
const failed = [];

// Permissive regex:
//   1: serial (1-3 digits)
//   2: am_name (any non-alphanumeric, lazy)
//   3: mor_code raw (4-9 digits)
//   4: am_verif_lic
//   5: serial-again
//   6: en_name (NO digits)
//   7: en_code raw
//   8: en_verif_lic
const ROW_RE = /^(\d{1,3})([^A-Za-z0-9]+?)(\d{4,9})([^A-Za-z0-9]+?)(\d{1,3})([A-Za-z][^\d]*?)(\d{4,9})([A-Z][A-Z\/]*)$/;

function normalize(row) {
  // Collapse runs of whitespace to single spaces, then strip spaces around
  // delimiters that matter for the regex (digits and slashes).
  let s = row.replace(/\s+/g, ' ').trim();
  // OCR glitch: "1ዐ" -> "10" at start
  s = s.replace(/^(\d)ዐ/, (_, d) => d + '0');
  // Strip spaces around digits (so "1234 ABC" becomes "1234ABC") so the
  // serial / mor_code anchors detect cleanly. Preserve spaces inside text blocks.
  s = s.replace(/(\d)\s+/g, '$1').replace(/\s+(\d)/g, '$1');
  // Strip spaces around / and ፣ inside Amharic abbreviation block
  s = s.replace(/\s*\/\s*/g, '/').replace(/\s*፣\s*/g, '፣');
  // Collapse spaces between consecutive uppercase tokens at row end
  s = s.replace(/([A-Z])\s+([A-Z])/g, '$1$2').replace(/([A-Z])\s+([A-Z])/g, '$1$2');
  return s;
}

function cleanAmharicName(s) {
  return s.replace(/\s+/g, '').replace(/^[፡:]+|[፡:]+$/g, '').trim();
}

function cleanEnglishName(s) {
  let out = s
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/,(\S)/g, ', $1')
    .replace(/\)(\S)/g, ') $1')
    .replace(/(\S)\(/g, '$1 (')
    .replace(/\s+/g, ' ')
    .trim();
  if (out.length > 0) out = out[0].toUpperCase() + out.slice(1);
  out = out.replace(/\.$/, '');
  return out;
}

for (const row of rows) {
  const compact = normalize(row);
  const m = compact.match(ROW_RE);
  if (m) {
    const [, serialA, amRaw, amCodeRaw, amVerifLicRaw, serialB, enRaw, enCodeRaw, enVerifLicRaw] = m;
    const mor_code = amCodeRaw.slice(0, 5);
    const mor_code_alt = enCodeRaw.slice(0, 5);
    parsed.push({
      serial: parseInt(serialA, 10),
      serial_repeat: parseInt(serialB, 10),
      mor_code,
      mor_code_alt: mor_code_alt === mor_code ? null : mor_code_alt,
      name_am: cleanAmharicName(amRaw),
      name_en: cleanEnglishName(enRaw),
      verif_lic_am: amVerifLicRaw,
      verif_lic_en: enVerifLicRaw,
    });
  } else {
    failed.push(row);
  }
}

parsed.sort((a, b) => a.serial - b.serial);

const seen = new Set(parsed.map((p) => p.serial));
const missingSerials = [];
const expected = 519;
for (let i = 1; i <= expected; i++) {
  if (!seen.has(i)) missingSerials.push(i);
}
const duplicateSerials = parsed
  .map((p) => p.serial)
  .filter((s, i, arr) => arr.indexOf(s) !== i);

fs.writeFileSync(OUT_JSON, JSON.stringify(parsed, null, 2));
fs.writeFileSync(
  OUT_REPORT,
  [
    `Row blocks collected: ${rows.length}`,
    `Successfully parsed: ${parsed.length}`,
    `Parse failures: ${failed.length}`,
    `Missing serials in 1..${expected}: ${missingSerials.length}`,
    missingSerials.length > 0 ? `  -> ${missingSerials.join(', ')}` : '',
    `Duplicate serials: ${duplicateSerials.length} -> ${duplicateSerials.join(', ')}`,
    '',
    '--- FAILED ROWS ---',
    ...failed,
  ].join('\n'),
);

console.log(
  `Parsed ${parsed.length}/${rows.length}, missing ${missingSerials.length} serials, ${duplicateSerials.length} duplicates.`,
);
