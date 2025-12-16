  function scrollToId(id) {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({
      top: el.offsetTop - 70,
      behavior: "smooth"
    });
  }

  function toggleMobileMenu(btn) {
    const menu = document.getElementById("mobileMenu");
    const open = menu.style.display === "block";
    if (open) {
      menu.style.display = "none";
      btn.classList.remove("mobile-open");
    } else {
      menu.style.display = "block";
      btn.classList.add("mobile-open");
    }
  }

  function closeMobileMenu() {
    const menu = document.getElementById("mobileMenu");
    const btn = document.querySelector(".mobile-toggle");
    if (menu) menu.style.display = "none";
    if (btn) btn.classList.remove("mobile-open");
  }

  // Enkel fake-form-hantering (frontend)
  const contactForm = document.getElementById("contactForm");
  const formAlert = document.getElementById("formAlert");

  if (contactForm && formAlert) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      if (!name || !email || !message) {
        formAlert.style.display = "block";
        formAlert.style.borderColor = "var(--error)";
        formAlert.style.color = "#fecaca";
        formAlert.innerHTML = "<strong>Oops!</strong> Fyll i namn, e-post och meddelande innan du skickar.";
        return;
      }

      // Här skulle du normalt skicka datan till ett backend / formulärtjänst
      formAlert.style.display = "block";
      formAlert.style.borderColor = "var(--success)";
      formAlert.style.color = "#bbf7d0";
      formAlert.innerHTML = "<strong>Tack!</strong> Din förfrågan är skickad (demo-läge). Vi hör av oss så snart vi kan.";

      contactForm.reset();
    });
  }

  // Sätt aktuellt år i footer
  const yearSpan = document.getElementById("yearSpan");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
    
// Scroll-shrink navbar & logo (smooth)
const header = document.querySelector("header");
let ticking = false;

window.addEventListener("scroll", () => {
  if (!header) return;

  if (!ticking) {
    window.requestAnimationFrame(() => {
      header.classList.toggle("shrink", window.scrollY > 80);
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// ===============================
// PROCESS – STABLE SCROLL STORY
// ===============================
const panels = Array.from(document.querySelectorAll(".process-panels .panel"));
const steps = Array.from(document.querySelectorAll(".process-steps .step"));
const anchors = panels.map(p => p.querySelector(".panel-anchor")).filter(Boolean);

const railFill = document.getElementById("processRailFill");
const glow = document.getElementById("processGlow");

let isLocked = false;
let lockTimer = null;

function lock(ms = 700) {
  isLocked = true;
  clearTimeout(lockTimer);
  lockTimer = setTimeout(() => (isLocked = false), ms);
}

function setActive(stepNum) {
  steps.forEach(s => s.classList.toggle("active", s.dataset.step === stepNum));
  panels.forEach(p => p.classList.toggle("active", p.dataset.step === stepNum));

  const idx = steps.findIndex(s => s.dataset.step === stepNum);
  if (idx >= 0 && railFill && steps.length > 1) {
    const pct = (idx / (steps.length - 1)) * 100;
    railFill.style.height = `${pct}%`;
  }

  const activeBtn = steps.find(s => s.dataset.step === stepNum);
  if (activeBtn && glow) {
    const y = activeBtn.offsetTop + activeBtn.offsetHeight / 2 - 120;
    glow.style.transform = `translateY(${Math.max(0, y)}px)`;
  }
}

// Observer på anchors (inte på hela panelen)
const io = new IntersectionObserver((entries) => {
  if (isLocked) return;

  // välj den anchor som precis blev synlig
  const hit = entries
    .filter(e => e.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (hit) {
    const panel = hit.target.closest(".panel");
    if (panel) setActive(panel.dataset.step);
  }
}, { threshold: [0.01], rootMargin: "-35% 0px -55% 0px" });

anchors.forEach(a => io.observe(a));

// Klick: lås observern medan smooth scroll kör
steps.forEach(btn => {
  btn.addEventListener("click", () => {
    const targetPanel = document.querySelector(`.panel[data-step="${btn.dataset.step}"]`);
    if (!targetPanel) return;

    setActive(btn.dataset.step);
    lock(800);

    targetPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// init
if (steps[0]) setActive(steps[0].dataset.step);
