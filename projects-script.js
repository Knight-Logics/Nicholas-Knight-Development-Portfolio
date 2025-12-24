// Projects Page JavaScript
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
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    if (hamburger && navMenu) {
        // Hamburger menu toggle
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

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