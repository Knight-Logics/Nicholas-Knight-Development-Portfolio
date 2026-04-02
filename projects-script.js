// Projects Page JavaScript

async function loadHeaderFooter() {
    try {
        const headerResponse = await fetch('/header.html');
        if (headerResponse.ok) {
            const headerContainer = document.getElementById('header-container');
            if (headerContainer) headerContainer.innerHTML = await headerResponse.text();
        }
        const footerResponse = await fetch('/footer.html');
        if (footerResponse.ok) {
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) footerContainer.innerHTML = await footerResponse.text();
        }
    } catch (error) {
        console.error('Error loading shared layout:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Load header and footer components
    loadHeaderFooter().then(() => {
        // Initialize fade-in animations
        initScrollEffects();
        
        // Initialize project filtering
        initProjectFilters();
        
        // Initialize navigation
        initNavigation();
    });
});

// Navigation functionality for projects page
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navMenuOverlay = document.getElementById('nav-menu-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    if (hamburger && navMenu) {
        // Hamburger menu toggle
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            if (navMenuOverlay) {
                navMenuOverlay.classList.toggle('active');
            }
            // Prevent background scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking overlay
        if (navMenuOverlay) {
            navMenuOverlay.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                navMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                if (navMenuOverlay) {
                    navMenuOverlay.classList.remove('active');
                }
                document.body.style.overflow = '';
            });
        });
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

    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// Scroll Effects and Animations for Projects Page
function initScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.fade-in');
    animatedElements.forEach(el => observer.observe(el));
}

// Project Filtering Functionality
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-detailed');

    if (filterBtns.length === 0 || projects.length === 0) {
        return; // Exit if elements don't exist
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            projects.forEach(project => {
                if (filter === 'all') {
                    project.style.display = 'block';
                    project.style.opacity = '1';
                } else {
                    const categories = project.getAttribute('data-category');
                    if (categories && categories.includes(filter)) {
                        project.style.display = 'block';
                        project.style.opacity = '1';
                    } else {
                        project.style.display = 'none';
                        project.style.opacity = '0';
                    }
                }
            });
        });
    });
}

// Smooth scrolling for any internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});