document.addEventListener('DOMContentLoaded', function() {
    // YouTube Video Integration
    const videoThumbnail = document.getElementById('video-thumbnail');
    const videoModal = document.getElementById('video-modal');
    const closeBtn = document.querySelector('.video-modal__close');
    const youtubeIframe = document.getElementById('youtube-iframe');
    
    // YouTube video ID extracted from URL: https://www.youtube.com/watch?v=mUGYPlAgJPw
    const youtubeVideoId = 'mUGYPlAgJPw';
    
    // Focus management variables
    let previousActiveElement = null;
    
    // Get focusable elements within modal
    function getFocusableElements(element) {
        return element.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, iframe[src]'
        );
    }
    
    // Function to open video modal
    function openVideoModal() {
        try {
            // Store the currently focused element
            previousActiveElement = document.activeElement;
            
            // Show loading state
            videoModal.classList.add('active', 'loading');
            videoModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            const embedUrl = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0`;
            youtubeIframe.src = embedUrl;
            
            // Remove loading state when iframe loads
            youtubeIframe.addEventListener('load', () => {
                videoModal.classList.remove('loading');
            }, { once: true });
            
            // Focus the close button initially
            setTimeout(() => {
                closeBtn.focus();
            }, 100);
            
        } catch (error) {
            console.error('Failed to open video modal:', error);
            // Remove loading state and close modal on error
            videoModal.classList.remove('loading', 'active');
            // Fallback: try to open YouTube URL in new tab
            window.open(`https://www.youtube.com/watch?v=${youtubeVideoId}`, '_blank');
        }
    }
    
    // Function to close video modal
    function closeVideoModal() {
        try {
            youtubeIframe.src = '';
            videoModal.classList.remove('active');
            videoModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto'; // Restore scrolling
            
            // Restore focus to the previously focused element
            if (previousActiveElement) {
                previousActiveElement.focus();
                previousActiveElement = null;
            }
        } catch (error) {
            console.error('Failed to close video modal:', error);
        }
    }
    
    // Focus trap function
    function trapFocus(event) {
        if (!videoModal.classList.contains('active')) return;
        
        const focusableElements = getFocusableElements(videoModal);
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        if (event.key === 'Tab') {
            if (event.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstFocusable) {
                    event.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastFocusable) {
                    event.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    }
    
    // Event listeners
    if (videoThumbnail) {
        videoThumbnail.addEventListener('click', openVideoModal);
        // Add keyboard support for video thumbnail
        videoThumbnail.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openVideoModal();
            }
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeVideoModal);
    }
    
    // Close modal when clicking outside the video
    if (videoModal) {
        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal || e.target.classList.contains('video-modal__overlay')) {
                closeVideoModal();
            }
        });
    }
    
    // Close modal with Escape key and handle focus trapping
    document.addEventListener('keydown', function(e) {
        if (videoModal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeVideoModal();
            } else {
                trapFocus(e);
            }
        }
    });
    
    // Smooth scrolling for anchor links (if any)
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
    
    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Only apply fade effect if image isn't already loaded
        if (!img.complete) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
        } else {
            // Image is already loaded, ensure it's visible
            img.style.opacity = '1';
        }
    });
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature, .testimonial, .use-case, .screenshot');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Form validation (if forms are added later)
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Utility function to debounce events
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
    
    // Handle window resize for responsive adjustments
    const handleResize = debounce(() => {
        // Add any resize-specific logic here if needed
        // Resize logic can be added here if needed in the future
    }, 250);
    
    window.addEventListener('resize', handleResize);
});