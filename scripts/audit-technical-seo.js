const fs = require('fs');
const path = require('path');

const root = process.cwd();
const siteBase = 'https://knightlogics.com';
const socialDocsRoot = process.env.KL_SOCIAL_DOCS_ROOT || 'E:/Social Media Manager/docs';

const keyPages = [
  'index.html',
  'pricing.html',
  'service-websites.html',
  'service-local-seo.html',
  'service-google-business-profile.html',
  'service-ai-automation.html',
  'service-ecommerce.html',
  'service-desktop-apps.html',
  'free-website-audit.html',
  'home-service-websites.html',
  'book-consultation.html',
  'contact.html',
  'case-study-knight-group.html',
  'case-study-screen-team.html',
  'case-study-jns.html',
  'case-study-sals-painting.html',
  'case-study-moms-resin-tables.html',
  'case-study-farrell-electric.html',
  'case-study-knight-logics.html',
  'pixelforge-ai.html',
  'display-control-plus.html',
  'videoforge.html',
  'auto-vid-compiler.html',
  'web-designer-safety-harbor.html',
  'web-designer-clearwater.html',
  'web-designer-st-petersburg.html',
  'web-designer-tampa.html'
];

function readIfExists(file) {
  const full = path.join(root, file);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
}

function stripTags(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeUrl(url) {
  return url.replace(/\.html$/, '').replace(/\/$/, '') || `${siteBase}`;
}

function urlForFile(file) {
  if (file === 'index.html') return `${siteBase}/`;
  return `${siteBase}/${file.replace(/\.html$/, '')}`;
}

function flattenJsonLd(node, out = []) {
  if (!node || typeof node !== 'object') return out;
  if (Array.isArray(node)) {
    node.forEach((item) => flattenJsonLd(item, out));
    return out;
  }
  out.push(node);
  if (node['@graph']) flattenJsonLd(node['@graph'], out);
  Object.values(node).forEach((value) => {
    if (value && typeof value === 'object') flattenJsonLd(value, out);
  });
  return out;
}

function schemaTypes(nodes) {
  const types = [];
  for (const node of nodes) {
    const type = node['@type'];
    if (Array.isArray(type)) types.push(...type);
    else if (type) types.push(type);
  }
  return [...new Set(types)].sort();
}

function extractJsonLd(html) {
  const blocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  return blocks.map((match, index) => {
    const raw = match[1].trim();
    try {
      const parsed = JSON.parse(raw);
      const nodes = flattenJsonLd(parsed, []);
      return { index: index + 1, valid: true, rawLength: raw.length, parsed, types: schemaTypes(nodes), nodes };
    } catch (error) {
      return { index: index + 1, valid: false, rawLength: raw.length, error: error.message, types: [], nodes: [] };
    }
  });
}

function extractAttr(html, selectorRegex) {
  const match = html.match(selectorRegex);
  return match ? match[1].trim() : '';
}

function extractPackageKeys(html) {
  return [...html.matchAll(/data-package-key=["']([^"']+)["']/gi)].map((m) => m[1]);
}

function extractSitemapUrls() {
  const sitemap = readIfExists('sitemap.xml');
  return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) => m[1].trim());
}

function localFileForUrl(url) {
  const parsed = new URL(url);
  let pathname = parsed.pathname.replace(/^\//, '');
  if (!pathname) return 'index.html';
  if (pathname.includes('.')) return pathname;
  return `${pathname}.html`;
}

function collectOffers(jsonBlocks) {
  const offers = [];
  for (const block of jsonBlocks) {
    if (!block.valid) continue;
    for (const node of block.nodes) {
      if (node['@type'] === 'Offer') {
        offers.push({
          id: node['@id'] || '',
          name: node.name || '',
          price: node.price || '',
          priceCurrency: node.priceCurrency || '',
          url: node.url || '',
          itemOffered: node.itemOffered && node.itemOffered.name ? node.itemOffered.name : '',
          serviceType: node.itemOffered && node.itemOffered.serviceType ? node.itemOffered.serviceType : ''
        });
      }
    }
  }
  return offers;
}

function auditPage(file, sitemapSet) {
  const html = readIfExists(file);
  if (!html) return { file, exists: false, issues: ['File missing'] };
  const jsonLd = extractJsonLd(html);
  const canonical = extractAttr(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  const robots = extractAttr(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i);
  const title = extractAttr(html, /<title>([\s\S]*?)<\/title>/i);
  const description = extractAttr(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => stripTags(m[1]));
  const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const missingAlt = images.filter((img) => !/\salt=["'][^"']*["']/i.test(img)).length;
  const packageKeys = extractPackageKeys(html);
  const allTypes = schemaTypes(jsonLd.flatMap((block) => block.nodes));
  const expectedUrl = urlForFile(file);
  const issues = [];

  if (!title) issues.push('Missing title');
  if (!description) issues.push('Missing meta description');
  if (!canonical) issues.push('Missing canonical');
  if (canonical && normalizeUrl(canonical) !== normalizeUrl(expectedUrl)) issues.push(`Canonical differs from expected URL: ${canonical}`);
  if (!sitemapSet.has(expectedUrl)) issues.push('Not listed in sitemap.xml');
  if (h1s.length !== 1) issues.push(`Expected 1 H1, found ${h1s.length}`);
  if (jsonLd.some((block) => !block.valid)) issues.push('Invalid JSON-LD block present');
  if (!allTypes.includes('BreadcrumbList') && !['index.html'].includes(file)) issues.push('No BreadcrumbList schema detected');
  if (missingAlt > 0) issues.push(`${missingAlt} image(s) missing alt text`);
  if (robots && /noindex/i.test(robots)) issues.push(`Robots meta includes noindex: ${robots}`);

  return {
    file,
    exists: true,
    url: expectedUrl,
    title,
    descriptionLength: description.length,
    canonical,
    robots,
    h1s,
    jsonLdBlocks: jsonLd.length,
    invalidJsonLdBlocks: jsonLd.filter((block) => !block.valid).map((block) => ({ index: block.index, error: block.error })),
    schemaTypes: allTypes,
    packageKeys: [...new Set(packageKeys)].sort(),
    imageCount: images.length,
    missingAlt,
    issues
  };
}

function pricingChecks(pricingHtml, pricingBlocks) {
  const visibleKeys = [...new Set(extractPackageKeys(pricingHtml))].sort();
  const offers = collectOffers(pricingBlocks);
  const offerNames = new Set(offers.map((offer) => offer.name));
  const jsCatalogStart = pricingHtml.indexOf('const packageCatalog = {');
  const jsCatalogEnd = pricingHtml.indexOf('function getPackageDetails', jsCatalogStart);
  const jsCatalogSource = jsCatalogStart >= 0 && jsCatalogEnd > jsCatalogStart ? pricingHtml.slice(jsCatalogStart, jsCatalogEnd) : '';
  const jsCatalogKeys = [...jsCatalogSource.matchAll(/["']([a-z0-9-]+)["']\s*:\s*{\s*name:\s*["']([^"']+)/gi)].map((m) => ({ key: m[1], name: m[2] }));
  const jsCatalogByKey = new Map(jsCatalogKeys.map((item) => [item.key, item.name]));
  const visibleWithoutJsCatalog = visibleKeys.filter((key) => !jsCatalogByKey.has(key));
  const jsCatalogNamesWithoutOffer = jsCatalogKeys.filter((item) => !offerNames.has(item.name));
  const incompleteOffers = offers.filter((offer) => !offer.id || !offer.name || !offer.price || !offer.priceCurrency || !offer.url || !offer.itemOffered || !offer.serviceType);

  let socialPackagePricingNote = '';
  const currentPackagesPath = path.join(socialDocsRoot, 'current-packages.md');
  if (fs.existsSync(currentPackagesPath)) {
    const socialText = fs.readFileSync(currentPackagesPath, 'utf8');
    if (/Google Business Profile Optimization[\s\S]*?\$297/i.test(socialText) && /Google Business Profile Sprint[\s\S]*?priceDisplay:\s*'\$397'/i.test(readIfExists('api/create-checkout-session.js'))) {
      socialPackagePricingNote = 'Social current-packages.md says GBP Optimization is $297, but live checkout/API and pricing page use GBP Sprint at $397.';
    }
  }

  return {
    visiblePackageKeyCount: visibleKeys.length,
    visiblePackageKeys: visibleKeys,
    schemaOfferCount: offers.length,
    offers,
    visibleWithoutJsCatalog,
    jsCatalogNamesWithoutOffer,
    incompleteOffers,
    socialPackagePricingNote
  };
}

function writeReports(report) {
  const outDir = path.join(root, '_seo_audit', new Date().toISOString().slice(0, 10));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'technical-seo-audit.json'), JSON.stringify(report, null, 2));

  const lines = [];
  lines.push('# Knight Logics Technical SEO Audit');
  lines.push('');
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Pages audited: ${report.pages.length}`);
  lines.push(`- Sitemap URLs checked: ${report.sitemap.urlCount}`);
  lines.push(`- JSON-LD blocks: ${report.summary.jsonLdBlocks}`);
  lines.push(`- Invalid JSON-LD blocks: ${report.summary.invalidJsonLdBlocks}`);
  lines.push(`- Pricing schema offers: ${report.pricing.schemaOfferCount}`);
  lines.push(`- Visible pricing package keys: ${report.pricing.visiblePackageKeyCount}`);
  lines.push(`- Total page issues flagged: ${report.summary.issueCount}`);
  if (report.pricing.socialPackagePricingNote) lines.push(`- Pricing drift: ${report.pricing.socialPackagePricingNote}`);
  lines.push('');
  lines.push('## Page Inventory');
  lines.push('');
  lines.push('| Page | JSON-LD | Schema Types | Issues |');
  lines.push('| --- | ---: | --- | --- |');
  for (const page of report.pages) {
    lines.push(`| ${page.file} | ${page.jsonLdBlocks || 0} | ${(page.schemaTypes || []).join(', ') || '-'} | ${(page.issues || []).join('; ') || 'None'} |`);
  }
  lines.push('');
  lines.push('## Pricing Consistency');
  lines.push('');
  lines.push(`- Visible package keys without JS catalog match: ${report.pricing.visibleWithoutJsCatalog.join(', ') || 'None'}`);
  lines.push(`- JS catalog names without schema Offer match: ${report.pricing.jsCatalogNamesWithoutOffer.map((item) => `${item.key} (${item.name})`).join(', ') || 'None'}`);
  lines.push(`- Incomplete schema offers: ${report.pricing.incompleteOffers.map((offer) => offer.name || offer.id).join(', ') || 'None'}`);
  lines.push('');
  lines.push('## Sitemap Resolution');
  lines.push('');
  lines.push(`- Missing local files for sitemap URLs: ${report.sitemap.missingLocalFiles.join(', ') || 'None'}`);
  lines.push(`- Sitemap URLs missing canonical self-reference: ${report.sitemap.missingCanonicalSelfReference.join(', ') || 'None'}`);
  lines.push('');
  lines.push('## Live Verification Queue');
  lines.push('');
  for (const url of report.liveVerificationQueue) lines.push(`- ${url}`);
  lines.push('');
  fs.writeFileSync(path.join(outDir, 'technical-seo-audit.md'), lines.join('\n'));
  return outDir;
}

const sitemapUrls = extractSitemapUrls();
const sitemapSet = new Set(sitemapUrls);
const pages = keyPages.map((file) => auditPage(file, sitemapSet));
const pricingHtml = readIfExists('pricing.html');
const pricingBlocks = extractJsonLd(pricingHtml);
const missingLocalFiles = [];
const missingCanonicalSelfReference = [];
for (const url of sitemapUrls) {
  if (!url.startsWith(siteBase)) continue;
  const file = localFileForUrl(url);
  const full = path.join(root, file);
  if (!fs.existsSync(full)) {
    missingLocalFiles.push(`${url} -> ${file}`);
    continue;
  }
  if (file.endsWith('.html')) {
    const html = fs.readFileSync(full, 'utf8');
    const canonical = extractAttr(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
    if (canonical && normalizeUrl(canonical) !== normalizeUrl(url)) missingCanonicalSelfReference.push(`${url} has canonical ${canonical}`);
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  siteBase,
  pages,
  pricing: pricingChecks(pricingHtml, pricingBlocks),
  sitemap: {
    urlCount: sitemapUrls.length,
    missingLocalFiles,
    missingCanonicalSelfReference
  },
  summary: {
    jsonLdBlocks: pages.reduce((sum, page) => sum + (page.jsonLdBlocks || 0), 0),
    invalidJsonLdBlocks: pages.reduce((sum, page) => sum + ((page.invalidJsonLdBlocks || []).length), 0),
    issueCount: pages.reduce((sum, page) => sum + ((page.issues || []).length), 0)
  },
  liveVerificationQueue: [
    `${siteBase}/`,
    `${siteBase}/pricing`,
    `${siteBase}/service-websites`,
    `${siteBase}/service-local-seo`,
    `${siteBase}/service-google-business-profile`,
    `${siteBase}/free-website-audit`,
    `${siteBase}/case-study-knight-group`,
    `${siteBase}/case-study-screen-team`,
    `${siteBase}/case-study-jns`
  ]
};

const outDir = writeReports(report);
console.log(`Wrote audit reports to ${outDir}`);
console.log(`Pages audited: ${report.pages.length}`);
console.log(`Invalid JSON-LD blocks: ${report.summary.invalidJsonLdBlocks}`);
console.log(`Total issues flagged: ${report.summary.issueCount}`);
if (report.pricing.socialPackagePricingNote) console.log(`Pricing drift: ${report.pricing.socialPackagePricingNote}`);
