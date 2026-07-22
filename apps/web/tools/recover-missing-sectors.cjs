// Fuzzy-recover Amharic operations for the ~28 sectors whose mor_code appears
// in sectors.json but is missing from sector-explanations.json (the two PDFs
// disagree on some sub-code enumerations). Strategy: for each missing code,
// try candidates that share the 4-digit prefix, then pick the one whose
// Amharic name has the highest character-set overlap with sectors.json's
// name_am. Writes the recovered rows into a companion JSON that the seed
// script can also read.

const fs = require('fs');
const path = require('path');

const sectors = require(path.resolve(__dirname, '../src/seed/data/sectors.json'));
const explain = require(path.resolve(__dirname, '../src/seed/data/sector-explanations.json'));

const missing = sectors.filter((s) => !explain.byCode[s.mor_code]);

function overlapScore(a, b) {
  if (!a || !b) return 0;
  const cleanA = a.replace(/\s/g, '');
  const cleanB = b.replace(/\s/g, '');
  const shorter = cleanA.length < cleanB.length ? cleanA : cleanB;
  const longer = cleanA.length < cleanB.length ? cleanB : cleanA;
  let hits = 0;
  for (const ch of new Set(shorter)) {
    if (longer.includes(ch)) hits += 1;
  }
  return hits / Math.max(1, new Set(shorter).size);
}

const recovered = [];
const trulyMissing = [];

for (const target of missing) {
  const code = target.mor_code;
  const wantName = target.name_am ?? '';

  // Widen search: prefer 4-digit prefix, then 3-digit if the best match is
  // weak. This catches cases where the two PDFs enumerate the same sector
  // under codes like 86516 vs 86541.
  const collect = (prefixLen) =>
    Object.entries(explain.byCode)
      .filter(([c]) => c.startsWith(code.slice(0, prefixLen)) && c !== code)
      .map(([c, e]) => ({ code: c, entry: e, score: overlapScore(wantName, e.name_am ?? '') }))
      .sort((a, b) => b.score - a.score);

  let candidates = collect(4);
  if (candidates.length === 0 || candidates[0].score < 0.8) {
    const wider = collect(3);
    // Only accept a wider match if it beats the narrow one by a clear margin.
    if (wider[0] && wider[0].score >= (candidates[0]?.score ?? 0) + 0.15) {
      candidates = wider;
    }
  }

  if (candidates.length === 0 || candidates[0].score < 0.3) {
    trulyMissing.push({ code, name_en: target.name_en, name_am: wantName });
    continue;
  }

  recovered.push({
    original_code: code,
    matched_code: candidates[0].code,
    name_en: target.name_en,
    name_am: candidates[0].entry.name_am ?? wantName,
    legacy_codes: candidates[0].entry.legacy_codes ?? [],
    operations_am: candidates[0].entry.operations_am ?? [],
    score: Number(candidates[0].score.toFixed(2)),
  });
}

console.log(`Missing sectors: ${missing.length}`);
console.log(`Recovered via fuzzy match: ${recovered.length}`);
console.log(`Truly missing: ${trulyMissing.length}`);
console.log('\n--- RECOVERED ---');
recovered.forEach((r) =>
  console.log(`  ${r.original_code} ← ${r.matched_code} (score ${r.score}) ${r.name_am.slice(0, 40)}`),
);
if (trulyMissing.length > 0) {
  console.log('\n--- TRULY MISSING (need manual entry) ---');
  trulyMissing.forEach((m) => console.log(`  ${m.code} · ${m.name_en}`));
}

fs.writeFileSync(
  path.resolve(__dirname, '../src/seed/data/sector-explanations-recovered.json'),
  JSON.stringify(
    {
      generated_at: new Date().toISOString(),
      note: 'Fuzzy-matched sectors whose mor_code was missing from sector-explanations.json. Match score is char-set overlap of name_am against the best-scoring prefix candidate.',
      recovered,
      truly_missing: trulyMissing,
    },
    null,
    2,
  ),
);
