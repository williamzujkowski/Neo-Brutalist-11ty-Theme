/**
 * Standalone JavaScript Bundle
 * All Neo-Brutalist theme functionality in a single file (no modules)
 * This is a direct extraction from demo.html for backwards compatibility
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    function initNeoBrutalistTheme() {
        // Cursor trail effect
        function initCursorTrail() {
            const cursor = document.getElementById('cursorDot');
            if (cursor) {
                document.addEventListener('mousemove', (e) => {
                    cursor.style.left = e.clientX + 'px';
                    cursor.style.top = e.clientY + 'px';
                });
            }
        }

        // Random color changes on scroll
        function initScrollEffects() {
            const colors = [
                'var(--electric-blue)',
                'var(--hot-pink)',
                'var(--acid-green)',
                'var(--cyber-yellow)',
                'var(--deep-purple)'
            ];

            window.addEventListener('scroll', () => {
                if (Math.random() > 0.95) {
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    document.querySelectorAll('.service-card').forEach((card, index) => {
                        if (Math.random() > 0.7) {
                            setTimeout(() => {
                                card.style.borderColor = randomColor;
                            }, index * 50);
                        }
                    });
                }
            });
        }

        // Glitch effect on hover for mega title
        function initGlitchEffects() {
            const megaTitle = document.querySelector('.mega-title');
            if (megaTitle) {
                megaTitle.addEventListener('mouseenter', function() {
                    this.style.animation = 'glitch 0.3s infinite';
                });

                megaTitle.addEventListener('mouseleave', function() {
                    this.style.animation = 'glitch 3s infinite';
                });
            }
        }

        // Random rotation on service cards click
        function initCardInteractions() {
            document.querySelectorAll('.service-card').forEach(card => {
                card.addEventListener('click', function() {
                    const randomRotation = Math.floor(Math.random() * 10) - 5;
                    this.style.transform = `rotate(${randomRotation}deg) scale(1.05)`;
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 500);
                });
            });
        }

        // Smooth scroll for navigation
        function initSmoothScroll() {
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
        }

        // Add random "glitch" movements to floating shapes
        function initFloatingShapes() {
            setInterval(() => {
                document.querySelectorAll('.floating-shape').forEach(shape => {
                    if (Math.random() > 0.8) {
                        const x = Math.random() * 20 - 10;
                        const y = Math.random() * 20 - 10;
                        shape.style.transform += ` translate(${x}px, ${y}px)`;
                        setTimeout(() => {
                            shape.style.transform = shape.classList.contains('shape-1') ? 'rotate(45deg)' : '';
                        }, 200);
                    }
                });
            }, 2000);
        }

        // Initialize all features
        try {
            initCursorTrail();
            initScrollEffects();
            initGlitchEffects();
            initCardInteractions();
            initSmoothScroll();
            initFloatingShapes();

            console.log('🚀 Neo-Brutalist theme (standalone) fully loaded');

            // Dispatch ready event
            const event = new CustomEvent('neoBrutalistReady', {
                detail: {
                    type: 'standalone',
                    timestamp: new Date().toISOString()
                }
            });
            document.dispatchEvent(event);
        } catch (error) {
            console.error('❌ Error initializing Neo-Brutalist theme:', error);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNeoBrutalistTheme);
    } else {
        initNeoBrutalistTheme();
    }
})();