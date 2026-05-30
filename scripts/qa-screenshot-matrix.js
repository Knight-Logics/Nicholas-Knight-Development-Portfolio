#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { defaultViewports, siteProfiles } = require('./qa-config');

function printHelp() {
  console.log(`Knight Logics screenshot QA runner

Usage:
  node scripts/qa-screenshot-matrix.js [options]

Options:
  --base=<url>          Base URL to test. Default: http://127.0.0.1:4178
  --profile=<name>      Route profile: knightlogics-core, knightlogics-services, client-demo
  --browser=<list>      Comma-separated browsers: chromium,webkit,firefox. Default: chromium,webkit
  --headed              Run with visible browser windows
  --strict              Exit with code 1 when warnings are found
  --help                Show this help text

Examples:
  npm run qa:screenshots
  npm run qa:screenshots -- --base=https://knightlogics.com
  node scripts/qa-screenshot-matrix.js --profile=client-demo --base=http://127.0.0.1:4178 --browser=chromium
`);
}

function parseArgs(argv) {
  const options = {
    base: 'http://127.0.0.1:4178',
    profile: 'knightlogics-core',
    browsers: ['chromium', 'webkit'],
    headless: true,
    strict: false,
    help: false,
  };

  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }
    if (arg === '--headed') {
      options.headless = false;
      continue;
    }
    if (arg === '--strict') {
      options.strict = true;
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
    if (arg.startsWith('--browser=')) {
      options.browsers = arg
        .slice('--browser='.length)
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
    }
  }

  return options;
}

function buildUrl(base, routePath) {
  return new URL(routePath, base).toString();
}

function slugify(value) {
  return value.replace(/[^a-z0-9-]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase();
}

function normalizeUrl(value) {
  if (!value) {
    return value;
  }
  try {
    const parsed = new URL(value);
    const pathname = parsed.pathname === '/' ? '/' : parsed.pathname.replace(/\/+$/, '');
    return `${parsed.origin}${pathname}`;
  } catch (error) {
    return value.replace(/\/+$/, '');
  }
}

function timestampSlug() {
  return new Date().toISOString().replace(/[.:]/g, '-');
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

async function scrollForLazyContent(page) {
  await page.evaluate(async () => {
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((resolve) => setTimeout(resolve, 300));
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(300);
}

async function maybeOpenMobileNav(page) {
  const selectors = [
    'button[aria-label*="menu" i]',
    'button[aria-label*="navigation" i]',
    'button[aria-controls*="menu" i]',
    '[data-mobile-menu-toggle]',
    '.mobile-menu-toggle',
    '.menu-toggle',
    '.hamburger',
    'button:has(.fa-bars)',
    'button:has(.fas.fa-bars)',
  ];

  for (const selector of selectors) {
    const candidate = page.locator(selector).first();
    if (await candidate.count() === 0) {
      continue;
    }
    try {
      if (await candidate.isVisible({ timeout: 1000 })) {
        await candidate.click({ timeout: 3000 });
        await page.waitForTimeout(400);
        return true;
      }
    } catch (error) {
      continue;
    }
  }

  return false;
}

async function collectPageData(page) {
  return page.evaluate(() => {
    const cleanText = (value) => (value || '').replace(/\s+/g, ' ').trim();
    const isVisible = (element) => {
      if (!element) {
        return false;
      }
      const style = window.getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) {
        return false;
      }
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };

    const title = document.title;
    const h1 = cleanText(document.querySelector('h1')?.textContent || '');
    const forms = Array.from(document.querySelectorAll('form')).filter(isVisible);
    const footerLinks = Array.from(document.querySelectorAll('footer a[href], #footer-container a[href]'))
      .filter(isVisible)
      .map((link) => link.href);
    const ctaPattern = /(book|consult|contact|audit|pricing|get started|start|schedule|call|quote|buy now|learn more)/i;
    const ctas = Array.from(document.querySelectorAll('a[href], button, [role="button"]'))
      .filter(isVisible)
      .map((element) => {
        const href = element.tagName === 'A' ? element.href : '';
        const label = cleanText(element.textContent || element.getAttribute('aria-label') || '');
        return { href, label };
      })
      .filter((entry) => ctaPattern.test(entry.label) || ctaPattern.test(entry.href));

    const images = Array.from(document.images);
    const meaningfulImages = images.filter((img) => {
      const src = (img.currentSrc || img.getAttribute('src') || '').trim();
      if (!src || src.startsWith('data:')) {
        return false;
      }
      if (!isVisible(img)) {
        return false;
      }
      const rect = img.getBoundingClientRect();
      return rect.width >= 24 && rect.height >= 24;
    });
    const brokenImages = meaningfulImages
      .filter((img) => !img.complete || img.naturalWidth === 0)
      .map((img) => img.currentSrc || img.src || '(inline image)');

    const heroSelectors = [
      '[data-hero]',
      '.hero',
      '[class*="hero"]',
      '[id*="hero"]',
      'main section:first-of-type',
    ];

    let heroFound = false;
    let heroImageLoaded = true;

    for (const selector of heroSelectors) {
      const element = document.querySelector(selector);
      if (!element || !isVisible(element)) {
        continue;
      }
      heroFound = true;
      const image = element.tagName === 'IMG' ? element : element.querySelector('img');
      if (image) {
        heroImageLoaded = image.complete && image.naturalWidth > 0;
      }
      break;
    }

    if (!heroFound) {
      const image = images.find((img) => {
        if (!isVisible(img)) {
          return false;
        }
        const rect = img.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.width >= 120 && rect.height >= 120;
      });
      if (image) {
        heroFound = true;
        heroImageLoaded = image.complete && image.naturalWidth > 0;
      }
    }

    const mobileNavToggleFound = Array.from(document.querySelectorAll('button, a, [role="button"]')).some((element) => {
      const label = `${cleanText(element.textContent || '')} ${cleanText(element.getAttribute('aria-label') || '')}`;
      return /menu|navigation|nav/i.test(label);
    });

    return {
      ctaCount: ctas.length,
      ctas: ctas.slice(0, 12),
      footerLinkCount: footerLinks.length,
      footerLinks: footerLinks.slice(0, 20),
      formCount: forms.length,
      h1,
      heroFound,
      heroImageLoaded,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 2,
      imageCount: meaningfulImages.length,
      brokenImages,
      mobileNavToggleFound,
      title,
      url: location.href,
    };
  });
}

function collectWarnings(route, viewport, pageData, navigationError, responseStatus, pageErrors, consoleErrors, mobileNavOpened, requestedUrl) {
  const warnings = [];

  if (navigationError) {
    warnings.push(`Navigation failed: ${navigationError}`);
    return warnings;
  }

  if (typeof responseStatus === 'number' && responseStatus >= 400) {
    warnings.push(`HTTP ${responseStatus}`);
  }
  if (normalizeUrl(pageData.url) !== normalizeUrl(requestedUrl)) {
    warnings.push(`Final URL differs from requested route: ${pageData.url}`);
  }
  if (pageData.horizontalOverflow) {
    warnings.push('Horizontal overflow detected');
  }
  if (pageData.brokenImages.length > 0) {
    warnings.push(`${pageData.brokenImages.length} broken image(s)`);
  }
  if (route.expectsForm && pageData.formCount === 0) {
    warnings.push('Expected form not found');
  }
  if (route.expectsHero && pageData.heroFound && !pageData.heroImageLoaded) {
    warnings.push('Hero image did not finish loading');
  }
  if (route.expectsHero && !pageData.heroFound) {
    warnings.push('Hero section not detected');
  }
  if (route.requiresMobileNav && viewport.isMobile && !pageData.mobileNavToggleFound && !mobileNavOpened) {
    warnings.push('Mobile nav toggle not detected');
  }
  if (route.requiresMobileNav && viewport.isMobile && pageData.mobileNavToggleFound && !mobileNavOpened) {
    warnings.push('Mobile nav toggle found but did not open');
  }
  if (pageData.footerLinkCount === 0) {
    warnings.push('Footer links not detected');
  }
  if (pageData.ctaCount === 0) {
    warnings.push('No CTA buttons or links detected');
  }
  if (pageErrors.length > 0) {
    warnings.push(`${pageErrors.length} page error(s)`);
  }
  if (consoleErrors.length > 0) {
    warnings.push(`${consoleErrors.length} console error(s)`);
  }

  return warnings;
}

function writeMarkdownReport(reportPath, report) {
  const lines = [];
  lines.push('# Screenshot QA Report');
  lines.push('');
  lines.push(`- Generated: ${report.generatedAt}`);
  lines.push(`- Base URL: ${report.baseUrl}`);
  lines.push(`- Profile: ${report.profile}`);
  lines.push(`- Browsers: ${report.browsers.join(', ')}`);
  lines.push(`- Output directory: ${report.outputDir}`);
  lines.push(`- Pages captured: ${report.results.length}`);
  lines.push(`- Warnings: ${report.warningCount}`);
  lines.push('');
  lines.push('| Page | Viewport | Browser | Screenshot | Warnings |');
  lines.push('| --- | --- | --- | --- | --- |');

  for (const result of report.results) {
    const warningText = result.warnings.length > 0 ? result.warnings.join('; ') : 'None';
    lines.push(`| ${result.routeName} | ${result.viewport} | ${result.browser} | ${result.screenshotFile || 'n/a'} | ${warningText} |`);
  }

  lines.push('');
  lines.push('## Manual Follow-up');
  lines.push('');
  lines.push('- Open the PNG files in this run directory and check for blank sections, layout breaks, hero issues, and CTA visibility.');
  lines.push('- Review the full launch checklist in LAUNCH_QA_CHECKLIST.md before BrowserStack final checks.');
  lines.push('');

  fs.writeFileSync(reportPath, `${lines.join('\n')}\n`, 'utf8');
}

async function main() {
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

  let playwright;
  try {
    playwright = require('playwright');
  } catch (error) {
    console.error('Playwright is not installed in MainSite. Run: npm install -D playwright');
    process.exit(1);
  }

  const browserTypes = {
    chromium: playwright.chromium,
    firefox: playwright.firefox,
    webkit: playwright.webkit,
  };

  const requestedBrowsers = options.browsers.filter((name) => browserTypes[name]);
  if (requestedBrowsers.length === 0) {
    console.error(`No valid browsers supplied. Received: ${options.browsers.join(', ')}`);
    process.exit(1);
  }

  const runDir = path.join(process.cwd(), '.qa-matrix', 'runs', `${slugify(options.profile)}-${timestampSlug()}`);
  ensureDir(runDir);

  const results = [];

  for (const browserName of requestedBrowsers) {
    const browser = await browserTypes[browserName].launch({ headless: options.headless });

    try {
      for (const viewport of defaultViewports) {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          deviceScaleFactor: viewport.deviceScaleFactor,
          hasTouch: viewport.hasTouch,
          isMobile: viewport.isMobile,
          ignoreHTTPSErrors: true,
        });

        for (const route of profile.routes) {
          const page = await context.newPage();
          const pageErrors = [];
          const consoleErrors = [];
          page.on('pageerror', (error) => pageErrors.push(String(error.message || error)));
          page.on('console', (message) => {
            if (message.type() === 'error') {
              consoleErrors.push(message.text());
            }
          });

          const url = buildUrl(options.base, route.path);
          const screenshotFile = `${route.name}-${viewport.name}-${browserName}.png`;
          const screenshotPath = path.join(runDir, screenshotFile);
          const mobileNavFile = `${route.name}-${viewport.name}-${browserName}-nav-open.png`;
          const mobileNavPath = path.join(runDir, mobileNavFile);

          let responseStatus = null;
          let navigationError = '';
          let pageData = {
            ctaCount: 0,
            ctas: [],
            footerLinkCount: 0,
            footerLinks: [],
            formCount: 0,
            h1: '',
            heroFound: false,
            heroImageLoaded: true,
            horizontalOverflow: false,
            imageCount: 0,
            brokenImages: [],
            mobileNavToggleFound: false,
            title: '',
            url,
          };
          let mobileNavOpened = false;
          let mobileNavScreenshot = '';

          try {
            const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
            responseStatus = response ? response.status() : null;
            await scrollForLazyContent(page);
            pageData = await collectPageData(page);

            await page.screenshot({ path: screenshotPath, fullPage: true });

            if (viewport.isMobile && route.requiresMobileNav) {
              mobileNavOpened = await maybeOpenMobileNav(page);
              if (mobileNavOpened) {
                pageData.mobileNavToggleFound = true;
                await page.screenshot({ path: mobileNavPath, fullPage: false });
                mobileNavScreenshot = mobileNavFile;
              }
            }
          } catch (error) {
            navigationError = error.message;
          }

          const warnings = collectWarnings(
            route,
            viewport,
            pageData,
            navigationError,
            responseStatus,
            pageErrors,
            consoleErrors,
            mobileNavOpened,
            url
          );

          results.push({
            browser: browserName,
            consoleErrors: consoleErrors.slice(0, 10),
            h1: pageData.h1,
            pageErrors: pageErrors.slice(0, 10),
            requestedUrl: url,
            responseStatus,
            routeName: route.name,
            screenshotFile: navigationError ? '' : screenshotFile,
            mobileNavScreenshot,
            title: pageData.title,
            url: pageData.url || url,
            viewport: viewport.name,
            warnings,
          });

          await page.close();
        }

        await context.close();
      }
    } finally {
      await browser.close();
    }
  }

  const report = {
    baseUrl: options.base,
    browsers: requestedBrowsers,
    generatedAt: new Date().toISOString(),
    outputDir: runDir,
    profile: options.profile,
    results,
    warningCount: results.reduce((total, result) => total + result.warnings.length, 0),
  };

  const jsonPath = path.join(runDir, 'report.json');
  const markdownPath = path.join(runDir, 'report.md');
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8');
  writeMarkdownReport(markdownPath, report);

  console.log(`Screenshot QA complete: ${runDir}`);
  console.log(`Warnings found: ${report.warningCount}`);

  if (options.strict && report.warningCount > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});