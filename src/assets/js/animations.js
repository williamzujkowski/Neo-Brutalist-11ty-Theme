/**
 * Animations Module
 * Handles glitch effects and floating shape animations
 */

export class Animations {
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
    this.initGlitchEffects();
    this.initFloatingShapes();
  }

  initGlitchEffects() {
    const megaTitle = document.querySelector('.mega-title');
    if (megaTitle) {
      megaTitle.addEventListener('mouseenter', () => {
        this.startIntenseGlitch(megaTitle);
      });

      megaTitle.addEventListener('mouseleave', () => {
        this.startNormalGlitch(megaTitle);
      });
    }
  }

  startIntenseGlitch(element) {
    element.style.animation = 'glitch 0.3s infinite';
  }

  startNormalGlitch(element) {
    element.style.animation = 'glitch 3s infinite';
  }

  initFloatingShapes() {
    // Start the floating shapes glitch animation
    setInterval(() => {
      this.animateFloatingShapes();
    }, 2000);
  }

  animateFloatingShapes() {
    const shapes = document.querySelectorAll('.floating-shape');
    shapes.forEach(shape => {
      if (Math.random() > 0.8) {
        this.glitchShape(shape);
      }
    });
  }

  glitchShape(shape) {
    const x = Math.random() * 20 - 10;
    const y = Math.random() * 20 - 10;

    // Apply glitch movement
    shape.style.transform += ` translate(${x}px, ${y}px)`;

    // Reset after glitch duration
    setTimeout(() => {
      const resetTransform = shape.classList.contains('shape-1') ? 'rotate(45deg)' : '';
      shape.style.transform = resetTransform;
    }, 200);
  }

  // Method to get random color for other modules
  getRandomColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }
}

// Auto-initialize if not using as module
if (typeof window !== 'undefined' && !window.animationsInitialized) {
  document.addEventListener('DOMContentLoaded', () => {
    new Animations();
  });
  window.animationsInitialized = true;
}
