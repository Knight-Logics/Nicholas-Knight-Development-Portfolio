#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { siteProfiles } = require('./qa-config');

function printHelp() {
  console.log(`Knight Logics Lighthouse sweep

Usage:
  node scripts/qa-lighthouse.js [options]

Options:
  --base=<url>          Base URL to audit. Default: http://127.0.0.1:4178
  --profile=<name>      Route profile: knightlogics-core, knightlogics-services, client-demo
  --preset=<name>       mobile, desktop, or all. Default: mobile
  --help                Show this help text

Examples:
  npm run qa:lighthouse
  npm run qa:lighthouse -- --base=https://knightlogics.com --preset=all
`);
}

function parseArgs(argv) {
  const options = {
    base: 'http://127.0.0.1:4178',
    profile: 'knightlogics-core',
    preset: 'mobile',
    help: false,
  };

  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }
    if (arg.startsWith('--base=')) {
      options.base = arg.slice('--base='.length);
      continue;
    }
    if (arg.startsWith('--profile=')) {
      options.profile = arg.slice('--profile='.length);
      continue;
    }
    if (arg.startsWith('--preset=')) {
      options.preset = arg.slice('--preset='.length);
    }
  }

  return options;
}

function timestampSlug() {
  return new Date().toISOString().replace(/[.:]/g, '-');
}

function buildUrl(base, routePath) {
  return new URL(routePath, base).toString();
}

function slugify(value) {
  return value.replace(/[^a-z0-9-]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase();
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function presetsFor(value) {
  if (value === 'all') {
    return ['mobile', 'desktop'];
  }
  return [value];
}

function getScores(reportPath) {
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const categories = report.categories;
  const audits = report.audits;

  return {
    accessibility: Math.round((categories.accessibility?.score || 0) * 100),
    bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
    cls: audits['cumulative-layout-shift']?.displayValue || 'n/a',
    lcp: audits['largest-contentful-paint']?.displayValue || 'n/a',
    performance: Math.round((categories.performance?.score || 0) * 100),
    seo: Math.round((categories.seo?.score || 0) * 100),
    tbt: audits['total-blocking-time']?.displayValue || 'n/a',
  };
}

function runLighthouse(url, outputPath, preset) {
  const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const args = [
    'lighthouse@12',
    `"${url}"`,
    '--output=json',
    `--output-path="${outputPath}"`,
    '--only-categories=performance,accessibility,best-practices,seo',
    '--chrome-flags="--headless=new --no-sandbox"',
    '--quiet',
  ];

  if (preset === 'desktop') {
    args.push('--preset=desktop');
  } else {
    args.push('--form-factor=mobile');
    args.push('--throttling-method=simulate');
  }

  execSync(`${npxCommand} ${args.join(' ')}`, {
    cwd: process.cwd(),
    stdio: 'pipe',
    timeout: 240000,
  });
}

function writeMarkdown(reportPath, summary) {
  const lines = [];
  lines.push('# Lighthouse QA Summary');
  lines.push('');
  lines.push(`- Generated: ${summary.generatedAt}`);
  lines.push(`- Base URL: ${summary.baseUrl}`);
  lines.push(`- Profile: ${summary.profile}`);
  lines.push(`- Presets: ${summary.presets.join(', ')}`);
  lines.push('');
  lines.push('| Page | Preset | Perf | A11y | BP | SEO | LCP | CLS | TBT |');
  lines.push('| --- | --- | ---: | ---: | ---: | ---: | --- | --- | --- |');

  for (const result of summary.results) {
    lines.push(
      `| ${result.routeName} | ${result.preset} | ${result.performance} | ${result.accessibility} | ${result.bestPractices} | ${result.seo} | ${result.lcp} | ${result.cls} | ${result.tbt} |`
    );
  }

  lines.push('');
  fs.writeFileSync(reportPath, `${lines.join('\n')}\n`, 'utf8');
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const profile = siteProfiles[options.profile];
  if (!profile) {
    console.error(`Unknown profile: ${options.profile}`);
    printHelp();
    process.exit(1);
  }

  const presets = presetsFor(options.preset);
  const outputDir = path.join(process.cwd(), 'test-results', 'lighthouse', `${slugify(options.profile)}-${timestampSlug()}`);
  ensureDir(outputDir);

  const results = [];

  for (const route of profile.routes) {
    const url = buildUrl(options.base, route.path);
    for (const preset of presets) {
      const outputPath = path.join(outputDir, `${route.name}-${preset}.json`);
      console.log(`Running Lighthouse: ${url} (${preset})`);
      runLighthouse(url, outputPath, preset);
      const scores = getScores(outputPath);
      results.push({
        preset,
        routeName: route.name,
        url,
        ...scores,
      });
    }
  }

  const summary = {
    baseUrl: options.base,
    generatedAt: new Date().toISOString(),
    outputDir,
    presets,
    profile: options.profile,
    results,
  };

  const summaryJson = path.join(outputDir, 'summary.json');
  const summaryMd = path.join(outputDir, 'summary.md');
  fs.writeFileSync(summaryJson, JSON.stringify(summary, null, 2), 'utf8');
  writeMarkdown(summaryMd, summary);

  console.log(`Lighthouse summary written to: ${outputDir}`);
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
}