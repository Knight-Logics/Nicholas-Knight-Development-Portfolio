// Lightweight Lighthouse CLI sweep for all KnightLogics pages
// Run: node _lh_sweep.js
const { execSync } = require('child_process');
const pages = [
  'https://knightlogics.com/contact',
  'https://knightlogics.com/book-consultation',
  'https://knightlogics.com/service-websites',
  'https://knightlogics.com/service-local-seo',
  'https://knightlogics.com/service-ai-automation',
  'https://knightlogics.com/service-google-business-profile',
  'https://knightlogics.com/nicholas-knight',
];

const lh = require.resolve('lighthouse/cli/run.js');
const chromePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

for (const url of pages) {
  const slug = url.replace('https://knightlogics.com/', '') || 'home';
  const out = `_lh_${slug.replace(/\//g,'-')}.json`;
  console.log(`Running: ${url}`);
  try {
    execSync(`node "${lh}" "${url}" --output=json --output-path="${out}" --form-factor=mobile --throttling-method=simulate --chrome-flags="--headless --no-sandbox" --only-categories=performance,accessibility,best-practices,seo --quiet`, { stdio: 'inherit', timeout: 120000 });
    const r = JSON.parse(require('fs').readFileSync(out, 'utf8'));
    const cats = r.categories;
    console.log(`  MOBILE  Perf=${Math.round(cats.performance.score*100)} A11y=${Math.round(cats.accessibility.score*100)} BP=${Math.round(cats['best-practices'].score*100)} SEO=${Math.round(cats.seo.score*100)}`);
    const lcp = r.audits['largest-contentful-paint']?.displayValue || 'N/A';
    const cls = r.audits['cumulative-layout-shift']?.displayValue || 'N/A';
    const tbt = r.audits['total-blocking-time']?.displayValue || 'N/A';
    console.log(`         LCP=${lcp} CLS=${cls} TBT=${tbt}`);
  } catch(e) {
    console.error(`  FAILED: ${e.message.slice(0,100)}`);
  }
}
