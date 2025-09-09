// Main JavaScript File - Complete Implementation
// Utility Functions
const utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Sanitize input to prevent XSS
    sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    },
    
    // Validate email
    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },
    
    // Generate random ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};



// Security Controller Class
class SecurityController {
    constructor() {
        this.init();
        this.setupProtection();
    }
    
    init() {
        // Disable right-click context menu
        document.addEventListener('contextmenu', e => {
            e.preventDefault();
            this.showSecurityWarning('Right-click disabled for security');
        });
        
        // Disable text selection
        this.disableTextSelection();
        
        // Disable developer tools shortcuts
        this.setupKeyboardProtection();
        
        // Disable drag and drop
        this.disableDragDrop();
        
        // Console warning
        this.showConsoleWarning();
        
        // Setup copy protection
        this.setupCopyProtection();
    }
    
    disableTextSelection() {
        const styles = [
            'user-select: none',
            '-webkit-user-select: none',
            '-moz-user-select: none',
            '-ms-user-select: none'
        ];
        
        document.body.style.cssText += styles.join('; ');
    }
    
    setupKeyboardProtection() {
        document.addEventListener('keydown', (e) => {
            // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S, Ctrl+C
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C')) ||
                (e.ctrlKey && (e.key === 'u' || e.key === 's' || e.key === 'c'))) {
                e.preventDefault();
                this.showSecurityWarning('Developer tools access blocked');
                return false;
            }
            
            // Disable Ctrl+A (Select All)
            if (e.ctrlKey && e.key === 'a') {
                e.preventDefault();
                return false;
            }
        });
    }
    
    disableDragDrop() {
        ['dragstart', 'drop', 'dragover'].forEach(event => {
            document.addEventListener(event, e => e.preventDefault());
        });
        
        // Disable image dragging
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', e => e.preventDefault());
            img.style.cssText += '-webkit-user-drag: none; -khtml-user-drag: none; -moz-user-drag: none; -o-user-drag: none; user-drag: none;';
        });
    }
    
    showConsoleWarning() {
        const warnings = [
            '%cSTOP! रुकिए!',
            'color: red; font-size: 50px; font-weight: bold;',
            '%cयह एक browser feature है developers के लिए। यहाँ code paste न करें।',
            'color: red; font-size: 16px;',
            '%cअगर कोई आपको code paste करने को कहता है, तो यह scam हो सकता है।',
            'color: orange; font-size: 14px;'
        ];
        
        console.log(warnings[0], warnings[1]);
        console.log(warnings[2], warnings[3]);
        console.log(warnings[4], warnings[5]);
    }
    
    setupCopyProtection() {
        // Disable clipboard operations
        document.addEventListener('copy', e => {
            e.preventDefault();
            this.showSecurityWarning('Copy operation blocked');
        });
        
        document.addEventListener('cut', e => {
            e.preventDefault();
            this.showSecurityWarning('Cut operation blocked');
        });
        
        document.addEventListener('paste', e => {
            e.preventDefault();
            this.showSecurityWarning('Paste operation blocked');
        });
    }
    
    setupProtection() {
        // Add transparent overlay for additional protection
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
            pointer-events: none;
            z-index: -1;
        `;
        document.body.appendChild(overlay);
        
        // Add watermark
        this.addWatermark();
        
        // Monitor dev tools
        this.monitorDevTools();
    }
    
    addWatermark() {
        const watermark = document.createElement('div');
        watermark.textContent = 'Protected Content';
        watermark.style.cssText = `
            position: fixed;
            top: 40%;
            left: 20%;
            font-size: 50px;
            color: rgba(0, 0, 0, 0.03);
            transform: rotate(-30deg);
            pointer-events: none;
            z-index: -1;
            user-select: none;
            font-weight: bold;
        `;
        document.body.appendChild(watermark);
    }
    
    monitorDevTools() {
        let devtools = false;
        const threshold = 160;
        
        setInterval(() => {
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools) {
                    devtools = true;
                    this.showSecurityWarning('Developer tools detected');
                    // Optional: Blur content
                    document.body.style.filter = 'blur(5px)';
                }
            } else {
                if (devtools) {
                    devtools = false;
                    document.body.style.filter = 'none';
                }
            }
        }, 500);
    }
    
    showSecurityWarning(message) {
        const notification = document.createElement('div');
        notification.textContent = `Security: ${message}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.5s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Theme Controller Class
class ThemeController {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.themes = ['light', 'dark'];
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        this.updateThemeIcon();
        
        // Emit theme change event
        window.dispatchEvent(new CustomEvent('themeChange', { 
            detail: { theme } 
        }));
    }
    
    setupEventListeners() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
    
    toggleTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.applyTheme(this.themes[nextIndex]);
    }
    
    updateThemeIcon() {
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            const icons = {
                light: '☀️',
                dark: '🌙'
            };
            themeIcon.textContent = icons[this.currentTheme] || '☀️';
        }
    }
    
    getCurrentThemeColors() {
        const styles = getComputedStyle(document.documentElement);
        return {
            primary: styles.getPropertyValue('--primary-color').trim(),
            secondary: styles.getPropertyValue('--secondary-color').trim(),
            background: styles.getPropertyValue('--background-color').trim(),
            text: styles.getPropertyValue('--text-color').trim(),
            accent: styles.getPropertyValue('--accent-color').trim()
        };
    }
}

// Animation Controller Class
class AnimationController {
    constructor() {
        this.observers = new Map();
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '50px 0px'
        });
        
        // Observe all animatable elements
        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
        
        this.observers.set('intersection', observer);
    }
    
    triggerAnimation(element) {
        const animationType = element.dataset.animate;
        const delay = parseInt(element.dataset.delay) || 0;
        
        setTimeout(() => {
            element.classList.add('animated');
            
            // Add specific animation class
            switch(animationType) {
                case 'fadeIn':
                    element.classList.add('fade-in');
                    break;
                case 'slideUp':
                    element.classList.add('slide-up');
                    break;
                case 'zoomIn':
                    element.classList.add('zoom-in');
                    break;
                case 'rotateIn':
                    element.classList.add('rotate-in');
                    break;
            }
        }, delay);
    }
    
    setupScrollAnimations() {
        const handleScroll = utils.throttle(() => {
            this.handleParallax();
            this.handleNavbarScroll();
        }, 16);
        
        window.addEventListener('scroll', handleScroll);
    }
    
    handleParallax() {
        const scrollY = window.scrollY;
        const parallaxElements = document.querySelectorAll('.hero-image img');
        
        parallaxElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }
    
    handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Typing animation
    typeWriter(element, text, speed = 100) {
        element.innerHTML = '';
        let i = 0;
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                // Remove cursor after typing
                setTimeout(() => {
                    element.classList.remove('typing-text');
                }, 1000);
            }
        }, speed);
    }
    
    // Counter animation
    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number
            let displayValue = Math.floor(current);
            if (target > 1000) {
                displayValue = displayValue.toLocaleString();
            }
            if (element.dataset.suffix) {
                displayValue += element.dataset.suffix;
            }
            
            element.textContent = displayValue;
        }, 16);
    }
    
    // Particle animation
    createParticles(container, count = 30) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position and animation delay
            const left = Math.random() * 100;
            const animationDelay = Math.random() * 6;
            const animationDuration = 6 + Math.random() * 4;
            
            particle.style.cssText = `
                left: ${left}%;
                animation-delay: ${animationDelay}s;
                animation-duration: ${animationDuration}s;
            `;
            
            container.appendChild(particle);
        }
    }
}

// Language Controller Class
class LanguageController {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'hi';
        this.translations = {};
        this.init();
    }
    
    init() {
        this.loadTranslations();
        this.setupEventListeners();
        this.applyLanguage(this.currentLanguage);
    }
    
    loadTranslations() {
        // Basic translations - expand as needed
        this.translations = {
            hi: {
                'home': 'होम',
                'courses': 'कोर्सेस',
                'news': 'समाचार',
                'tools': 'उपकरण',
                'contact': 'संपर्क',
                'get-started': 'शुरू करें',
                'learn-more': 'और जानें'
            },
            en: {
                'home': 'Home',
                'courses': 'Courses',
                'news': 'News',
                'tools': 'Tools',
                'contact': 'Contact',
                'get-started': 'Get Started',
                'learn-more': 'Learn More'
            },
            pa: {
                'home': 'ਘਰ',
                'courses': 'ਕੋਰਸ',
                'news': 'ਖਬਰਾਂ',
                'tools': 'ਟੂਲਸ',
                'contact': 'ਸੰਪਰਕ',
                'get-started': 'ਸ਼ੁਰੂ ਕਰੋ',
                'learn-more': 'ਹੋਰ ਜਾਣੋ'
            }
        };
    }
    
    setupEventListeners() {
        const languageSelector = document.getElementById('language-selector');
        if (languageSelector) {
            languageSelector.value = this.currentLanguage;
            languageSelector.addEventListener('change', (e) => {
                this.applyLanguage(e.target.value);
            });
        }
    }
    
    applyLanguage(language) {
        this.currentLanguage = language;
        localStorage.setItem('language', language);
        
        // Update HTML lang attribute
        document.documentElement.lang = language;
        
        // Apply translations
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.dataset.translate;
            if (this.translations[language] && this.translations[language][key]) {
                el.textContent = this.translations[language][key];
            }
        });
        
        // Emit language change event
        window.dispatchEvent(new CustomEvent('languageChange', { 
            detail: { language } 
        }));
    }
    
    translate(key) {
        return this.translations[this.currentLanguage]?.[key] || key;
    }
}

// Accessibility Controller Class
class AccessibilityController {
    constructor() {
        this.fontSize = localStorage.getItem('fontSize') || 'medium';
        this.highContrast = localStorage.getItem('highContrast') === 'true';
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.applySettings();
        this.setupKeyboardNavigation();
    }
    
    setupEventListeners() {
        // Font size controls
        const fontControls = {
            'font-small': 'small',
            'font-medium': 'medium',
            'font-large': 'large'
        };
        
        Object.entries(fontControls).forEach(([id, size]) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', () => {
                    this.setFontSize(size);
                });
            }
        });
        
        // High contrast toggle
        const highContrastToggle = document.getElementById('high-contrast');
        if (highContrastToggle) {
            highContrastToggle.addEventListener('click', () => {
                this.toggleHighContrast();
            });
        }
        
        // Accessibility panel toggle
        const accessibilityToggle = document.getElementById('accessibility-toggle');
        if (accessibilityToggle) {
            accessibilityToggle.addEventListener('click', () => {
                this.toggleAccessibilityPanel();
            });
        }
    }
    
    setFontSize(size) {
        this.fontSize = size;
        localStorage.setItem('fontSize', size);
        this.applySettings();
        
        // Update active state
        document.querySelectorAll('[id^="font-"]').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`font-${size}`)?.classList.add('active');
    }
    
    toggleHighContrast() {
        this.highContrast = !this.highContrast;
        localStorage.setItem('highContrast', this.highContrast);
        this.applySettings();
        
        // Update button state
        const button = document.getElementById('high-contrast');
        if (button) {
            button.classList.toggle('active', this.highContrast);
        }
    }
    
    applySettings() {
        const root = document.documentElement;
        
        // Font size settings
        const fontSizes = {
            small: '14px',
            medium: '16px',
            large: '18px'
        };
        
        root.style.setProperty('--base-font-size', fontSizes[this.fontSize]);
        
        // High contrast
        root.classList.toggle('high-contrast', this.highContrast);
    }
    
    setupKeyboardNavigation() {
        // Tab navigation for custom elements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Escape key to close dropdowns/modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open dropdowns
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                });
                
                // Close accessibility panel
                const accessibilityOptions = document.querySelector('.accessibility-options');
                if (accessibilityOptions) {
                    accessibilityOptions.style.opacity = '0';
                    accessibilityOptions.style.visibility = 'hidden';
                }
            }
        });
    }
    
    toggleAccessibilityPanel() {
        const panel = document.querySelector('.accessibility-options');
        if (panel) {
            const isVisible = panel.style.opacity === '1';
            panel.style.opacity = isVisible ? '0' : '1';
            panel.style.visibility = isVisible ? 'hidden' : 'visible';
            panel.style.transform = isVisible ? 'translateY(10px)' : 'translateY(0)';
        }
    }
    
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

// Form Validator Class
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.rules = {};
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.setupEventListeners();
        this.setupValidationRules();
    }
    
    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.submitForm();
            }
        });
        
        // Real-time validation
        this.form.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    setupValidationRules() {
        this.rules = {
            name: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-ZÀ-ÿ\u0900-\u097F\s]+$/,
                message: 'कृपया वैध नाम दर्ज करें'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'कृपया वैध ईमेल पता दर्ज करें'
            },
            phone: {
                required: false,
                pattern: /^[\+]?[\d\s\-\(\)]{10,}$/,
                message: 'कृपया वैध फोन नंबर दर्ज करें'
            },
            message: {
                required: true,
                minLength: 10,
                message: 'संदेश कम से कम 10 characters का होना चाहिए'
            }
        };
    }
    
    validateField(input) {
        const fieldName = input.name;
        const value = input.value.trim();
        const rule = this.rules[fieldName];
        
        if (!rule) return true;
        
        // Required field check
        if (rule.required && !value) {
            this.showFieldError(input, `${this.getFieldLabel(fieldName)} आवश्यक है`);
            return false;
        }
        
        // Skip other validations if field is empty and not required
        if (!rule.required && !value) {
            return true;
        }
        
        // Pattern validation
        if (rule.pattern && !rule.pattern.test(value)) {
            this.showFieldError(input, rule.message);
            return false;
        }
        
        // Minimum length validation
        if (rule.minLength && value.length < rule.minLength) {
            this.showFieldError(input, `कम से कम ${rule.minLength} characters आवश्यक हैं`);
            return false;
        }
        
        // Field is valid
        this.clearFieldError(input);
        return true;
    }
    
    validateForm() {
        let isValid = true;
        const formData = new FormData(this.form);
        
        // Validate all fields
        for (let [fieldName] of formData) {
            const input = this.form.querySelector(`[name="${fieldName}"]`);
            if (input && !this.validateField(input)) {
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    showFieldError(input, message) {
        input.classList.add('error');
        const errorElement = document.getElementById(`${input.name}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        // Announce error to screen readers
        if (window.accessibilityController) {
            window.accessibilityController.announceToScreenReader(`Error: ${message}`);
        }
    }
    
    clearFieldError(input) {
        input.classList.remove('error');
        const errorElement = document.getElementById(`${input.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
    
    getFieldLabel(fieldName) {
        const labels = {
            name: 'नाम',
            email: 'ईमेल',
            phone: 'फोन नंबर',
            message: 'संदेश'
        };
        return labels[fieldName] || fieldName;
    }
    
    async submitForm() {
        const submitBtn = this.form.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        
        try {
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            // Sanitize data
            Object.keys(data).forEach(key => {
                data[key] = utils.sanitizeInput(data[key]);
            });
            
            // Simulate API call
            await this.sendFormData(data);
            
            // Success
            this.showNotification('संदेश सफलतापूर्वक भेजा गया!', 'success');
            this.form.reset();
            
            // Announce success to screen readers
            if (window.accessibilityController) {
                window.accessibilityController.announceToScreenReader('Form submitted successfully');
            }
            
        } catch (error) {
            this.showNotification('संदेश भेजने में त्रुटि। कृपया पुनः प्रयास करें।', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }
    
    async sendFormData(data) {
        // Simulate API call - replace with actual endpoint
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure
                if (Math.random() > 0.1) { // 90% success rate
                    resolve({ success: true, message: 'Form submitted successfully' });
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Navigation Controller Class
class NavigationController {
    constructor() {
        this.mobileMenuOpen = false;
        this.init();
    }
    
    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupActiveNavigation();
        this.setupDropdowns();
    }
    
    setupMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
            
            // Close mobile menu when clicking on nav links
            navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    if (this.mobileMenuOpen) {
                        this.toggleMobileMenu();
                    }
                });
            });
        }
    }
    
    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        this.mobileMenuOpen = !this.mobileMenuOpen;
        
        navMenu.classList.toggle('active', this.mobileMenuOpen);
        mobileToggle.classList.toggle('active', this.mobileMenuOpen);
        
        // Animate mobile menu toggle icon
        const spans = mobileToggle.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (this.mobileMenuOpen) {
                if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                span.style.transform = 'none';
                span.style.opacity = '1';
            }
        });
        
        // Prevent body scroll when mobile menu is open
        document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
    }
    
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        const handleScroll = utils.throttle(() => {
            let current = '';
            const scrollY = window.scrollY;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, 100);
        
        window.addEventListener('scroll', handleScroll);
    }
    
    setupDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('.nav-link');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (trigger && menu) {
                // Keyboard accessibility
                trigger.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === 'ArrowDown') {
                        e.preventDefault();
                        menu.style.opacity = '1';
                        menu.style.visibility = 'visible';
                        menu.style.transform = 'translateY(0)';
                        
                        // Focus first menu item
                        const firstMenuItem = menu.querySelector('.dropdown-link');
                        if (firstMenuItem) {
                            firstMenuItem.focus();
                        }
                    }
                });
                
                // Arrow key navigation in dropdown
                menu.addEventListener('keydown', (e) => {
                    const menuItems = menu.querySelectorAll('.dropdown-link');
                    const currentIndex = Array.from(menuItems).indexOf(document.activeElement);
                    
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        const nextIndex = (currentIndex + 1) % menuItems.length;
                        menuItems[nextIndex].focus();
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        const prevIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
                        menuItems[prevIndex].focus();
                    } else if (e.key === 'Escape') {
                        menu.style.opacity = '0';
                        menu.style.visibility = 'hidden';
                        trigger.focus();
                    }
                });
            }
        });
    }
}

// Performance Monitor Class
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }
    
    init() {
        this.measurePageLoadTime();
        this.setupLazyLoading();
        this.optimizeImages();
        this.monitorFrameRate();
    }
    
    measurePageLoadTime() {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            this.metrics.loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            this.metrics.domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
            
            console.log('Performance Metrics:', this.metrics);
        });
    }
    
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    optimizeImages() {
        // Add loading="lazy" to images
        document.querySelectorAll('img').forEach(img => {
            if (!img.getAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }
    
    monitorFrameRate() {
        let lastTime = performance.now();
        let frameCount = 0;
        
        const measureFPS = (currentTime) => {
            frameCount++;
            
            if (currentTime - lastTime >= 1000) {
                this.metrics.fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }
    
    getMetrics() {
        return this.metrics;
    }
}

// Main Application Class
class EducationPlatform {
    constructor() {
        this.components = new Map();
        this.isInitialized = false;
        this.init();
    }
    
    async init() {
        try {
            // Show loading screen
            this.showLoadingScreen();
            
            // Initialize core components
            await this.initializeComponents();
            
            // Setup custom functionality
            this.setupCustomFeatures();
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            this.isInitialized = true;
            
            // Emit ready event
            window.dispatchEvent(new CustomEvent('platformReady'));
            
        } catch (error) {
            console.error('Platform initialization failed:', error);
            this.showErrorMessage('Application failed to load. Please refresh the page.');
        }
    }
    
    async initializeComponents() {
        // Initialize security first
        this.components.set('security', new SecurityController());
        
        // Initialize other controllers
        const controllers = [
            ['theme', ThemeController],
            ['language', LanguageController],
            ['animation', AnimationController],
            ['accessibility', AccessibilityController],
            ['navigation', NavigationController],
            ['performance', PerformanceMonitor]
        ];
        
        controllers.forEach(([name, Controller]) => {
            this.components.set(name, new Controller());
        });
        
        // Initialize form validator if contact form exists
        if (document.getElementById('contactForm')) {
            this.components.set('formValidator', new FormValidator('contactForm'));
        }
        
        // Make accessibility controller globally available
        window.accessibilityController = this.components.get('accessibility');
    }
    
    setupCustomFeatures() {
        // Setup counter animations
        this.setupCounterAnimations();
        
        // Setup typing animation
        this.setupTypingAnimation();
        
        // Setup particles
        this.setupParticleEffects();
        
        // Setup ripple effects
        this.setupRippleEffects();
        
        // Setup intersection animations
        this.setupIntersectionAnimations();
    }
    
    setupCounterAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.components.get('animation').animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        document.querySelectorAll('[data-count]').forEach(counter => {
            observer.observe(counter);
        });
    }
    
    setupTypingAnimation() {
        const typingElement = document.querySelector('.typing-text');
        if (typingElement) {
            const text = typingElement.textContent;
            typingElement.textContent = '';
            
            setTimeout(() => {
                this.components.get('animation').typeWriter(typingElement, text, 80);
            }, 1000);
        }
    }
    
    setupParticleEffects() {
        const particleContainers = document.querySelectorAll('.hero-particles');
        particleContainers.forEach(container => {
            this.components.get('animation').createParticles(container, 25);
        });
    }
    
    setupRippleEffects() {
        document.querySelectorAll('.ripple').forEach(element => {
            element.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.6);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple-animation 0.6s ease-out;
                    pointer-events: none;
                `;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
        
        // Add CSS animation for ripple
        if (!document.getElementById('ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple-animation {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    setupIntersectionAnimations() {
        // Additional intersection observer for complex animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add staggered animations for grid items
                    if (entry.target.classList.contains('features-grid') ||
                        entry.target.classList.contains('courses-grid') ||
                        entry.target.classList.contains('tools-grid')) {
                        
                        const items = entry.target.children;
                        Array.from(items).forEach((item, index) => {
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, index * 100);
                        });
                        
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, { threshold: 0.3 });
        
        document.querySelectorAll('.features-grid, .courses-grid, .tools-grid').forEach(grid => {
            // Initially hide items
            Array.from(grid.children).forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                item.style.transition = 'all 0.6s ease-out';
            });
            
            observer.observe(grid);
        });
    }
    
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1500); // Show loading for at least 1.5 seconds
        }
    }
    
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ef4444;
            color: white;
            padding: 2rem;
            border-radius: 12px;
            z-index: 10000;
            text-align: center;
            font-size: 1.1rem;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
    }
    
    // Public methods for external access
    getComponent(name) {
        return this.components.get(name);
    }
    
    isReady() {
        return this.isInitialized;
    }
    
    getPerformanceMetrics() {
        const performanceMonitor = this.components.get('performance');
        return performanceMonitor ? performanceMonitor.getMetrics() : {};
    }
}

// Initialize the platform when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create global platform instance
    window.educationPlatform = new EducationPlatform();
    
    // Add global error handler
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
    });
    
    // Add unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
    });
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EducationPlatform, utils };
}