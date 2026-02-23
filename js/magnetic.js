/* ============================================
   MAGNETIC BUTTON EFFECT
   Elements with class .magnetic will subtly
   follow the cursor when hovered
   ============================================ */

class MagneticButton {
  constructor(el) {
    this.el = el;
    this.strength = 40;       // how far the element shifts (px)
    this.triggerArea = 200;   // radius of effect (px)
    this.bound = {
      mouseMove: this.onMouseMove.bind(this),
      mouseLeave: this.onMouseLeave.bind(this)
    };
    this.init();
  }

  init() {
    this.el.addEventListener('mousemove', this.bound.mouseMove);
    this.el.addEventListener('mouseleave', this.bound.mouseLeave);
  }

  onMouseMove(e) {
    const rect = this.el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;

    // Normalize displacement to strength
    const moveX = (distX / rect.width) * this.strength;
    const moveY = (distY / rect.height) * this.strength;

    this.el.style.transform = `translate(${moveX}px, ${moveY}px)`;
    this.el.style.transition = 'transform 0.3s cubic-bezier(.7, 0, .3, 1)';
  }

  onMouseLeave() {
    this.el.style.transform = 'translate(0, 0)';
    this.el.style.transition = 'transform 0.7s cubic-bezier(.7, 0, .3, 1)';
  }

  destroy() {
    this.el.removeEventListener('mousemove', this.bound.mouseMove);
    this.el.removeEventListener('mouseleave', this.bound.mouseLeave);
  }
}

// Initialize all magnetic elements
function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(el => {
    new MagneticButton(el);
  });
}

// Export for use in main.js
window.initMagnetic = initMagnetic;
