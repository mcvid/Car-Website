const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
const closeBtn = document.getElementById("closeBtn");
const overlay = document.getElementById("overlay");
const navbar = document.getElementById("navbar");

menuBtn.addEventListener("click", () => {
  sideMenu.classList.add("active");
  closeBtn.classList.add("active");
  overlay.classList.add("active");
});

closeBtn.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);

function closeMenu() {
  sideMenu.classList.remove("active");
  closeBtn.classList.remove("active");
  overlay.classList.remove("active");
}

// Transparent Navbar Scroll
window.addEventListener("scroll", () => {
  if (window.scrollY > 10) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");
});
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero-content");
  if (hero) {
    hero.style.opacity = "1";
  }
});
// HERO SLIDESHOW
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

let current = 0;

function showSlide(index) {
  slides.forEach((s, i) => s.classList.toggle("active", i === index));
  dots.forEach((d, i) => d.classList.toggle("active", i === index));
  current = index;
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showSlide(index);
  });
});

// Auto Slide
setInterval(() => {
  let next = (current + 1) % slides.length;
  showSlide(next);
}, 3000); // 5 sec
