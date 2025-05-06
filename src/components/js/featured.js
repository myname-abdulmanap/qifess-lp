// Enhanced Animation Script for Features Section with Astro View Transitions
document.addEventListener('astro:page-load', function() {
  // Define custom easing functions for smoother animations
  const easings = {
    easeOutQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
    easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    easeInOutQuad: 'cubic-bezier(0.45, 0, 0.55, 1)'
  };
  
  // Apply custom CSS variables for animations
  document.documentElement.style.setProperty('--easeOutQuart', easings.easeOutQuart);
  document.documentElement.style.setProperty('--easeOutBack', easings.easeOutBack);
  document.documentElement.style.setProperty('--easeInOutQuad', easings.easeInOutQuad);

  // Create an intersection observer with options
  const observerOptions = {
    root: null, // viewport as root
    rootMargin: '0px',
    threshold: [0.1, 0.3, 0.5] // multiple thresholds for smoother transitions
  };
  
  // Define a function to handle entry animations with sequential timing
  function animateEntry(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Base animation delay
        let delay = 100;
        
        // Add visible class to the main target
        entry.target.classList.add('is-visible');
        
        // If the target is the features section, add viewport class
        if (entry.target.classList.contains('features')) {
          // Use requestAnimationFrame to prevent layout thrashing
          requestAnimationFrame(() => {
            entry.target.classList.add('is-in-viewport');
            
            // Animate background shapes with staggered timing
            const shapes = entry.target.querySelectorAll('.shape');
            shapes.forEach((shape, index) => {
              setTimeout(() => {
                shape.style.opacity = '0.08';
                shape.style.transform = 'scale(1)';
              }, 150 * index);
            });
            
            // Animate floating elements with staggered timing
            const floatingElements = entry.target.querySelectorAll('.floating-element');
            floatingElements.forEach((element, index) => {
              setTimeout(() => {
                element.style.opacity = '0.7';
                element.style.transform = 'translate(0, 0)';
              }, 200 * index);
            });
          });
        }
        
        // If the target is a content section, reveal its children sequentially
        if (entry.target.classList.contains('reveal-element')) {
          const title = entry.target.querySelector('.animate-title');
          const text = entry.target.querySelector('.animate-text');
          const glow = entry.target.querySelector('.glow-effect');
          
          if (title) {
            setTimeout(() => {
              title.style.opacity = '1';
              title.style.transform = 'translateY(0)';
              
              // Animate title underline after title animation
              setTimeout(() => {
                const titleAfter = title.querySelector('::after') || title;
                if (title.classList.contains('animate-title')) {
                  title.classList.add('show-underline');
                }
              }, 400);
            }, delay);
            delay += 200;
          }
          
          if (text) {
            setTimeout(() => {
              text.style.opacity = '1';
              text.style.transform = 'translateY(0)';
            }, delay);
            delay += 150;
          }
          
          if (glow) {
            setTimeout(() => {
              glow.style.opacity = '0.6';
              glow.style.transform = 'scale(1)';
            }, delay);
          }
        }
        
        // Animate feature cards with staggered delay
        if (entry.target.classList.contains('features-grid-container')) {
          const cards = entry.target.querySelectorAll('.feature-card');
          
          cards.forEach((card, index) => {
            // Use the data-delay attribute or calculate from index
            const cardDelay = card.dataset.delay ? parseInt(card.dataset.delay) : index * 120;
            
            setTimeout(() => {
              // Use FLIP animation technique for smoother performance
              const firstPosition = card.getBoundingClientRect();
              card.classList.add('is-visible');
              const lastPosition = card.getBoundingClientRect();
              
              // Create and apply a transition to animate from first to last position
              const deltaY = firstPosition.top - lastPosition.top;
              
              card.style.transform = `translateY(${deltaY}px)`;
              card.style.opacity = '0';
              
              // Force a reflow
              card.offsetHeight;
              
              // Apply transition and reset transform
              card.style.transition = `transform 0.8s ${easings.easeOutBack}, opacity 0.6s ${easings.easeOutQuart}`;
              card.style.transform = '';
              card.style.opacity = '1';
            }, 300 + cardDelay);
          });
        }
        
        // Once elements are animated in, we can stop observing them
        observer.unobserve(entry.target);
      }
    });
  }
  
  // Create the intersection observer
  const observer = new IntersectionObserver(animateEntry, observerOptions);
  
  // Observe all elements that need animation
  document.querySelectorAll('.features, .reveal-element, .features-grid-container').forEach(el => {
    observer.observe(el);
  });
  
  // Handle parallax effects on mouse movement for desktop
  if (window.matchMedia('(min-width: 768px)').matches) {
    const featuresSection = document.querySelector('.features');
    if (featuresSection) {
      featuresSection.addEventListener('mousemove', function(e) {
        // Calculate mouse position as percentage of viewport
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        // Apply smooth parallax effect to floating elements
        requestAnimationFrame(() => {
          document.querySelectorAll('.floating-element').forEach((element, index) => {
            // Make each element move at a different rate for depth effect
            const depth = (index + 1) * 0.5;
            const offsetX = (mouseX - 0.5) * 40 * depth;
            const offsetY = (mouseY - 0.5) * 40 * depth;
            
            element.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
            element.style.transition = 'transform 0.8s cubic-bezier(0.33, 1, 0.68, 1)';
          });
          
          // Apply subtle 3D effect to the lottie container
          const lottieContainer = document.querySelector('.lottie-container');
          if (lottieContainer) {
            lottieContainer.style.transform = 
              `perspective(1000px) rotateX(${2 - mouseY * 4}deg) rotateY(${-2 + mouseX * 4}deg) translateZ(0)`;
            lottieContainer.style.transition = 'transform 0.3s cubic-bezier(0.33, 1, 0.68, 1)';
          }
        });
      });
    }
  }
  
  // Handle exit animations for Astro view transitions
  document.addEventListener('astro:before-swap', () => {
    // Get all animated elements that should fade out before page transition
    const animatedElements = document.querySelectorAll('.feature-card.is-visible, .animate-title, .animate-text, .floating-element');
    
    // Apply exit animations
    animatedElements.forEach((element, index) => {
      // Stagger the fade out slightly
      const delay = index * 30;
      element.style.transition = `opacity 0.4s ease ${delay}ms, transform 0.5s ease ${delay}ms`;
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
    });
    
    // Give time for exit animations to complete
    return new Promise(resolve => {
      // Allow a short time for exit animations
      setTimeout(resolve, 300);
    });
  });
  
  // Handle feature card interactions
  document.querySelectorAll('.feature-card-inner').forEach(card => {
    card.addEventListener('mouseenter', function() {
      // Add a slight delay before showing the icon animation
      setTimeout(() => {
        const icon = this.querySelector('.feature-icon');
        if (icon) {
          icon.style.animation = 'pulseIcon 1.5s infinite alternate ease-in-out';
        }
      }, 150);
    });
    
    card.addEventListener('mouseleave', function() {
      const icon = this.querySelector('.feature-icon');
      if (icon) {
        // Reset the animation
        icon.style.animation = 'none';
        
        // Force a reflow
        icon.offsetHeight;
        
        // Remove the animation property entirely
        icon.style.removeProperty('animation');
      }
    });
  });
});

// Make sure animations work when navigating back with browser history
document.addEventListener('astro:after-swap', function() {
  // Re-trigger animations for elements that should be visible
  setTimeout(() => {
    document.querySelectorAll('.features').forEach(section => {
      section.classList.add('is-in-viewport');
      
      // Re-animate children elements
      section.querySelectorAll('.reveal-element').forEach(el => {
        el.classList.add('is-visible');
      });
      
      section.querySelectorAll('.feature-card').forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('is-visible');
        }, 100 * index);
      });
    });
  }, 100);
});

// Add these styles to the <head> to ensure smooth animations
document.addEventListener('astro:page-load', function() {
  // Add CSS for show-underline class
  const style = document.createElement('style');
  style.textContent = `
    .animate-title.show-underline::after {
      transform: scaleX(1) !important;
    }
    
    @media (max-width: 1024px) {
      .animate-title.show-underline::after {
        transform: translateX(-50%) scaleX(1) !important;
      }
    }
    
    /* Improve animation performance */
    .feature-card, .animate-title, .animate-text, .floating-element, .lottie-container {
      will-change: transform, opacity;
    }
    
    /* Add transition for shape elements */
    .shape {
      opacity: 0;
      transform: scale(0.6);
      transition: opacity 0.8s var(--easeOutQuart), transform 1.2s var(--easeOutBack);
    }
    
    /* Smooth transition for floating elements */
    .floating-element {
      opacity: 0;
      transform: translateY(40px);
      transition: opacity 1.2s var(--easeOutQuart), transform 1.5s var(--easeOutBack);
    }
  `;
  document.head.appendChild(style);
});