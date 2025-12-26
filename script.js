// Loading Screen and Initial Setup
// Global variables for landing mode
let isInLandingMode = true;
let exitLandingMode = null;
let suppressLandingReentry = false; // Prevent immediate hero re-entry after nav clicks

// Dynamic Header and Footer Loading
async function loadHeaderFooter() {
    try {
        // Load header
        const headerResponse = await fetch('/header.html');
        if (!headerResponse.ok) {
            console.warn('Header fetch failed:', headerResponse.status);
        } else {
            const headerContent = await headerResponse.text();
            const headerContainer = document.getElementById('header-container');
            if (headerContainer) {
                headerContainer.innerHTML = headerContent;
            }
        }
        
        // Load footer
        const footerResponse = await fetch('/footer.html');
        if (!footerResponse.ok) {
            console.warn('Footer fetch failed:', footerResponse.status);
        } else {
            const footerContent = await footerResponse.text();
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) {
                footerContainer.innerHTML = footerContent;
            }
        }
    } catch (error) {
        console.error('Error loading header/footer:', error);
    }
}

// Load header and footer on page load, then initialize everything
document.addEventListener('DOMContentLoaded', async function() {
    // Load header and footer first
    await loadHeaderFooter();
    
    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initLayeredParallax();
    initProjectFilters();
    initVideoPlayer();
    initSkillBars();
    initAnimations();
    initCursorTrail();
    initMagneticButtons();
    initAdvancedParallax();
    initMobileReadMore();
    
    // Smooth scrolling for anchor links (same-page and index.html#section)
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            const isSamePageHash = href.startsWith('#');
            const isIndexHash = /(^|\/)index\.html#/.test(href);
            const isRootHash = /^\/#[^\s]+$/.test(href);
            const onIndexPage = /(^|\/)index\.html$/.test(window.location.pathname) || window.location.pathname === '/';

            // Determine target hash for same-page scrolling
            const hash = isSamePageHash
                ? href
                : ((isIndexHash || isRootHash) && onIndexPage ? href.substring(href.indexOf('#')) : null);

            if (hash) {
                // Try direct target, then case-insensitive, then alias mapping
                const aliasMap = {
                    '#featured-projects': '#work'
                };
                const normHash = hash.toLowerCase();
                let target = document.querySelector(hash)
                    || document.querySelector(`[id="${normHash.replace('#','')}"]`)
                    || (aliasMap[normHash] ? document.querySelector(aliasMap[normHash]) : null);

                if (target) {
                    e.preventDefault();

                    const scrollWithOffset = () => {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        const navbar = document.querySelector('.navbar');
                        const offset = navbar ? navbar.offsetHeight : 0;
                        if (offset) {
                            // Apply a small delay so offset adjusts after scrollIntoView completes
                            setTimeout(() => { window.scrollBy(0, -offset); }, 250);
                        }
                        history.pushState(null, null, hash);
                    };

                    // Exit landing overlay first if active, then scroll
                    if (isInLandingMode && typeof exitLandingMode === 'function') {
                        suppressLandingReentry = true;
                        exitLandingMode();
                        setTimeout(() => {
                            scrollWithOffset();
                            // Clear suppression shortly after scroll completes
                            setTimeout(() => { suppressLandingReentry = false; }, 1000);
                        }, 900);
                    } else {
                        scrollWithOffset();
                    }
                }
            }
            // Otherwise, allow normal navigation (e.g., projects.html)
        });
    });
    
    // Hide loading screen after page loads
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                // Start main animations after loading screen disappears
                initMainAnimations();
            }, 500);
        }
    }, 1000);
});

// Fixed Hero Landing Screen with Code Forest Exit Effect
function initLayeredParallax() {
    const heroSection = document.querySelector('#hero');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const codeForest = document.querySelector('.parallax-bg-near');
    const cityBg = document.querySelector('.parallax-bg-far');
    const grungeLayer = document.querySelector('.parallax-bg-mid');
    
    // Debug element selection
    console.log('🔍 Element selection:');
    console.log('🌲 codeForest (.parallax-bg-near):', codeForest);
    console.log('🏙️ cityBg (.parallax-bg-far):', cityBg);
    console.log('🌫️ grungeLayer (.parallax-bg-mid):', grungeLayer);
    
    if (!heroSection || !codeForest) {
        console.log('Hero elements not found');
        return;
    }
    
    // Check if mobile device
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.log('📱 Mobile detection: width=', window.innerWidth, 'isMobile=', isMobile, 'userAgent=', navigator.userAgent);
    
    // Check if user navigated to a specific section (has hash in URL)
    const hasHash = window.location.hash && window.location.hash.length > 1;
    
    // Mobile should also use landing mode - just like desktop!
    if (isMobile) {
        console.log('📱 Mobile device detected - using SAME landing mode as desktop');
        // Keep isInLandingMode = true for mobile too!
        // Mobile will use touch events that simulate wheel events
    }
    
    let scrollActionCount = 0;
    let lastScrollY = 0;
    let lastScrollPosition = 0; // Track scroll position for re-entry detection
    let scrollBarActionCount = 0; // Track scrollbar usage separately
    let lastScrollbarPosition = 0;
    let isScrollbarScrolling = false;
    const maxLandingScrolls = 3; // Stay on landing screen for 3 scroll actions
    
    // Prevent default scrolling during landing mode
    function preventScroll(e) {
        if (isInLandingMode) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
    
    // Mobile touch handling for landing mode
    let touchStartY = 0;
    // Mobile now uses same scrollActionCount as desktop (no separate touchMoves needed)
    
    function handleTouchStart(e) {
        if (isInLandingMode) {
            touchStartY = e.touches[0].clientY;
        }
    }
    
    function handleTouchMove(e) {
        console.log('📱 Touch move detected, isInLandingMode:', isInLandingMode);
        if (!isInLandingMode) return;
        
        e.preventDefault();
        e.stopPropagation();
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        
        console.log('📱 Touch deltaY:', deltaY, 'Threshold check:', Math.abs(deltaY) > 20);
        
        // Simulate wheel events for mobile - use SAME logic as desktop
        if (Math.abs(deltaY) > 20) {
            console.log('📱 Creating fake wheel event with deltaY:', deltaY > 0 ? 100 : -100);
            
            // Create fake wheel event and use same handler
            const fakeWheelEvent = {
                deltaY: deltaY > 0 ? 100 : -100, // Positive = down, negative = up
                preventDefault: () => {}
            };
            
            // Use the SAME wheel handler as desktop
            console.log('📱 Calling handleWheelScroll with fake event');
            handleWheelScroll(fakeWheelEvent);
            
            touchStartY = touchY; // Reset for next move
        }
    }
    
    function handleWheelScroll(e) {
        if (!isInLandingMode) {
            const currentScroll = window.pageYOffset;
            const aboutSection = document.querySelector('#about');
            const aboutSectionTop = aboutSection ? aboutSection.offsetTop : 0;
            
            // Enhanced scroll-up detection for blank space and About section
            if (e.deltaY < 0) { // Scrolling up
                // Trigger if in the blank space above About or at the very top of About section
                if (!suppressLandingReentry && currentScroll <= aboutSectionTop + 200) { // Include blank space + top portion of About
                    e.preventDefault();
                    console.log('🔄 Scroll up detected at position:', currentScroll, 'About section at:', aboutSectionTop);
                    enterLandingMode();
                    return;
                }
            }
            return;
        }
        
        e.preventDefault();
        
        // Count scroll actions (wheel events)
        if (e.deltaY > 0) { // Scrolling down
            scrollActionCount = Math.min(scrollActionCount + 1, maxLandingScrolls);
        } else { // Scrolling up
            scrollActionCount = Math.max(scrollActionCount - 1, 0);
        }
        
        updateForestEffect();
        
        // Exit landing mode after max scrolls
        if (scrollActionCount >= maxLandingScrolls) {
            exitLandingModeFunction();
        }
    }
    
    function updateForestEffect() {
        // Both mobile and desktop now use scrollActionCount since mobile calls handleWheelScroll
        const isMobile = window.innerWidth <= 768;
        const currentProgress = scrollActionCount / maxLandingScrolls; // Unified progress tracking
        const progress = Math.min(currentProgress, 1);
        
        console.log(`🌲 updateForestEffect - Mobile: ${isMobile}, ScrollActions: ${scrollActionCount}/${maxLandingScrolls}, Progress: ${progress}`);
        
        if (codeForest) {
            // EXPAND the code forest - this creates the "exiting forest" illusion
            // As the image gets larger, less of the branches are visible in the frame
            const scale = 1 + (progress * 2); // Grows from 100% to 300%
            const opacity = Math.max(0.9 - (progress * 0.6), 0.1); // Gradually fade
            
            console.log(`🌲 Forest transform: scale(${scale.toFixed(2)}), opacity: ${opacity.toFixed(2)}`);
            console.log(`🌲 Forest element:`, codeForest);
            
            // Use 3D transform for better mobile performance and force hardware acceleration
            codeForest.style.transform = `translate3d(0, 0, 0) scale(${scale})`;
            codeForest.style.opacity = opacity;
            codeForest.style.willChange = 'transform, opacity';
            
            // Check if transform was applied
            console.log(`🌲 Applied transform result:`, codeForest.style.transform);
        } else {
            console.log('❌ codeForest element not found! Selector: .parallax-bg-near');
        }
        
        // City background stays COMPLETELY STATIC (never moves)
        if (cityBg) {
            cityBg.style.transform = 'none !important';
            cityBg.style.transformOrigin = 'center center';
            cityBg.style.backgroundPosition = 'center center';
            cityBg.style.backgroundSize = 'cover';
            cityBg.style.opacity = Math.min(0.8 + (progress * 0.3), 1);
        }
        
        // Grunge layer subtle effect
        if (grungeLayer) {
            grungeLayer.style.opacity = Math.max(0.2 - (progress * 0.1), 0.05);
        }
        
        // Keep title visible throughout the parallax sequence (don't fade until exit)
        if (heroTitle) {
            heroTitle.style.opacity = 1;
            heroTitle.style.transform = 'translateY(0px)';
        }
        if (heroSubtitle) {
            heroSubtitle.style.opacity = 1;
            heroSubtitle.style.transform = 'translateY(0px)';
        }
        
        // Keep CTA buttons visible throughout the parallax sequence
        const heroCTAButtons = document.querySelector('.hero-cta-buttons');
        if (heroCTAButtons) {
            heroCTAButtons.style.opacity = 1;
            heroCTAButtons.style.transform = 'translateY(0px)';
        }
        
        if (scrollIndicator) {
            scrollIndicator.style.opacity = Math.max(1 - (progress * 1.5), 0);
        }
        
        console.log(`Forest exit progress: ${(progress * 100).toFixed(1)}% (${scrollActionCount}/${maxLandingScrolls} scrolls)`);
    }
    
    function exitLandingModeFunction() {
        isInLandingMode = false;
        scrollActionCount = 0; // Reset for next time
        scrollBarActionCount = 0; // Reset scrollbar tracking
        lastScrollbarPosition = 0;
        isScrollbarScrolling = false;
        // Mobile now uses same scrollActionCount reset as desktop
        
        // Transition to About section (first content section)
        if (heroSection) {
            heroSection.style.transition = 'opacity 0.8s ease-out';
            heroSection.style.opacity = '0';
            
            setTimeout(() => {
                heroSection.style.display = 'none';
                document.body.classList.remove('landing-mode');
                document.body.style.overflow = 'auto';
                
                // Scroll to About section (first after hero) with proper positioning
                const aboutSection = document.querySelector('.about') || document.querySelector('#about');
                if (aboutSection) {
                    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
                    // Position to show About section at the top, accounting for its negative margin
                    const offsetTop = aboutSection.offsetTop - navbarHeight + 30; // Adjusted for new margins
                    window.scrollTo({
                        top: Math.max(0, offsetTop),
                        behavior: 'smooth'
                    });
                }
                
                console.log('Exited landing mode - scrolled to About section');
            }, 800);
        }
        
        // Remove scroll prevention but keep wheel listener for re-entry
        document.removeEventListener('touchmove', preventScroll, { passive: false });
        document.removeEventListener('keydown', preventKeyScroll);
    }
    
    // Assign to global variable for access from navigation
    exitLandingMode = exitLandingModeFunction;
    
    // Handle hash navigation - automatically exit landing mode and scroll to target
    if (hasHash) {
        console.log('Hash detected in URL - auto-exiting landing mode and scrolling to:', window.location.hash);
        setTimeout(() => {
            if (isInLandingMode) {
                // Use a modified exit that doesn't auto-scroll to about
                isInLandingMode = false;
                scrollActionCount = 0;
                
                if (heroSection) {
                    heroSection.style.transition = 'opacity 0.8s ease-out';
                    heroSection.style.opacity = '0';
                    
                    setTimeout(() => {
                        heroSection.style.display = 'none';
                        document.body.style.overflow = 'auto';
                        
                        // Scroll to the hash target instead of about section
                        const targetSection = document.querySelector(window.location.hash);
                        if (targetSection) {
                            const offsetTop = targetSection.offsetTop - 100;
                            window.scrollTo({
                                top: offsetTop,
                                behavior: 'smooth'
                            });
                            console.log('Scrolled to hash target:', window.location.hash);
                        }
                    }, 800);
                }
                
                // Remove scroll prevention
                document.removeEventListener('touchmove', preventScroll, { passive: false });
                document.removeEventListener('keydown', preventKeyScroll);
            }
        }, 1200); // Wait a bit longer for landing mode to be fully established
    }
    
    function preventKeyScroll(e) {
        if (isInLandingMode) {
            const scrollKeys = [32, 33, 34, 35, 36, 37, 38, 39, 40]; // Space, Page Up/Down, Home, End, Arrow keys
            if (scrollKeys.includes(e.keyCode)) {
                e.preventDefault();
                return false;
            }
        }
    }
    
    function enterLandingMode() {
        scrollActionCount = 0;
        scrollBarActionCount = 0; // Reset scrollbar tracking
        lastScrollbarPosition = 0;
        isScrollbarScrolling = false;
        isInLandingMode = true;
        
        if (heroSection) {
            heroSection.style.display = 'flex';
            heroSection.style.opacity = '1';
            heroSection.style.transition = 'opacity 0.5s ease-in';
            document.body.classList.add('landing-mode');
            document.body.style.overflow = 'hidden';
        }
        
        updateForestEffect();
        
        // Re-add scroll prevention
        document.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('keydown', preventKeyScroll);
        
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        console.log('Re-entered landing mode');
    }
    
    function handleScrollBarScroll() {
        if (!isInLandingMode) return;
        
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDelta = currentScrollTop - lastScrollbarPosition;
        
        // Ignore tiny movements and initial position resets
        if (Math.abs(scrollDelta) > 10 && currentScrollTop > 5) {
            console.log('📜 Scrollbar movement detected:', scrollDelta, 'Current position:', currentScrollTop);
            
            if (scrollDelta > 0) { // Scrolling down with scrollbar
                scrollBarActionCount++;
                isScrollbarScrolling = true;
                
                console.log('📜 Scrollbar action count:', scrollBarActionCount, '/', maxLandingScrolls);
                
                // Use the same visual effect as wheel scrolling
                scrollActionCount = Math.min(scrollBarActionCount, maxLandingScrolls);
                updateForestEffect();
                
                // Exit landing mode after max scrollbar actions
                if (scrollBarActionCount >= maxLandingScrolls) {
                    console.log('📜 Scrollbar exit threshold reached');
                    exitLandingModeFunction();
                    return;
                }
                
                // Prevent further scrolling by resetting position after effect update
                setTimeout(() => {
                    if (isInLandingMode) {
                        window.scrollTo({ top: 0, behavior: 'auto' });
                        isScrollbarScrolling = false;
                    }
                }, 50);
                
            } else if (scrollDelta < 0) { // Scrolling up with scrollbar
                scrollBarActionCount = Math.max(scrollBarActionCount - 1, 0);
                scrollActionCount = scrollBarActionCount;
                updateForestEffect();
            }
            
            lastScrollbarPosition = currentScrollTop;
        }
    }

    function resetToLanding() {
        const currentScroll = window.pageYOffset;
        const aboutSection = document.querySelector('#about');
        const aboutSectionTop = aboutSection ? aboutSection.offsetTop : 0;
        
        // Reset scrollbar tracking when returning to landing
        if (currentScroll <= aboutSectionTop + 150 && !isInLandingMode && !suppressLandingReentry) {
            // Only trigger on upward scroll motion
            if (currentScroll < (lastScrollPosition || 0)) {
                console.log('🔄 resetToLanding triggered - returning to hero');
                scrollBarActionCount = 0;
                scrollActionCount = 0;
                lastScrollbarPosition = 0;
                isScrollbarScrolling = false;
                enterLandingMode();
            }
        }
        lastScrollPosition = currentScroll;
    }
    
    // Initialize landing mode
    if (heroSection) {
        document.body.classList.add('landing-mode');
        document.body.style.overflow = 'hidden'; // Prevent page scrolling initially
        heroSection.style.display = 'flex';
        heroSection.style.opacity = '1';
    }
    
    // Add event listeners
    document.addEventListener('wheel', handleWheelScroll, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('keydown', preventKeyScroll);

    // Add scrollbar support for landing mode
    window.addEventListener('scroll', handleScrollBarScroll, { passive: true });
    
    // Allow reset when scrolling back to top (keep this listener always active)
    window.addEventListener('scroll', resetToLanding, { passive: true });
    
    // Enhanced scroll up detection for blank space and About section header
    window.addEventListener('wheel', (e) => {
        if (!isInLandingMode && e.deltaY < 0) {
            const currentScroll = window.pageYOffset;
            const aboutSection = document.querySelector('#about');
            const aboutSectionTop = aboutSection ? aboutSection.offsetTop : 0;
            
            // Trigger when scrolling up in blank space or at About section header
            if (!suppressLandingReentry && currentScroll <= aboutSectionTop + 200) {
                e.preventDefault();
                console.log('🔄 Secondary wheel handler triggered at:', currentScroll);
                enterLandingMode();
            }
        }
    }, { passive: false });
    
    // Initial forest effect
    updateForestEffect();
    
    console.log('Fixed hero landing screen initialized - 4 scrolls to exit, scroll up at top to re-enter');
}

// Main Animations
function initMainAnimations() {
    // Animate text reveals
    setTimeout(() => {
        document.querySelectorAll('.text-reveal').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animate');
            }, index * 200);
        });
    }, 500);

    // Start counter animations
    animateCounters();
    
    // Start staggered animations
    setTimeout(() => {
        document.querySelectorAll('.stagger-item').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 150);
        });
    }, 1500);
}

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
                counter.textContent = target + '+';
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Cursor Trail Effect
function initCursorTrail() {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);
    
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateTrail() {
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        
        trail.style.left = trailX - 10 + 'px';
        trail.style.top = trailY - 10 + 'px';
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}

// Magnetic Button Effect
function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.magnetic-btn');
    
    magneticButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
        });
        
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
        });
    });
}

// Advanced Parallax Effects
function initAdvancedParallax() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Hero background parallax
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${rate}px) scale(${1 + scrolled * 0.0002})`;
        }
        
        // Rotate hero logo based on scroll
        const heroLogo = document.querySelector('.hero-logo');
        if (heroLogo) {
            const rotation = scrolled * 0.1;
            heroLogo.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(${1 + scrolled * 0.0001})`;
        }
        
        // Parallax for section backgrounds
        document.querySelectorAll('section::before').forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const scrollPercent = (scrolled - sectionTop + window.innerHeight) / (sectionHeight + window.innerHeight);
            
            if (scrollPercent >= 0 && scrollPercent <= 1) {
                const yPos = -(scrolled - sectionTop) * 0.3;
                section.style.transform = `translateY(${yPos}px)`;
            }
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Navigation
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navMenuOverlay = document.getElementById('nav-menu-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    // Enhanced hamburger menu toggle with overlay
    function toggleMobileMenu() {
        if (!navMenu || !hamburger || !navMenuOverlay) return;
        
        const isActive = navMenu.classList.contains('active');
        
        if (isActive) {
            // Close menu
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            navMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            // Open menu
            navMenu.classList.add('active');
            hamburger.classList.add('active');
            navMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }
    }

    // Hamburger click handler
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Overlay click handler - close menu when clicking overlay
    if (navMenuOverlay) {
        navMenuOverlay.addEventListener('click', toggleMobileMenu);
    }

    // Dropdown menu handling
    const navDropdowns = document.querySelectorAll('.nav-dropdown');
    navDropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.nav-dropdown-toggle');
        const menu = dropdown.querySelector('.nav-dropdown-menu');
        
        if (toggle && menu) {
            // Desktop: Show on hover
            dropdown.addEventListener('mouseenter', () => {
                dropdown.classList.add('active');
            });
            
            dropdown.addEventListener('mouseleave', () => {
                dropdown.classList.remove('active');
            });
            
            // Mobile: Show on click
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('active');
            });
            
            // Close dropdown when clicking a dropdown item
            const items = dropdown.querySelectorAll('.nav-dropdown-item');
            items.forEach(item => {
                item.addEventListener('click', () => {
                    dropdown.classList.remove('active');
                    // Close mobile menu if open
                    if (navMenu && hamburger && navMenuOverlay) {
                        setTimeout(() => {
                            navMenu.classList.remove('active');
                            hamburger.classList.remove('active');
                            navMenuOverlay.classList.remove('active');
                            document.body.style.overflow = '';
                        }, 150);
                    }
                });
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
            navDropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Close menu when clicking on a link with smooth animation
    navLinks.forEach((link, index) => {
        // Add staggered animation delay
        link.style.transitionDelay = `${index * 0.05}s`;
        
        link.addEventListener('click', () => {
            // Add click ripple effect
            link.style.transform = 'translateX(4px) scale(0.95)';
            
            if (navMenu && hamburger && navMenuOverlay) {
                setTimeout(() => {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    navMenuOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                    
                    // Reset link transform
                    setTimeout(() => {
                        link.style.transform = '';
                    }, 200);
                }, 150);
            } else {
                // Reset link transform even if menu elements don't exist
                setTimeout(() => {
                    link.style.transform = '';
                }, 200);
            }
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    // Handle window resize - close menu if screen gets larger
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollTop = scrollTop;
    });

    // Home navigation handlers - trigger landing mode
    const homeNavLink = document.getElementById('nav-home');
    const logoHomeLink = document.getElementById('logo-home');
    
    function triggerLandingMode(e) {
        e.preventDefault();
        
        // Close mobile menu if open
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        
        // Get hero section
        const heroSection = document.querySelector('#hero');
        
        if (!heroSection) {
            // If hero section not found, just scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        
        // If we're already in landing mode, just scroll to top
        if (isInLandingMode) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        
        // Manually enter landing mode
        isInLandingMode = true;
        
        // Reset hero section to landing mode state
        heroSection.style.position = 'fixed';
        heroSection.style.top = '0';
        heroSection.style.left = '0';
        heroSection.style.width = '100%';
        heroSection.style.height = '100vh';
        heroSection.style.display = 'flex';
        heroSection.style.opacity = '1';
        heroSection.style.zIndex = '1000';
        heroSection.style.transition = 'opacity 0.5s ease-in';
        
        // Prevent scrolling
        document.body.style.overflow = 'hidden';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        console.log('Manually entered landing mode');
    }
    
    if (homeNavLink) {
        homeNavLink.addEventListener('click', triggerLandingMode);
    }
    
    if (logoHomeLink) {
        logoHomeLink.addEventListener('click', triggerLandingMode);
    }

    // CTA button handlers - exit landing mode and navigate
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const targetId = button.getAttribute('href');
            
            // If in landing mode, exit it and navigate
            if (isInLandingMode && targetId && targetId.startsWith('#')) {
                e.preventDefault();
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    // Exit landing mode manually
                    isInLandingMode = false;
                    
                    const heroSection = document.querySelector('#hero');
                    if (heroSection) {
                        heroSection.style.transition = 'opacity 0.8s ease-out';
                        heroSection.style.opacity = '0';
                        
                        setTimeout(() => {
                            heroSection.style.display = 'none';
                            document.body.style.overflow = 'auto';
                            
                            // Scroll to target section
                            const offsetTop = targetSection.offsetTop - 100;
                            window.scrollTo({
                                top: offsetTop,
                                behavior: 'smooth'
                            });
                            
                            console.log('CTA button exited landing mode, navigated to:', targetId);
                        }, 800);
                    }
                    
                    // Remove scroll prevention
                    document.removeEventListener('touchmove', function(e) { if (isInLandingMode) e.preventDefault(); }, { passive: false });
                    document.removeEventListener('keydown', function(e) { 
                        if (isInLandingMode) {
                            const scrollKeys = [32, 33, 34, 35, 36, 37, 38, 39, 40];
                            if (scrollKeys.includes(e.keyCode)) {
                                e.preventDefault();
                                return false;
                            }
                        }
                    });
                }
            }
            // If not in landing mode, let normal navigation handle it
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            
            // Check if it's an external link (contains .html) or starts with http
            if (targetId.includes('.html') || targetId.startsWith('http')) {
                // Allow normal navigation for external links
                return;
            }
            
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Force exit landing mode when clicking nav links
                if (isInLandingMode) {
                    // Manually exit landing mode without auto-scrolling to about
                    isInLandingMode = false;
                    scrollActionCount = 0;
                    // Mobile now uses same scrollActionCount as desktop
                    
                    if (document.querySelector('.hero')) {
                        const heroSection = document.querySelector('.hero');
                        heroSection.style.transition = 'opacity 0.8s ease-out';
                        heroSection.style.opacity = '0';
                        
                        setTimeout(() => {
                            heroSection.style.display = 'none';
                            document.body.style.overflow = 'auto';
                            
                            // Scroll to the clicked target instead of about section
                            const offsetTop = targetSection.offsetTop - 80;
                            window.scrollTo({
                                top: offsetTop,
                                behavior: 'smooth'
                            });
                        }, 800);
                    }
                    
                    // Remove scroll prevention
                    document.removeEventListener('touchmove', function(e) { if (isInLandingMode) e.preventDefault(); }, { passive: false });
                    document.removeEventListener('keydown', function(e) { 
                        if (isInLandingMode) {
                            const scrollKeys = [32, 33, 34, 35, 36, 37, 38, 39, 40];
                            if (scrollKeys.includes(e.keyCode)) {
                                e.preventDefault();
                                return false;
                            }
                        }
                    });
                } else {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Scroll Effects and Animations
function initScrollEffects() {
    // Advanced scroll-based animations
    window.addEventListener('scroll', debounce(handleAdvancedScroll, 10));
}

// Advanced scroll handler
function handleAdvancedScroll() {
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Parallax effect for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < windowHeight && rect.bottom > 0;
        
        if (isVisible) {
            const scrollPercent = (windowHeight - rect.top) / (windowHeight + rect.height);
            const yOffset = (scrollPercent - 0.5) * 50;
            card.style.transform = `translateY(${yOffset}px)`;
        }
    });
    
    // Professional items 3D effect
    const professionalItems = document.querySelectorAll('.professional-item');
    professionalItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const isVisible = rect.top < windowHeight && rect.bottom > 0;
        
        if (isVisible) {
            const scrollPercent = (windowHeight - rect.top) / (windowHeight + rect.height);
            const rotateX = (scrollPercent - 0.5) * 10;
            const translateZ = scrollPercent * 20;
            item.style.transform = `translateZ(${translateZ}px) rotateX(${rotateX}deg)`;
        }
    });
}

// Project Filtering
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Video Player
function initVideoPlayer() {
    const videoItems = document.querySelectorAll('.video-item');
    const mainVideo = document.getElementById('main-video');

    if (!mainVideo) {
        console.error('Main video element not found');
        return;
    }

    videoItems.forEach(item => {
        item.addEventListener('click', () => {
            const videoSrc = item.getAttribute('data-src');
            const posterImg = item.querySelector('img');
            const posterSrc = posterImg ? posterImg.src : null;
            
            // Update active state
            videoItems.forEach(vi => vi.classList.remove('active'));
            item.classList.add('active');
            
            // Change video source and poster
            if (videoSrc) {
                // Update poster to show the related logo while loading
                if (posterSrc) {
                    mainVideo.poster = posterSrc;
                }
                
                // Find the source element and update it
                const sourceElement = mainVideo.querySelector('source');
                if (sourceElement) {
                    sourceElement.src = videoSrc;
                } else {
                    // If no source element, create one
                    const newSource = document.createElement('source');
                    newSource.src = videoSrc;
                    newSource.type = 'video/mp4';
                    mainVideo.appendChild(newSource);
                }
                
                // Also set the main video src as fallback
                mainVideo.src = videoSrc;
                
                // Reload the video element to pick up new source
                mainVideo.load();
                
                // Add event listener for when video can play
                const handleCanPlay = () => {
                    // Wait 1.5 seconds to display the logo, then auto-play
                    setTimeout(() => {
                        mainVideo.play().catch(error => {
                            console.log('Autoplay prevented by browser:', error);
                            // Fallback: show play button or user interaction required message
                        });
                    }, 1500);
                    mainVideo.removeEventListener('canplay', handleCanPlay);
                };
                
                mainVideo.addEventListener('canplay', handleCanPlay);
                
                console.log('Video source changed to:', videoSrc);
                console.log('Poster updated to:', posterSrc);
                console.log('Will auto-play after 1.5 second delay');
            }
        });
    });

    // Add some debug logging
    console.log('Video player initialized with', videoItems.length, 'video items');
    console.log('Main video element:', mainVideo);
}

// Skill Bars Animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                setTimeout(() => {
                    skillBar.style.width = width;
                }, 200);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillObserver.observe(bar));
}

// General Animations
function initAnimations() {
    // Add fade-in class to elements that should animate
    const elementsToAnimate = [
        '.section-header',
        '.about-content',
        '.service-card',
        '.solution-card',
        '.professional-item',
        '.project-card',
        '.skill-category',
        '.video-player-container',
        '.contact-content'
    ];

    elementsToAnimate.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = `${index * 0.1}s`;
        });
    });

    // Set up intersection observer for the newly added elements
    setupIntersectionObserver();
    
    // Immediately make service cards visible for debugging
    setTimeout(() => {
        document.querySelectorAll('.service-card').forEach(card => {
            card.classList.add('visible');
        });
    }, 100);
}

// Intersection Observer Setup
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Special handling for section headers
                if (entry.target.classList.contains('section-header')) {
                    // Animate the text reveal elements inside
                    const textReveals = entry.target.querySelectorAll('.text-reveal');
                    textReveals.forEach((el, index) => {
                        setTimeout(() => {
                            el.classList.add('animate');
                        }, index * 200);
                    });
                }
                
                // Special handling for staggered items
                if (entry.target.classList.contains('stagger-item')) {
                    const staggerItems = entry.target.parentElement.querySelectorAll('.stagger-item');
                    staggerItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation - get fresh list including dynamically added fade-in classes
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .section-header, .stagger-item');
    animatedElements.forEach(el => observer.observe(el));
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Parallax Effect for Hero Section
window.addEventListener('scroll', debounce(() => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        const speed = scrolled * 0.5;
        heroBackground.style.transform = `translateY(${speed}px)`;
    }
}, 10));

// Smooth scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
function addScrollToTopButton() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #64ffda;
        color: #0a0a0a;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(100, 255, 218, 0.3);
    `;
    
    document.body.appendChild(scrollButton);
    
    scrollButton.addEventListener('click', scrollToTop);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.transform = 'translateY(0)';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.transform = 'translateY(10px)';
        }
    });
}

// Initialize scroll to top button
addScrollToTopButton();

// Typing Effect for Hero Title (Optional Enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Contact Form Handling (if you want to add a contact form later)
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Since this is a static GitHub Pages site, you could integrate with:
            // - Formspree
            // - Netlify Forms
            // - EmailJS
            // For now, just show a success message
            
            showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#64ffda' : '#ff6b6b'};
        color: ${type === 'success' ? '#0a0a0a' : '#ffffff'};
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Business Contact Form Handler
function initBusinessContactForm() {
    const form = document.getElementById('consultationForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.form-submit-btn');
        const btnText = submitBtn.querySelector('span');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'block';
        
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        try {
            // Send form data to Formspree
            const response = await fetch('https://formspree.io/f/xnnggyzp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    businessName: data.businessName,
                    contactName: data.contactName,
                    email: data.email,
                    serviceType: data.serviceType,
                    timeline: data.timeline || 'Not specified',
                    budget: data.budget || 'Not specified',
                    projectDetails: data.projectDetails,
                    _replyto: data.email,
                    _subject: `New Consultation Request from ${data.businessName}`
                })
            });

            if (response.ok) {
                showBusinessNotification('Thank you! Your consultation request has been sent successfully. We\'ll contact you within 24 hours.', 'success');
                form.reset();
            } else {
                throw new Error('Network response was not ok');
            }
            
        } catch (error) {
            console.error('Formspree submission error:', error);
            
            // Fallback to mailto if Formspree fails
            const emailSubject = `New Consultation Request from ${data.businessName}`;
            const emailBody = `
Business/Organization: ${data.businessName}
Contact Name: ${data.contactName}
Email: ${data.email}
Service Type: ${data.serviceType}
Timeline: ${data.timeline || 'Not specified'}
Budget: ${data.budget || 'Not specified'}

Project Details:
${data.projectDetails}

---
This message was sent from the Knight Logics contact form on knightlogics.com
            `.trim();
            
            const mailtoLink = `mailto:nickknight488@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
            window.location.href = mailtoLink;
            
            showBusinessNotification('Opening your email client as backup. Please send the email to complete your request.', 'info');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
        }
    });
}

function showBusinessNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `business-notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#64ffda' : '#ff6b6b'};
        color: #0a0a0a;
        padding: 16px 24px;
        border-radius: 10px;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Initialize business contact form
initBusinessContactForm();

// Performance optimization: Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Error handling for missing videos or images
function handleMediaErrors() {
    const videos = document.querySelectorAll('video');
    const images = document.querySelectorAll('img');
    
    videos.forEach(video => {
        video.addEventListener('error', (e) => {
            console.warn('Video failed to load:', video.src);
            video.style.display = 'none';
        });
    });
    
    images.forEach(img => {
        img.addEventListener('error', (e) => {
            console.warn('Image failed to load:', img.src);
            img.style.opacity = '0.5';
            img.alt = 'Image not available';
        });
    });
}

// Initialize error handling
handleMediaErrors();

// Mobile Read More functionality for About section
function initMobileReadMore() {
    const readMoreBtn = document.getElementById('about-read-more');
    const truncatedContent = document.querySelector('.mobile-truncated-content');
    const readMoreText = readMoreBtn?.querySelector('.read-more-text');
    const readLessText = readMoreBtn?.querySelector('.read-less-text');
    
    if (!readMoreBtn || !truncatedContent) return;
    
    readMoreBtn.addEventListener('click', function() {
        const isExpanded = truncatedContent.classList.contains('expanded');
        
        if (isExpanded) {
            // Collapse
            truncatedContent.classList.remove('expanded');
            readMoreBtn.classList.remove('expanded');
            readMoreText.style.display = 'inline';
            readLessText.style.display = 'none';
            
            // Scroll back to the About section header for better UX
            setTimeout(() => {
                document.querySelector('#about .section-header').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        } else {
            // Expand
            truncatedContent.classList.add('expanded');
            readMoreBtn.classList.add('expanded');
            readMoreText.style.display = 'none';
            readLessText.style.display = 'inline';
        }
    });
}

// Work Read More Toggle Function
function toggleWorkContent(button) {
    const workContent = button.closest('.work-content');
    const previewText = workContent.querySelector('.work-preview');
    const fullText = workContent.querySelector('.work-full');
    
    if (fullText.style.display === 'none') {
        // Show full content
        previewText.style.display = 'none';
        fullText.style.display = 'block';
        button.textContent = 'Read Less';
    } else {
        // Show preview content
        previewText.style.display = 'block';
        fullText.style.display = 'none';
        button.textContent = 'Read More';
    }
}

// Browser compatibility check
function checkBrowserSupport() {
    const isModernBrowser = 'IntersectionObserver' in window && 
                           'fetch' in window && 
                           'CSS' in window && 
                           CSS.supports('display', 'grid');
    
    if (!isModernBrowser) {
        console.warn('Some features may not work in this browser. Please update for the best experience.');
    }
}

checkBrowserSupport();

// Testimonial Carousel
let currentTestimonial = 0;

function moveTestimonial(direction) {
    const track = document.querySelector('.testimonial-track');
    const items = document.querySelectorAll('.testimonial-item');
    
    if (!track || items.length === 0) return;
    
    currentTestimonial += direction;
    
    // Loop around
    if (currentTestimonial < 0) {
        currentTestimonial = items.length - 1;
    } else if (currentTestimonial >= items.length) {
        currentTestimonial = 0;
    }
    
    track.style.transform = `translateX(-${currentTestimonial * 100}%)`;
}

// Auto-advance testimonials every 5 seconds
setInterval(() => {
    moveTestimonial(1);
}, 5000);

// Export functions for potential external use
window.portfolioFunctions = {
    scrollToTop,
    showNotification,
    typeWriter,
    moveTestimonial
};
