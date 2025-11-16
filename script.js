// Anti-scraping: Reveal contact information
function revealContact(button, type) {
    const container = button.parentElement;
    const hiddenSpan = container.querySelector('.contact-hidden');

    if (!hiddenSpan) return;

    let contactData;
    if (type === 'phone') {
        contactData = hiddenSpan.getAttribute('data-phone');
        // Create clickable phone link
        const phoneLink = document.createElement('a');
        phoneLink.href = 'tel:' + contactData;
        phoneLink.className = 'contact-link-revealed';
        phoneLink.textContent = contactData;
        phoneLink.setAttribute('aria-label', 'Zadzwoń: ' + contactData);

        hiddenSpan.replaceWith(phoneLink);
    } else if (type === 'email') {
        contactData = hiddenSpan.getAttribute('data-email');
        // Create clickable email link
        const emailLink = document.createElement('a');
        emailLink.href = 'mailto:' + contactData;
        emailLink.className = 'contact-link-revealed';
        emailLink.textContent = contactData;
        emailLink.setAttribute('aria-label', 'Wyślij email: ' + contactData);

        hiddenSpan.replaceWith(emailLink);
    }

    // Remove the button with fade out effect
    button.style.opacity = '0';
    setTimeout(() => {
        button.remove();
    }, 300);
}

// Reveal all contacts in footer
function revealFooterContacts(event) {
    const button = event.target;
    const footerSection = button.closest('.footer-section');
    const hiddenContacts = footerSection.querySelectorAll('.contact-hidden');

    hiddenContacts.forEach(span => {
        const phone = span.getAttribute('data-phone');
        const email = span.getAttribute('data-email');

        if (phone) {
            span.textContent = 'Tel: ' + phone;
            span.classList.add('contact-revealed');
        } else if (email) {
            span.textContent = 'Email: ' + email;
            span.classList.add('contact-revealed');
        }
    });

    // Remove the button
    button.style.opacity = '0';
    setTimeout(() => {
        button.remove();
    }, 300);
}

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission handler (placeholder - needs backend integration)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            
            // Here you would typically send the data to a backend service
            // For now, we'll just show an alert
            // alert('Dziękuję za wiadomość! Skontaktuję się z Tobą wkrótce.\n\nUwaga: To jest wersja demonstracyjna. Aby formularz działał, należy zintegrować go z usługą do obsługi formularzy (np. Formspree, EmailJS, lub własny backend).');
            
            // Reset form
            //this.reset();
            
            // Example of how to integrate with Formspree:
            fetch('https://formspree.io/f/mzzyklbb', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(async response => {
                if (response.ok) {
                    alert('Dziękuję za wiadomość! Skontaktuję się z Tobą wkrótce.');
                    this.reset();
                } else {
                    alert('Wystąpił błąd. Spróbuj ponownie później lub napisz maila na psycholog.berkowska@gmail.com.');
                }
            }).catch(error => {
                alert('Wystąpił błąd. Spróbuj ponownie później lub napisz maila na psycholog.berkowska@gmail.com.');
            });
        });
    }
    
    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .specialization-item, .pricing-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

