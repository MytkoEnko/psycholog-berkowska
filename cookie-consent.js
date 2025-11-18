// GDPR Cookie Consent Manager
// Compliant with GDPR and ePrivacy Directive

(function() {
    'use strict';

    // ============================================================================
    // CONFIGURATION - REPLACE THESE WITH YOUR ACTUAL IDs
    // ============================================================================

    const CONFIG = {
        GA_MEASUREMENT_ID: 'G-C215VZHTQ7', // TODO: Replace with your Google Analytics Measurement ID
        GOOGLE_ADS_ID: 'AW-XXXXXXXXXX',    // TODO: Replace with your Google Ads Conversion ID

        // Conversion Labels from Google Ads
        // To get these: Google Ads → Goals → Conversions → Click on conversion → Tag setup
        CONVERSIONS: {
            CONTACT_FORM: 'YYYYYYYY',    // TODO: Replace with contact form conversion label
            BOOKING_CLICK: 'ZZZZZZZZ',   // TODO: Replace with booking click conversion label
            PHONE_REVEAL: 'WWWWWWWW',    // TODO: Replace with phone reveal conversion label (optional)
            EMAIL_REVEAL: 'VVVVVVVV'     // TODO: Replace with email reveal conversion label (optional)
        }
    };

    const CookieConsent = {
        // Configuration
        cookieName: 'cookie_consent',
        cookieExpiry: 365, // days
        
        // Initialize
        init: function() {
            // Check if consent has already been given
            const consent = this.getConsent();
            
            if (consent === null) {
                // No consent yet - show banner
                this.showBanner();
            } else {
                // Consent exists - load scripts accordingly
                this.loadScripts(consent);
            }
            
            // Setup event listeners
            this.setupEventListeners();
        },
        
        // Get current consent status
        getConsent: function() {
            const consent = localStorage.getItem(this.cookieName);
            return consent ? JSON.parse(consent) : null;
        },
        
        // Save consent
        saveConsent: function(preferences) {
            const consentData = {
                necessary: true, // Always true
                analytics: preferences.analytics || false,
                marketing: preferences.marketing || false,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem(this.cookieName, JSON.stringify(consentData));
            
            // Set cookie for server-side detection (optional)
            this.setCookie(this.cookieName, JSON.stringify(consentData), this.cookieExpiry);
            
            return consentData;
        },
        
        // Set cookie
        setCookie: function(name, value, days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "expires=" + date.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
        },
        
        // Show cookie banner
        showBanner: function() {
            const banner = document.getElementById('cookie-consent-banner');
            if (banner) {
                banner.style.display = 'block';
                // Trigger animation
                setTimeout(() => {
                    banner.classList.add('show');
                }, 10);
            }
        },
        
        // Hide cookie banner
        hideBanner: function() {
            const banner = document.getElementById('cookie-consent-banner');
            if (banner) {
                banner.classList.remove('show');
                setTimeout(() => {
                    banner.style.display = 'none';
                }, 300);
            }
        },
        
        // Accept all cookies
        acceptAll: function() {
            const consent = this.saveConsent({
                analytics: true,
                marketing: true
            });
            this.loadScripts(consent);
            this.hideBanner();
        },
        
        // Reject all (except necessary)
        rejectAll: function() {
            const consent = this.saveConsent({
                analytics: false,
                marketing: false
            });
            this.loadScripts(consent);
            this.hideBanner();
        },
        
        // Save custom preferences
        savePreferences: function() {
            const analyticsCheckbox = document.getElementById('cookie-analytics');
            const marketingCheckbox = document.getElementById('cookie-marketing');
            
            const consent = this.saveConsent({
                analytics: analyticsCheckbox ? analyticsCheckbox.checked : false,
                marketing: marketingCheckbox ? marketingCheckbox.checked : false
            });
            
            this.loadScripts(consent);
            this.hideSettings();
            this.hideBanner();
        },
        
        // Show settings panel
        showSettings: function() {
            const settings = document.getElementById('cookie-settings');
            const banner = document.getElementById('cookie-consent-banner');
            
            if (settings && banner) {
                banner.style.display = 'none';
                settings.style.display = 'block';
                setTimeout(() => {
                    settings.classList.add('show');
                }, 10);
            }
        },
        
        // Hide settings panel
        hideSettings: function() {
            const settings = document.getElementById('cookie-settings');
            if (settings) {
                settings.classList.remove('show');
                setTimeout(() => {
                    settings.style.display = 'none';
                }, 300);
            }
        },
        
        // Load scripts based on consent
        loadScripts: function(consent) {
            if (consent.analytics) {
                this.loadGoogleAnalytics();
            }
            
            if (consent.marketing) {
                this.loadGoogleAds();
            }
        },
        
        // Load Google Analytics
        loadGoogleAnalytics: function() {
            // Check if already loaded
            if (window.gtag) return;

            // Load gtag.js
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.GA_MEASUREMENT_ID}`;
            document.head.appendChild(script);

            // Initialize gtag
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;

            gtag('js', new Date());
            gtag('config', CONFIG.GA_MEASUREMENT_ID, {
                'anonymize_ip': true, // GDPR requirement
                'cookie_flags': 'SameSite=None;Secure'
            });

            console.log('Google Analytics loaded');
        },

        // Load Google Ads
        loadGoogleAds: function() {
            // Initialize gtag if not already done (might be loaded by Analytics)
            if (!window.gtag) {
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
            }

            // Check if Google Ads script is already loaded
            const existingScript = document.querySelector(`script[src*="${CONFIG.GOOGLE_ADS_ID}"]`);
            if (existingScript) return;

            // Load Google Ads gtag script
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.GOOGLE_ADS_ID}`;
            document.head.appendChild(script);

            // Configure Google Ads
            script.onload = () => {
                window.gtag('config', CONFIG.GOOGLE_ADS_ID);
                console.log('Google Ads loaded');
            };
        },

        // Track conversion event
        trackConversion: function(conversionLabel, conversionValue = null) {
            // Only track if marketing cookies are accepted
            const consent = this.getConsent();
            if (!consent || !consent.marketing) {
                console.log('Conversion tracking skipped - no marketing consent');
                return;
            }

            // Check if gtag is loaded
            if (typeof window.gtag !== 'function') {
                console.warn('Google Ads not loaded - cannot track conversion');
                return;
            }

            const conversionData = {
                'send_to': `${CONFIG.GOOGLE_ADS_ID}/${conversionLabel}`
            };

            if (conversionValue !== null) {
                conversionData.value = conversionValue;
                conversionData.currency = 'PLN';
            }

            window.gtag('event', 'conversion', conversionData);
            console.log('Conversion tracked:', conversionLabel);
        },

        // Setup event listeners
        setupEventListeners: function() {
            // Accept all button
            const acceptAllBtn = document.getElementById('cookie-accept-all');
            if (acceptAllBtn) {
                acceptAllBtn.addEventListener('click', () => this.acceptAll());
            }

            // Reject all button
            const rejectAllBtn = document.getElementById('cookie-reject-all');
            if (rejectAllBtn) {
                rejectAllBtn.addEventListener('click', () => this.rejectAll());
            }

            // Customize button
            const customizeBtn = document.getElementById('cookie-customize');
            if (customizeBtn) {
                customizeBtn.addEventListener('click', () => this.showSettings());
            }

            // Save preferences button
            const saveBtn = document.getElementById('cookie-save-preferences');
            if (saveBtn) {
                saveBtn.addEventListener('click', () => this.savePreferences());
            }

            // Close settings button
            const closeBtn = document.getElementById('cookie-settings-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.hideSettings();
                    this.showBanner();
                });
            }

            // Manage cookies link (for footer/privacy policy)
            const manageLinks = document.querySelectorAll('.manage-cookies-link');
            manageLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showSettings();
                });
            });
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => CookieConsent.init());
    } else {
        CookieConsent.init();
    }

    // Expose to window for manual management
    window.CookieConsent = CookieConsent;

    // ============================================================================
    // GLOBAL CONVERSION TRACKING FUNCTIONS
    // These can be called from anywhere in your code
    // ============================================================================

    window.trackContactFormSubmission = function() {
        CookieConsent.trackConversion(CONFIG.CONVERSIONS.CONTACT_FORM);
    };

    window.trackBookingClick = function() {
        CookieConsent.trackConversion(CONFIG.CONVERSIONS.BOOKING_CLICK);
    };

    window.trackPhoneReveal = function() {
        CookieConsent.trackConversion(CONFIG.CONVERSIONS.PHONE_REVEAL);
    };

    window.trackEmailReveal = function() {
        CookieConsent.trackConversion(CONFIG.CONVERSIONS.EMAIL_REVEAL);
    };
})();

