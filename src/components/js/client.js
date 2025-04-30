document.addEventListener("DOMContentLoaded", () => {
  const clientItems = document.querySelectorAll(".client-item");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    {
      threshold: 0.4,
    }
  );

  clientItems.forEach((item) => observer.observe(item));
});
