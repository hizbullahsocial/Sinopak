// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuBtn.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// ========== GOOGLE SHEETS FORM SUBMISSION ==========
// REPLACE THIS WITH YOUR GOOGLE SCRIPT URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwcmwIVcDbF8p5iw6q3ucUuO8Pqsez-vCyVxCzIK72gIN7me6bf1NrzFyQ1LK_4CbRH/exec';

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        console.log('=== CONTACT FORM SUBMISSION STARTED ===');
        
        // Collect form data CORRECTLY - using form elements
        const formElements = this.elements;
        const data = {};
        
        // Get all form field values
        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];
            const name = element.name;
            
            if (name) {
                if (element.type === 'checkbox') {
                    data[name] = element.checked ? 'Yes' : 'No';
                } else if (element.type === 'radio') {
                    if (element.checked) {
                        data[name] = element.value;
                    }
                } else {
                    data[name] = element.value || '';
                }
            }
        }
        
        // Add metadata
        data.formType = 'contact';
        data.timestamp = new Date().toISOString();
        data.page_url = window.location.href;
        
        console.log('Form data collected:', data);
        
        // Show loading
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Submit to Google Sheets
        submitToGoogleSheets(data)
            .then(response => {
                console.log('Submission successful:', response);
                
                // Show success message
                alert(`✅ Thank you, ${data.name || 'there'}!\n\nYour message has been sent successfully.\n\nWe'll contact you within 24 hours.`);
                
                // Reset form
                this.reset();
            })
            .catch(error => {
                console.error('Submission failed:', error);
                alert('❌ Sorry, there was an error sending your message.\n\nPlease email us directly at: sales@sinopak.com');
            })
            .finally(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    });
}

// Product Inquiry Form Handler
const orderForm = document.getElementById('orderForm');
if (orderForm) {
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        console.log('=== PRODUCT INQUIRY FORM SUBMISSION STARTED ===');
        
        // Collect form data
        const formElements = this.elements;
        const data = {};
        
        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];
            const name = element.name;
            
            if (name) {
                if (element.type === 'checkbox') {
                    data[name] = element.checked ? 'Yes' : 'No';
                } else if (element.type === 'radio') {
                    if (element.checked) {
                        data[name] = element.value;
                    }
                } else {
                    data[name] = element.value || '';
                }
            }
        }
        
        // Get product name from page
        const productName = document.querySelector('.product-detail-info h1');
        if (productName) {
            data.product = productName.textContent;
        }
        
        // Add metadata
        data.formType = 'product';
        data.timestamp = new Date().toISOString();
        data.page_url = window.location.href;
        
        console.log('Product form data collected:', data);
        
        // Show loading
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        // Submit to Google Sheets
        submitToGoogleSheets(data)
            .then(response => {
                console.log('Submission successful:', response);
                
                // Show success message
                alert(`✅ Thank you for your inquiry!\n\n📦 Product: ${data.product || 'Product'}\n📊 Quantity: ${data.quantity || '100'} kg\n🏢 Company: ${data.company || ''}\n\nWe will contact you within 24 hours with a detailed quote.`);
                
                // Reset form but keep quantity
                const quantity = document.getElementById('quantity');
                const quantityValue = quantity ? quantity.value : '100';
                this.reset();
                if (quantity) {
                    quantity.value = quantityValue;
                }
            })
            .catch(error => {
                console.error('Submission failed:', error);
                alert('❌ Sorry, there was an error submitting your inquiry.\n\nPlease contact us directly at: sales@sinopak.com');
            })
            .finally(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    });
}

// Newsletter Form Handler - UPDATED VERSION
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        console.log('=== NEWSLETTER FORM SUBMISSION STARTED ===');
        
        // Collect form data - NEW METHOD
        let emailInput = this.querySelector('input[name="email"]');
        let email = emailInput ? emailInput.value.trim() : '';
        
        // Also check for email input without name attribute (fallback)
        if (!email) {
            const anyEmailInput = this.querySelector('input[type="email"]');
            if (anyEmailInput) {
                email = anyEmailInput.value.trim();
            }
        }
        
        if (!email) {
            alert('Please enter your email address');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Get source from hidden input or use default
        const sourceInput = this.querySelector('input[name="source"]');
        const source = sourceInput ? sourceInput.value : 'website_footer';
        
        // Get page URL from hidden input or use current URL
        const pageUrlInput = this.querySelector('input[name="page_url"]');
        const page_url = pageUrlInput ? pageUrlInput.value : window.location.href;
        
        const data = {
            formType: 'newsletter',
            email: email,
            source: source,
            timestamp: new Date().toISOString(),
            page_url: page_url
        };
        
        console.log('Newsletter data:', data);
        
        // Show loading
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        // Submit to Google Sheets
        submitToGoogleSheets(data)
            .then(response => {
                console.log('Submission successful:', response);
                alert('✅ Thank you for subscribing to our newsletter!');
                this.reset();
            })
            .catch(error => {
                console.error('Submission failed:', error);
                alert('❌ Subscription failed. Please try again.');
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    });
}

// Function to submit data to Google Sheets using GET method
function submitToGoogleSheets(data) {
    return new Promise((resolve, reject) => {
        console.log('Submitting to Google Sheets:', data);
        
        // Build query string
        let queryString = '';
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined && value !== null && value !== '') {
                queryString += (queryString ? '&' : '?') + 
                    encodeURIComponent(key) + '=' + encodeURIComponent(value);
            }
        }
        
        const fullUrl = GOOGLE_SCRIPT_URL + queryString;
        console.log('Request URL:', fullUrl);
        
        // Create hidden iframe for submission
        const iframeName = 'submitFrame_' + Date.now();
        const iframe = document.createElement('iframe');
        iframe.name = iframeName;
        iframe.style.display = 'none';
        
        const form = document.createElement('form');
        form.target = iframeName;
        form.action = GOOGLE_SCRIPT_URL;
        form.method = 'GET';
        
        // Add all data as hidden inputs
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined && value !== null && value !== '') {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value;
                form.appendChild(input);
            }
        }
        
        // Add to DOM
        document.body.appendChild(iframe);
        document.body.appendChild(form);
        
        // Submit form
        form.submit();
        
        // Clean up and resolve
        setTimeout(() => {
            try {
                document.body.removeChild(iframe);
                document.body.removeChild(form);
            } catch (e) {
                console.log('Cleanup error (ignored):', e);
            }
            
            resolve({
                success: true,
                message: 'Form submitted successfully',
                timestamp: new Date().toISOString()
            });
        }, 3000);
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#') return;
        
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Product detail page image gallery
const thumbnails = document.querySelectorAll('.thumbnail');
const mainImage = document.getElementById('mainProductImage');

if (thumbnails.length > 0 && mainImage) {
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Update main image
            const newSrc = this.getAttribute('data-full');
            mainImage.src = newSrc;
            
            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Product detail page quantity selector
const minusBtn = document.querySelector('.quantity-minus');
const plusBtn = document.querySelector('.quantity-plus');
const quantityInput = document.querySelector('.quantity-input');

if (minusBtn && plusBtn && quantityInput) {
    minusBtn.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    plusBtn.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });
}

// Products page filtering
const categoryFilter = document.getElementById('categoryFilter');
const availabilityFilter = document.getElementById('availabilityFilter');
const productCards = document.querySelectorAll('.product-card');

if (categoryFilter && availabilityFilter && productCards.length > 0) {
    function filterProducts() {
        const selectedCategory = categoryFilter.value;
        const selectedAvailability = availabilityFilter.value;
        
        productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardAvailability = card.getAttribute('data-availability');
            
            let categoryMatch = selectedCategory === 'all' || selectedCategory === cardCategory;
            let availabilityMatch = selectedAvailability === 'all' || selectedAvailability === cardAvailability;
            
            if (categoryMatch && availabilityMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    categoryFilter.addEventListener('change', filterProducts);
    availabilityFilter.addEventListener('change', filterProducts);
}

// Initialize forms when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website initialized');
    
    // Update page_url fields for ALL forms
    const pageUrl = window.location.href;
    
    // Contact and product forms
    document.querySelectorAll('input[name="page_url"]').forEach(input => {
        if (input) input.value = pageUrl;
    });
    
    // Newsletter forms (check all pages)
    const newsletterForms = document.querySelectorAll('#newsletterForm');
    newsletterForms.forEach(form => {
        // Add missing hidden inputs to newsletter forms
        let sourceInput = form.querySelector('input[name="source"]');
        if (!sourceInput) {
            sourceInput = document.createElement('input');
            sourceInput.type = 'hidden';
            sourceInput.name = 'source';
            sourceInput.value = 'website_footer';
            form.insertBefore(sourceInput, form.querySelector('button[type="submit"]'));
        }
        
        let pageUrlInput = form.querySelector('input[name="page_url"]');
        if (!pageUrlInput) {
            pageUrlInput = document.createElement('input');
            pageUrlInput.type = 'hidden';
            pageUrlInput.name = 'page_url';
            pageUrlInput.value = pageUrl;
            form.insertBefore(pageUrlInput, form.querySelector('button[type="submit"]'));
        }
    });
});