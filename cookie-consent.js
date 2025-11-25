// GDPR Cookie Consent Manager
// Compliant with GDPR and ePrivacy Directive

(function() {
    'use strict';

    // ============================================================================
    // CONFIGURATION - REPLACE THESE WITH YOUR ACTUAL IDs
    // ============================================================================

    const CONFIG = {
        GA_MEASUREMENT_ID: 'G-C215VZHTQ7', // TODO: Replace with your Google Analytics Measurement ID
        GOOGLE_ADS_ID: 'AW-17736572043',    // TODO: Replace with your Google Ads Conversion ID

        // Conversion Labels from Google Ads
        // To get these: Google Ads → Goals → Conversions → Click on conversion → Tag setup
        CONVERSIONS: {
            CONTACT_FORM: 'Vy6cCPTEx8UbEIu5uolC',    // TODO: Replace with contact form conversion label
            BOOKING_CLICK: '3GLECIaiycUbEIu5uolC',   // TODO: Replace with booking click conversion label
            BOOKING_CLICK_TOP: 'AAAAAAA',
            PHONE_REVEAL: 'LFJzCMDkx8UbEIu5uolC',    // TODO: Replace with phone reveal conversion label (optional)
            EMAIL_REVEAL: 'K4hKCKmrwsUbEIu5uolC'     // TODO: Replace with email reveal conversion label (optional)
        }
    };

    const CookieConsent = {
        // Configuration
        cookieName: 'cookie_consent',
        cookieExpiry: 365, // days

        // Initialize
        init: function() {
            // Initialize Google tags with consent mode BEFORE checking consent
            // This loads the tags but prevents data collection until consent is given
            this.initializeConsentMode();

            // Check if consent has already been given
            const consent = this.getConsent();

            if (consent === null) {
                // No consent yet - show banner
                this.showBanner();
            } else {
                // Consent exists - update consent mode accordingly
                this.updateConsentMode(consent);
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
            this.updateConsentMode(consent);
            this.hideBanner();
        },

        // Reject all (except necessary)
        rejectAll: function() {
            const consent = this.saveConsent({
                analytics: false,
                marketing: false
            });
            this.updateConsentMode(consent);
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

            this.updateConsentMode(consent);
            this.hideSettings();
            this.hideBanner();
        },
        
        // Show settings panel
        showSettings: function() {
            const settings = document.getElementById('cookie-settings');
            const banner = document.getElementById('cookie-consent-banner');

            // Load current consent values into checkboxes
            const consent = this.getConsent();
            if (consent) {
                const analyticsCheckbox = document.getElementById('cookie-analytics');
                const marketingCheckbox = document.getElementById('cookie-marketing');

                if (analyticsCheckbox) analyticsCheckbox.checked = consent.analytics || false;
                if (marketingCheckbox) marketingCheckbox.checked = consent.marketing || false;
            }

            if (settings) {
                settings.style.display = 'block';
                setTimeout(() => {
                    settings.classList.add('show');
                }, 10);
            }

            // Hide banner if it's visible
            if (banner) {
                banner.style.display = 'none';
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
        
        // Initialize Consent Mode - loads tags but denies consent by default
        initializeConsentMode: function() {
            // Initialize dataLayer and gtag
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;

            // Set default consent to 'denied' as a placeholder
            // This must be called BEFORE loading any Google tags
            gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'wait_for_update': 500  // Wait 500ms for consent update
            });

            // Initialize gtag
            gtag('js', new Date());

            // Load Google Analytics script
            const gaScript = document.createElement('script');
            gaScript.async = true;
            gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.GA_MEASUREMENT_ID}`;
            document.head.appendChild(gaScript);

            // Configure Google Analytics
            gaScript.onload = () => {
                gtag('config', CONFIG.GA_MEASUREMENT_ID, {
                    'anonymize_ip': true,
                    'cookie_flags': 'SameSite=None;Secure'
                });
                console.log('Google Analytics tag loaded (consent mode)');
            };

            // Load Google Ads script
            const adsScript = document.createElement('script');
            adsScript.async = true;
            adsScript.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.GOOGLE_ADS_ID}`;
            document.head.appendChild(adsScript);

            // Configure Google Ads
            adsScript.onload = () => {
                gtag('config', CONFIG.GOOGLE_ADS_ID);
                console.log('Google Ads tag loaded (consent mode)');
            };
        },

        // Update consent mode based on user preferences
        updateConsentMode: function(consent) {
            if (!window.gtag) {
                console.warn('gtag not initialized');
                return;
            }

            // Update consent based on user preferences
            window.gtag('consent', 'update', {
                'analytics_storage': consent.analytics ? 'granted' : 'denied',
                'ad_storage': consent.marketing ? 'granted' : 'denied',
                'ad_user_data': consent.marketing ? 'granted' : 'denied',
                'ad_personalization': consent.marketing ? 'granted' : 'denied'
            });

            console.log('Consent updated:', consent);
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
                    // Only show banner if user hasn't made a choice yet
                    const consent = this.getConsent();
                    if (consent === null) {
                        this.showBanner();
                    }
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
    window.trackBookingClickTop = function() {
        CookieConsent.trackConversion(CONFIG.CONVERSIONS.BOOKING_CLICK_TOP);
    };
    window.trackPhoneReveal = function() {
        CookieConsent.trackConversion(CONFIG.CONVERSIONS.PHONE_REVEAL);
    };

    window.trackEmailReveal = function() {
        CookieConsent.trackConversion(CONFIG.CONVERSIONS.EMAIL_REVEAL);
    };
})();

