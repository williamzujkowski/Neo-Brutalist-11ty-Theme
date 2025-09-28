/**
 * Cursor Trail Effect Module
 * Handles cursor dot movement and trail effects
 */

export class CursorTrail {
    constructor() {
        this.cursorDot = null;
        this.init();
    }

    init() {
        this.createCursorDot();
        this.bindEvents();
    }

    createCursorDot() {
        // Check if cursor dot already exists
        this.cursorDot = document.getElementById('cursorDot');
        if (!this.cursorDot) {
            // Cursor dot element not found - silently handle
        }
    }

    bindEvents() {
        if (this.cursorDot) {
            document.addEventListener('mousemove', (e) => {
                this.updateCursorPosition(e);
            });
        }
    }

    updateCursorPosition(event) {
        if (this.cursorDot) {
            this.cursorDot.style.left = event.clientX + 'px';
            this.cursorDot.style.top = event.clientY + 'px';
        }
    }
}

// Auto-initialize if not using as module
if (typeof window !== 'undefined' && !window.cursorTrailInitialized) {
    document.addEventListener('DOMContentLoaded', () => {
        new CursorTrail();
    });
    window.cursorTrailInitialized = true;
}