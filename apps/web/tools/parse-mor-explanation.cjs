// Parse the extracted MOR Directive 17/2011 Explanation Manual into per-code
// Amharic content: name, legacy code list, and bulleted permitted-operations
// text. Output feeds the bilingual pilot batch under src/seed/data/.

const fs = require('fs');
const path = require('path');

const IN_TXT = path.resolve(
  __dirname,
  '../../../docs/mor/explanation-table.txt',
);
const OUT_JSON = path.resolve(
  __dirname,
  '../src/seed/data/sector-explanations.json',
);
const OUT_REPORT = path.resolve(
  __dirname,
  '../src/seed/data/sector-explanations.report.txt',
);

const raw = fs.readFileSync(IN_TXT, 'utf8');
const lines = raw.split(/\r?\n/);

const HEADER_MARKERS = [
  'የኢትዮጵያ የንግድ ስራ ፈቃድ',
  "Ethiopian Standard Industrial Classification",
  'ተራ',
  'ቁ.',
  'አዲስ',
  'ኮድ',
  'ስያሜ',
  'ነባር',
  'መስኮች',
  'ማብራሪያ',
  'የፈቃድ',
];

const ROW_START = /^\s*(\d{1,3})\s+(\d{5})\s+(.*)$/;

const isHeaderish = (line) => {
  const t = line.trim();
  if (!t) return true;
  if (/^Description$/i.test(t)) return true;
  return HEADER_MARKERS.some((m) => t.startsWith(m));
};

const rows = [];
let current = null;

for (const line of lines) {
  const m = line.match(ROW_START);
  if (m) {
    const serial = parseInt(m[1], 10);
    const mor_code = m[2];
    if (current) rows.push(current);
    current = {
      serial,
      mor_code,
      lines: [m[3]],
      firstLine: line,
    };
    continue;
  }
  if (current && !isHeaderish(line)) {
    current.lines.push(line);
  }
}
if (current) rows.push(current);

function stripNumericLegacy(text) {
  // Pull off leading comma-separated legacy codes like "11110፣11111፣11150"
  // (Amharic comma) or "11110,11111".
  const legacy = [];
  let rest = text;
  // Match blocks of digits separated by Amharic/ASCII commas, possibly interspersed with whitespace.
  const legacyMatch = rest.match(
    /^\s*((?:\d{4,6}[፣,]?)+(?:\s+\d{4,6}[፣,]?)*)/,
  );
  if (legacyMatch) {
    const chunk = legacyMatch[1];
    chunk.split(/[፣,\s]+/).forEach((n) => {
      if (/^\d{4,6}$/.test(n)) legacy.push(n);
    });
    rest = rest.slice(legacyMatch[0].length);
  }
  return { legacy, rest };
}

function normalizeSpaces(s) {
  return s.replace(/\s+/g, ' ').trim();
}

const parsed = [];
const failed = [];

for (const row of rows) {
  // Join every line of the row block into a single stream (order matters for
  // continuation of long bullets).
  const joined = row.lines.map((l) => l).join(' ');
  const flat = normalizeSpaces(joined);

  // Amharic name lives up until the legacy code block. Legacy codes are digit
  // groups (4-6 digits) separated by ፣ / , with no bullets between them.
  // Operations start at the first ' • ' bullet (or if unbulleted, whatever
  // remains after the legacy codes).
  //
  // Strategy: find the first legacy-code sequence anchored right after the
  // Amharic name (which contains no digits).
  const legacyRe = /\b(\d{4,6}(?:[፣,\s]+\d{4,6})*)\b/;
  const legacyM = flat.match(legacyRe);
  let name_am = flat;
  let legacy = [];
  let ops_block = '';

  if (legacyM) {
    const idx = flat.indexOf(legacyM[0]);
    name_am = flat.slice(0, idx).trim();
    const afterName = flat.slice(idx);
    const { legacy: leg, rest } = stripNumericLegacy(afterName);
    legacy = leg;
    ops_block = rest.trim();
  } else {
    // No legacy codes recorded (a few rows). Everything after the name is ops.
    const bulletIdx = flat.indexOf('•');
    if (bulletIdx >= 0) {
      name_am = flat.slice(0, bulletIdx).trim();
      ops_block = flat.slice(bulletIdx).trim();
    }
  }

  // Split operations by bullet markers. Some rows lead with narrative text
  // (no bullet) — keep that as a single item.
  let operations_am = [];
  if (ops_block.includes('•')) {
    operations_am = ops_block
      .split('•')
      .map((s) => normalizeSpaces(s))
      .filter((s) => s.length > 0);
  } else if (ops_block.length > 0) {
    operations_am = [normalizeSpaces(ops_block)];
  }

  const looksAmharic = /[ሀ-፿]/.test(name_am);
  const record = {
    serial: row.serial,
    mor_code: row.mor_code,
    name_am: normalizeSpaces(name_am),
    legacy_codes: legacy,
    operations_am,
  };

  if (!looksAmharic || !record.name_am || operations_am.length === 0) {
    failed.push({
      serial: row.serial,
      mor_code: row.mor_code,
      raw: flat.slice(0, 200),
    });
  }
  parsed.push(record);
}

parsed.sort((a, b) => a.serial - b.serial);

const byCode = {};
for (const p of parsed) byCode[p.mor_code] = p;

fs.writeFileSync(OUT_JSON, JSON.stringify({ count: parsed.length, entries: parsed, byCode }, null, 2));

const withOps = parsed.filter((p) => p.operations_am.length > 0).length;
const withLegacy = parsed.filter((p) => p.legacy_codes.length > 0).length;

fs.writeFileSync(
  OUT_REPORT,
  [
    `Row blocks: ${rows.length}`,
    `Parsed rows: ${parsed.length}`,
    `Rows with operations: ${withOps}`,
    `Rows with legacy codes: ${withLegacy}`,
    `Suspicious rows (empty name / no ops / no Amharic): ${failed.length}`,
    '',
    '--- Suspicious rows (first 30) ---',
    ...failed.slice(0, 30).map((f) => `${f.serial}\t${f.mor_code}\t${f.raw}`),
  ].join('\n'),
);

console.log(
  `Parsed ${parsed.length} rows; ${withOps} with ops; ${withLegacy} with legacy codes; ${failed.length} suspicious.`,
);
