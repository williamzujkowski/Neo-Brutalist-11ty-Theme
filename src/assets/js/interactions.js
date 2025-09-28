/**
 * Interactions Module
 * Handles scroll effects and card interactions
 */

export class Interactions {
    constructor() {
        this.colors = [
            'var(--electric-blue)',
            'var(--hot-pink)',
            'var(--acid-green)',
            'var(--cyber-yellow)',
            'var(--deep-purple)'
        ];
        this.init();
    }

    init() {
        this.initScrollEffects();
        this.initCardInteractions();
    }

    initScrollEffects() {
        window.addEventListener('scroll', () => {
            this.handleScrollColorChanges();
        });
    }

    handleScrollColorChanges() {
        // Random color changes on scroll with low probability
        if (Math.random() > 0.95) {
            const randomColor = this.getRandomColor();
            const serviceCards = document.querySelectorAll('.service-card');

            serviceCards.forEach((card, index) => {
                if (Math.random() > 0.7) {
                    setTimeout(() => {
                        card.style.borderColor = randomColor;
                    }, index * 50);
                }
            });
        }
    }

    initCardInteractions() {
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('click', (event) => {
                this.handleCardClick(event.currentTarget);
            });
        });
    }

    handleCardClick(card) {
        const randomRotation = Math.floor(Math.random() * 10) - 5;

        // Apply rotation and scale effect
        card.style.transform = `rotate(${randomRotation}deg) scale(1.05)`;

        // Reset transformation after animation
        setTimeout(() => {
            card.style.transform = '';
        }, 500);
    }

    getRandomColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }
}

// Auto-initialize if not using as module
if (typeof window !== 'undefined' && !window.interactionsInitialized) {
    document.addEventListener('DOMContentLoaded', () => {
        new Interactions();
    });
    window.interactionsInitialized = true;
}