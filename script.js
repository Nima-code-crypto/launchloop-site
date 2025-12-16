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
// PROCESS – PROGRESS + GLOW + ACTIVE STEP
// ===============================
const processPanels = Array.from(document.querySelectorAll(".process-panels .panel"));
const processSteps = Array.from(document.querySelectorAll(".process-steps .step"));
const processRailFill = document.getElementById("processRailFill");
const processGlow = document.getElementById("processGlow");

function setActiveProcess(stepNum) {
  // active classes
  processSteps.forEach(btn => btn.classList.toggle("active", btn.dataset.step === stepNum));
  processPanels.forEach(panel => panel.classList.toggle("active", panel.dataset.step === stepNum));

  // rail fill (0–100%)
  const idx = processSteps.findIndex(btn => btn.dataset.step === stepNum);
  if (idx >= 0 && processRailFill && processSteps.length > 1) {
    const pct = (idx / (processSteps.length - 1)) * 100;
    processRailFill.style.height = `${pct}%`;
  }

  // glow follows active step
  const activeBtn = processSteps.find(btn => btn.dataset.step === stepNum);
  if (activeBtn && processGlow) {
    const y = activeBtn.offsetTop + activeBtn.offsetHeight / 2 - 120;
    processGlow.style.transform = `translateY(${Math.max(0, y)}px)`;
  }
}

// IntersectionObserver: välj den panel som är mest synlig
const processObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter(e => e.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (visible) setActiveProcess(visible.target.dataset.step);
}, { threshold: [0.35, 0.55, 0.75] });

processPanels.forEach(panel => processObserver.observe(panel));

// Klick på steg → scrolla till panel (och sätt active direkt)
processSteps.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = document.querySelector(`.panel[data-step="${btn.dataset.step}"]`);
    if (target) {
      setActiveProcess(btn.dataset.step);
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
});

// init
if (processSteps[0]) setActiveProcess(processSteps[0].dataset.step);
