/**
 * Smooth Scroll Module
 * Handles smooth scrolling functionality for navigation
 */

export class SmoothScroll {
    constructor(options = {}) {
        this.options = {
            behavior: 'smooth',
            block: 'start',
            ...options
        };
        this.init();
    }

    init() {
        this.bindNavigationLinks();
    }

    bindNavigationLinks() {
        const anchors = document.querySelectorAll('a[href^="#"]');
        anchors.forEach(anchor => {
            anchor.addEventListener('click', (event) => {
                this.handleAnchorClick(event);
            });
        });
    }

    handleAnchorClick(event) {
        event.preventDefault();

        const anchor = event.currentTarget;
        const targetId = anchor.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            this.scrollToElement(targetElement);
        } else {
            console.warn(`Target element ${targetId} not found`);
        }
    }

    scrollToElement(element) {
        element.scrollIntoView({
            behavior: this.options.behavior,
            block: this.options.block
        });
    }

    // Public method to programmatically scroll to an element
    scrollTo(selector, customOptions = {}) {
        const element = document.querySelector(selector);
        if (element) {
            const scrollOptions = { ...this.options, ...customOptions };
            element.scrollIntoView(scrollOptions);
        } else {
            console.warn(`Element ${selector} not found`);
        }
    }
}

// Auto-initialize if not using as module
if (typeof window !== 'undefined' && !window.smoothScrollInitialized) {
    document.addEventListener('DOMContentLoaded', () => {
        new SmoothScroll();
    });
    window.smoothScrollInitialized = true;
}