
  function initClientAnimations() {
    // Add fade-in effect for client items
    const clientItems = document.querySelectorAll(".client-item");
    
    // Function to check if an element is in viewport
    const isElementInViewport = (el) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    };
    
    // Add staggered delay to each client item
    clientItems.forEach((item, index) => {
      const delay = index % 13 * 100; // Stagger effect within each row
      item.style.transitionDelay = `${delay}ms`;
    });
    
    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // We can stop observing once it's visible
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2, // Start animation when 20% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Trigger a bit before the element comes into view
      }
    );
    
    // Observe all client items
    clientItems.forEach((item) => observer.observe(item));
    
    // Initial check for items already in the viewport on page load
    clientItems.forEach((item) => {
      if (isElementInViewport(item)) {
        item.classList.add("visible");
        observer.unobserve(item);
      }
    });
    
    // Handle marquee animations for better performance
    const clientTracks = document.querySelectorAll(".client-track");
    
    // Detect if the page is hidden/inactive to pause animations
    const handleVisibilityChange = () => {
      const isPaused = document.hidden ? "paused" : "running";
      clientTracks.forEach((track) => {
        track.style.animationPlayState = isPaused;
      });
    };
    
    // Make sure we only add this event listener once
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Restart animations when they come into view after being off-screen
    const trackObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const track = entry.target;
            track.style.animationPlayState = "running";
          } else {
            const track = entry.target;
            track.style.animationPlayState = "paused";
          }
        });
      },
      { threshold: 0.1 }
    );
    
    clientTracks.forEach((track) => trackObserver.observe(track));
  }
  
  // Reset animation states for view transitions
  function resetClientAnimations() {
    // Remove visible class from all client items
    document.querySelectorAll(".client-item").forEach((item) => {
      item.classList.remove("visible");
    });
  }

  // Initial page load
  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initClientAnimations);
  } else {
    initClientAnimations();
  }
  
  // For Astro View Transitions - run after each page transition
  document.addEventListener('astro:page-load', initClientAnimations);
  
  // Handle hash navigation and resets
  document.addEventListener('astro:after-swap', () => {
    // Reset animation states
    resetClientAnimations();
    
    // Reinitialize with a small delay to ensure DOM is fully updated
    setTimeout(initClientAnimations, 100);
  });
