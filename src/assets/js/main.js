/**
 * Main JavaScript Entry Point
 * Orchestrates all Neo-Brutalist theme functionality
 */

import { CursorTrail } from './cursor.js';
import { Animations } from './animations.js';
import { Interactions } from './interactions.js';
import { SmoothScroll } from './smooth-scroll.js';

/**
 * Main application class that initializes all modules
 */
class NeoBrutalistApp {
    constructor() {
        this.modules = {};
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeModules();
            });
        } else {
            this.initializeModules();
        }
    }

    initializeModules() {
        try {
            // Initialize cursor trail
            this.modules.cursorTrail = new CursorTrail();

            // Initialize animations
            this.modules.animations = new Animations();

            // Initialize interactions
            this.modules.interactions = new Interactions();

            // Initialize smooth scroll
            this.modules.smoothScroll = new SmoothScroll();


            // Dispatch custom event for theme ready
            this.dispatchThemeReady();
        } catch (error) {
            // Silently handle initialization errors in production
        }
    }

    dispatchThemeReady() {
        const event = new CustomEvent('neoBrutalistReady', {
            detail: {
                modules: Object.keys(this.modules),
                timestamp: new Date().toISOString()
            }
        });
        document.dispatchEvent(event);
    }

    // Public API methods
    getModule(moduleName) {
        return this.modules[moduleName] || null;
    }

    // Utility method to scroll to any element
    scrollTo(selector, options = {}) {
        if (this.modules.smoothScroll) {
            this.modules.smoothScroll.scrollTo(selector, options);
        }
    }
}

// Create global instance
const neoBrutalistApp = new NeoBrutalistApp();

// Export for use in other modules if needed
export default neoBrutalistApp;

// Make available globally for legacy compatibility
if (typeof window !== 'undefined') {
    window.NeoBrutalistApp = neoBrutalistApp;
}