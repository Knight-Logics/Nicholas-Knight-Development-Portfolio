// Lighthouse sweep for all remaining KnightLogics pages
// Usage: node _lh_sweep2.js
const { execSync } = require('child_process');
const fs = require('fs');

const pages = [
  ['contact', 'https://knightlogics.com/contact'],
  ['book-consultation', 'https://knightlogics.com/book-consultation'],
  ['service-websites', 'https://knightlogics.com/service-websites'],
  ['service-local-seo', 'https://knightlogics.com/service-local-seo'],
  ['service-ai-automation', 'https://knightlogics.com/service-ai-automation'],
  ['service-gbp', 'https://knightlogics.com/service-google-business-profile'],
  ['nicholas-knight', 'https://knightlogics.com/nicholas-knight'],
];

function getScores(jsonPath) {
  const r = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const c = r.categories;
  const a = r.audits;
  return {
    perf: Math.round(c.performance.score * 100),
    a11y: Math.round(c.accessibility.score * 100),
    bp: Math.round(c['best-practices'].score * 100),
    seo: Math.round(c.seo.score * 100),
    lcp: a['largest-contentful-paint'].displayValue.replace(/\s/g, ''),
    cls: a['cumulative-layout-shift'].displayValue.replace(/\s/g, ''),
    tbt: a['total-blocking-time'].displayValue.replace(/\s/g, ''),
  };
}

for (const [slug, url] of pages) {
  const out = `_lh_${slug}.json`;
  if (fs.existsSync(out)) {
    console.log(`[CACHED] ${slug}`);
  } else {
    console.log(`[RUNNING] ${slug} ...`);
    try {
      execSync(
        `npx lighthouse@12 "${url}" --output=json --output-path="${out}" --form-factor=mobile --chrome-flags="--headless" --quiet`,
        { stdio: 'pipe', timeout: 120000 }
      );
    } catch (e) {
      console.error(`  FAILED: ${e.message.slice(0, 120)}`);
      continue;
    }
  }
  try {
    const s = getScores(out);
    console.log(`  ${slug.padEnd(24)} Perf=${s.perf} A11y=${s.a11y} BP=${s.bp} SEO=${s.seo}  |  LCP=${s.lcp} CLS=${s.cls} TBT=${s.tbt}`);
  } catch (e) {
    console.error(`  Parse error: ${e.message}`);
  }
}
