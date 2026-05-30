const defaultViewports = [
  {
    name: 'desktop',
    width: 1440,
    height: 1600,
    isMobile: false,
    hasTouch: false,
    deviceScaleFactor: 1,
  },
  {
    name: 'tablet',
    width: 1024,
    height: 1366,
    isMobile: false,
    hasTouch: true,
    deviceScaleFactor: 1,
  },
  {
    name: 'mobile',
    width: 390,
    height: 844,
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  },
];

const siteProfiles = {
  'knightlogics-core': {
    label: 'Knight Logics core conversion pages',
    routes: [
      { name: 'home', path: '/', expectsHero: true, requiresMobileNav: true },
      { name: 'pricing', path: '/pricing', expectsHero: true, requiresMobileNav: true },
      { name: 'service-websites', path: '/service-websites', expectsHero: true, requiresMobileNav: true },
      { name: 'contact', path: '/contact', expectsHero: true, expectsForm: true, requiresMobileNav: true },
      { name: 'book-consultation', path: '/book-consultation', expectsHero: true, expectsForm: true, requiresMobileNav: true },
      { name: 'projects', path: '/projects', requiresMobileNav: true },
    ],
  },
  'knightlogics-services': {
    label: 'Knight Logics service pages',
    routes: [
      { name: 'automation', path: '/automation', expectsHero: true, requiresMobileNav: true },
      { name: 'service-websites', path: '/service-websites', expectsHero: true, requiresMobileNav: true },
      { name: 'service-local-seo', path: '/service-local-seo', expectsHero: true, requiresMobileNav: true },
      { name: 'service-google-business-profile', path: '/service-google-business-profile', expectsHero: true, requiresMobileNav: true },
      { name: 'service-ai-automation', path: '/service-ai-automation', expectsHero: true, requiresMobileNav: true },
      { name: 'service-ecommerce', path: '/service-ecommerce', expectsHero: true, requiresMobileNav: true },
      { name: 'service-desktop-apps', path: '/service-desktop-apps', expectsHero: true, requiresMobileNav: true },
    ],
  },
  'client-demo': {
    label: 'Client or demo site template pages',
    routes: [
      { name: 'home', path: '/', expectsHero: true, requiresMobileNav: true },
      { name: 'services', path: '/services', expectsHero: true, requiresMobileNav: true },
      { name: 'contact', path: '/contact', expectsHero: true, expectsForm: true, requiresMobileNav: true },
      { name: 'about', path: '/about', expectsHero: true, requiresMobileNav: true },
      { name: 'gallery', path: '/gallery', requiresMobileNav: true },
    ],
  },
};

const browserstackTargets = [
  'iPhone Safari',
  'Android Chrome',
  'Safari desktop',
  'Firefox',
];

const checklistItems = [
  'Homepage screenshot desktop/mobile',
  'All service pages desktop/mobile',
  'Contact form visible and working',
  'CTA buttons working',
  'No black or blank sections',
  'No horizontal scrolling',
  'Hero image loads correctly',
  'Nav menu works on mobile',
  'Footer links work',
  'Pricing is consistent',
  'Stripe buttons work',
  'GSC has submitted sitemap',
  'Schema validates',
  'Clarity and GA4 are installed',
];

module.exports = {
  browserstackTargets,
  checklistItems,
  defaultViewports,
  siteProfiles,
};