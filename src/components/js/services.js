

  // This script is designed to work with Astro View Transitions
  // It will run both on initial page load and during view transitions

  // Main initialization function for services section
  function initServiceSection() {
    // Create intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          
          // Special animation for headings with lines
          if (entry.target.tagName === 'H2') {
            // Small delay before line animation for sequential effect
            setTimeout(() => {
              entry.target.classList.add('animate-line');
            }, 300);
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });

    // Observe all elements that need animation
    document.querySelectorAll('.animate-element').forEach(element => {
      observer.observe(element);
    });
    
    // Specifically observe h2 elements for line animation
    document.querySelectorAll('.services-header h2').forEach(heading => {
      observer.observe(heading);
    });

    // Add hover animations for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('card-hover');
      });
      card.addEventListener('mouseleave', () => {
        card.classList.remove('card-hover');
      });
    });
  }

  // Initial page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServiceSection);
  } else {
    initServiceSection();
  }

  // For Astro View Transitions - register to reinitialize on view transition
  document.addEventListener('astro:page-load', initServiceSection);
  
  // Handle hash navigation - important for # links
  document.addEventListener('astro:after-swap', () => {
    // Reset animation states on view transition
    document.querySelectorAll('.animate-element').forEach(element => {
      element.classList.remove('animate');
    });
    
    document.querySelectorAll('.services-header h2').forEach(heading => {
      heading.classList.remove('animate-line');
    });
    
    // Reinitialize animations after a small delay
    setTimeout(initServiceSection, 100);
  });
