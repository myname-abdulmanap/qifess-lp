
const animations = {
  sectionObserver: null,
  elementObserver: null,
  cardObserver: null,
  scrollHandler: null,
  mousemoveHandler: null,
};


function cleanupPreviousAnimations() {

  if (animations.sectionObserver) animations.sectionObserver.disconnect();
  if (animations.elementObserver) animations.elementObserver.disconnect();
  if (animations.cardObserver) animations.cardObserver.disconnect();
  

  if (animations.scrollHandler) {
    window.removeEventListener('scroll', animations.scrollHandler);
  }
  

  const featuresSection = document.querySelector('.features');
  if (featuresSection && animations.mousemoveHandler) {
    featuresSection.removeEventListener('mousemove', animations.mousemoveHandler);
  }
}

function initFeatureAnimations() {
  // Cleanup any existing animations to prevent duplicates
  cleanupPreviousAnimations();
  
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };

  // Section observer
  animations.sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in-viewport');
        animations.sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const featuresSection = document.querySelector('.features');
  if (featuresSection) {
    animations.sectionObserver.observe(featuresSection);

    // Mouse move handler
    animations.mousemoveHandler = (e) => {
      if (window.innerWidth > 1024) {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        const lottiePlayer = document.querySelector('.lottie-player');
        if (lottiePlayer) {
          lottiePlayer.style.transform = `scale(1.05) translate(${mouseX * 20}px, ${mouseY * 20}px)`;
        }
        
        const shapes = document.querySelectorAll('.parallax-shape');
        shapes.forEach((shape, index) => {
          const factor = (index + 2) * 15;
          shape.style.transform = `translate(${mouseX * factor}px, ${mouseY * factor}px)`;
        });
      }
    };
    
    featuresSection.addEventListener('mousemove', animations.mousemoveHandler);
  }

  // Element observer
  animations.elementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        animations.elementObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.reveal-element');
  revealElements.forEach(el => animations.elementObserver.observe(el));

  // Card observer
  animations.cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, parseInt(delay));
        animations.cardObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const revealCards = document.querySelectorAll('.reveal-card');
  revealCards.forEach(card => animations.cardObserver.observe(card));

  // Scroll event handler
  const shapes = document.querySelectorAll('.parallax-shape');
  animations.scrollHandler = () => {
    const scrollY = window.scrollY;
    shapes.forEach((shape, index) => {
      const factor = (index + 1) * 0.05;
      const direction = index % 2 === 0 ? 1 : -1;
      shape.style.transform = `translate(${scrollY * factor * direction}px, ${scrollY * factor * 0.5}px)`;
    });
  };
  
  window.addEventListener('scroll', animations.scrollHandler);
}

// Handling untuk Astro View Transitions
document.addEventListener('astro:page-load', () => {
  initFeatureAnimations();
});

// Initial setup untuk first page load
document.addEventListener('DOMContentLoaded', () => {
  initFeatureAnimations();
});

// Handle ketika content DOM diperbarui oleh Astro
document.addEventListener('astro:after-swap', () => {
  initFeatureAnimations();
});

// Cleanup saat meninggalkan halaman untuk mencegah memory leaks
document.addEventListener('astro:before-swap', cleanupPreviousAnimations);

// Export fungsi jika ingin digunakan secara modular
export { initFeatureAnimations, cleanupPreviousAnimations };