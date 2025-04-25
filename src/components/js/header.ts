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
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
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

const initApp = () => {
  /*** 🌙 Dark Mode ***/
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

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    themeToggle.setTheme(e.matches ? 'dark' : 'light');
  });

  /*** 🔥 Header Transparan & Navbar ***/
  const header = document.querySelector("header") as HTMLElement | null;
  const hamburger = document.querySelector(".hamburger") as HTMLButtonElement | null;
  const menu = document.querySelector(".menu") as HTMLElement | null;
  const overlay = document.querySelector(".overlay") as HTMLElement | null;

  if (!header || !hamburger || !menu || !overlay) return;

  const toggleMenu = () => {
    menu.classList.toggle("active");
    hamburger.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.style.overflow = menu.classList.contains("active") ? "hidden" : "";
  };

  const updateHeader = () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      header.classList.add("white");
      header.classList.remove("transparent");
    } else {
      header.classList.add("transparent");
      header.classList.remove("white");
    }
  };

  // Hapus event listener lama agar tidak dobel
  hamburger.removeEventListener("click", toggleMenu);
  overlay.removeEventListener("click", toggleMenu);
  window.removeEventListener("scroll", updateHeader);

  // Tambahkan event listener lagi
  hamburger.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", toggleMenu);
  window.addEventListener("scroll", updateHeader);

  updateHeader();

  /*** 🎭 Fade-in Animation ***/
  const elements = document.querySelectorAll(".fade-in");
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

// Jalankan script saat halaman pertama dimuat
document.addEventListener('DOMContentLoaded', initApp);

// Jalankan ulang script setelah transisi halaman dengan Astro View Transitions
document.addEventListener('astro:after-swap', initApp);

console.log("Halo brother, hayo lagi ngapain nih:v");
