interface ThemeToggle {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  getPreferredTheme: () => 'light' | 'dark';
}

const themeToggle: ThemeToggle = {
  theme: (() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme') as 'light' | 'dark';
    }
    return 'dark';
  })(),

  setTheme(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.theme = theme;
  },

  getPreferredTheme() {
    return this.theme;
  },
};

const setupThemeToggle = () => {
  themeToggle.setTheme(themeToggle.getPreferredTheme());

  const themeToggleButton = document.getElementById('themeToggle');
  if (themeToggleButton) {
    themeToggleButton.removeEventListener("click", toggleTheme);
    themeToggleButton.addEventListener("click", toggleTheme);
  }

  function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeToggle.setTheme(isDark ? 'light' : 'dark');
  }

  // Listen for system preference changes, but don't automatically switch
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    // Commented to prevent auto-switching based on system preference
    // themeToggle.setTheme(e.matches ? 'dark' : 'light');
  });
};

const setupHeader = () => {
  const header = document.querySelector("header") as HTMLElement | null;
  const hamburger = document.querySelector(".hamburger") as HTMLButtonElement | null;
  const menu = document.querySelector(".menu") as HTMLElement | null;
  const overlay = document.querySelector(".overlay") as HTMLElement | null;

  if (!header || !hamburger || !menu) return;

  // Mobile menu toggle functionality
  const toggleMenu = () => {
    menu.classList.toggle("active");
    hamburger.classList.toggle("active");
    
    if (overlay) {
      overlay.classList.toggle("active");
    }
    
    document.body.style.overflow = menu.classList.contains("active") ? "hidden" : "";
  };

  // Header scroll effect
  const updateHeader = () => {
    if (window.scrollY > 50) {
      header.classList.add("white");
      header.classList.remove("transparent");
    } else {
      header.classList.add("transparent");
      header.classList.remove("white");
    }
  };

  // Remove existing event listeners to prevent duplicates
  hamburger.removeEventListener("click", toggleMenu);
  if (overlay) overlay.removeEventListener("click", toggleMenu);
  window.removeEventListener("scroll", updateHeader);

  // Add event listeners
  hamburger.addEventListener("click", toggleMenu);
  if (overlay) overlay.addEventListener("click", toggleMenu);
  window.addEventListener("scroll", updateHeader);

  // Initialize header state
  updateHeader();
};

const setupDropdowns = () => {
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  
  if (!dropdownToggles.length) return;
  
  // Close all dropdowns when clicking outside
  const closeDropdownsOnOutsideClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.has-dropdown')) {
      document.querySelectorAll('.has-dropdown').forEach(dropdown => {
        dropdown.classList.remove('open');
      });
    }
  };
  
  // Toggle dropdown on click
  const toggleDropdown = function(this: HTMLElement, e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    const parent = this.closest('.has-dropdown') as HTMLElement;
    const isOpen = parent.classList.contains('open');
    
    // Close all other open dropdowns
    document.querySelectorAll('.has-dropdown.open').forEach(openDropdown => {
      if (openDropdown !== parent) {
        openDropdown.classList.remove('open');
      }
    });
    
    // Toggle current dropdown
    parent.classList.toggle('open', !isOpen);
  };
  
  // Remove existing event listeners
  document.removeEventListener('click', closeDropdownsOnOutsideClick as EventListener);
  dropdownToggles.forEach(toggle => {
    toggle.removeEventListener('click', toggleDropdown as EventListener);
  });
  
  // Add new event listeners
  document.addEventListener('click', closeDropdownsOnOutsideClick as EventListener);
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', toggleDropdown as EventListener);
  });
};

const setupFadeInAnimations = () => {
  const elements = document.querySelectorAll(".fade-in");
  
  if (!elements.length) return;
  
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );
  
  elements.forEach((element) => {
    observer.observe(element);
  });
};

// Main initialization function
const initApp = () => {
  setupThemeToggle();
  setupHeader();
  setupDropdowns();
  setupFadeInAnimations();
};

// Run script on initial page load
document.addEventListener('DOMContentLoaded', initApp);

// Re-run script after Astro View Transitions
document.addEventListener('astro:after-swap', initApp);

// Debug message
console.log("Halo brother, hayo lagi ngapain nih, salam Qualita-Indonesia!");