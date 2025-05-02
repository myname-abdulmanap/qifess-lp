function initFeatureAnimations() {
  // (Pindahkan semua isi dari event listener DOMContentLoaded ke sini)

  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in-viewport');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const featuresSection = document.querySelector('.features');
  if (featuresSection) {
    sectionObserver.observe(featuresSection);

    featuresSection.addEventListener('mousemove', (e) => {
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
    });
  }

  const elementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        elementObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.reveal-element');
  revealElements.forEach(el => elementObserver.observe(el));

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, parseInt(delay));
        cardObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const revealCards = document.querySelectorAll('.reveal-card');
  revealCards.forEach(card => cardObserver.observe(card));

  const shapes = document.querySelectorAll('.parallax-shape');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    shapes.forEach((shape, index) => {
      const factor = (index + 1) * 0.05;
      const direction = index % 2 === 0 ? 1 : -1;
      shape.style.transform = `translate(${scrollY * factor * direction}px, ${scrollY * factor * 0.5}px)`;
    });
  });
}

// Jalankan saat DOM pertama kali load
document.addEventListener('DOMContentLoaded', initFeatureAnimations);

// Jalankan lagi setelah view transition selesai
document.addEventListener('astro:after-swap', initFeatureAnimations);
