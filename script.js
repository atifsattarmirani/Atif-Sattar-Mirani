const body = document.body;
const toggle = document.getElementById("themeToggle");
const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav-links");

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme) body.dataset.theme = savedTheme;

function updateThemeIcon() {
  toggle.textContent = body.dataset.theme === "dark" ? "☀" : "☾";
}
updateThemeIcon();

toggle.addEventListener("click", () => {
  body.dataset.theme = body.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("portfolio-theme", body.dataset.theme);
  updateThemeIcon();
});

menuBtn.addEventListener("click", () => nav.classList.toggle("open"));
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});
