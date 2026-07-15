// Extracts plain text from one or more PDFs.
// Usage:  node tools/extract-pdf-text.cjs <pdf> [<pdf>...]
// Writes <basename>.txt next to each PDF (override via OUT_DIR env).

const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const inputs = process.argv.slice(2);
if (!inputs.length) {
  console.error('usage: node tools/extract-pdf-text.cjs <pdf> [<pdf>...]');
  process.exit(2);
}

(async () => {
  for (const file of inputs) {
    const buf = fs.readFileSync(file);
    const data = await pdf(buf);
    const base = path.basename(file, '.pdf');
    const outDir = process.env.OUT_DIR || path.dirname(file);
    fs.writeFileSync(path.join(outDir, base + '.txt'), data.text, 'utf8');
    fs.writeFileSync(
      path.join(outDir, base + '.meta.json'),
      JSON.stringify(
        { numpages: data.numpages, info: data.info, length_chars: data.text.length },
        null,
        2,
      ),
    );
    console.log(`${file} -> ${base}.txt (${data.numpages} pages, ${data.text.length} chars)`);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
