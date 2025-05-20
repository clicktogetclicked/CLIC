document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll("h1, h2, p, .highlight, .clic-section");

  elements.forEach((el, i) => {
    el.style.opacity = 0;
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    setTimeout(() => {
      el.style.opacity = 1;
      el.style.transform = "translateY(0)";
    }, i * 150);
  });
});
