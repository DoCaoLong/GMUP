/**
 * Lazy Loading Utilities for GlowMeUp
 * Optimizes page load performance by deferring non-critical resources
 */

// Intersection Observer for lazy loading
const createObserver = (callback, options = {}) => {
    const defaultOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.01
    };

    return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

// Lazy load background images
const lazyLoadBackgrounds = () => {
    const elements = document.querySelectorAll('[data-bg]');

    const bgObserver = createObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const bgUrl = el.dataset.bg;

                if (bgUrl) {
                    el.style.backgroundImage = `url(${bgUrl})`;
                    el.removeAttribute('data-bg');
                }

                observer.unobserve(el);
            }
        });
    });

    elements.forEach(el => bgObserver.observe(el));
};

// Lazy load API calls
const lazyLoadAPI = (selector, apiCallback) => {
    const element = document.querySelector(selector);
    if (!element) return;

    const apiObserver = createObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                apiCallback();
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '200px' });

    apiObserver.observe(element);
};

// Lazy load gallery/slider
// const lazyLoadGallery = () => {
//     const gallerySection = document.querySelector('#gallery_slider');
//     if (!gallerySection) return;

//     const galleryObserver = createObserver((entries, observer) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 // Trigger gallery initialization
//                 if (typeof loadGallery === 'function') {
//                     loadGallery();
//                 }
//                 observer.unobserve(entry.target);
//             }
//         });
//     }, { rootMargin: '300px' });

//     galleryObserver.observe(gallerySection);
// };

// Initialize all lazy loading
const initLazyLoad = () => {
    // Lazy load backgrounds
    lazyLoadBackgrounds();

    // Lazy load news API
    lazyLoadAPI('#event_list', () => {
        if (typeof loadNews === 'function') {
            loadNews();
        }
    });

    // Note: Gallery is loaded immediately in home.js for better UX
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initLazyLoad, lazyLoadAPI, lazyLoadBackgrounds, createObserver };
}
