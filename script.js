  // ===============================
// FORCE TOP ON LOAD / REFRESH
// ===============================
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// Direkt (så tidigt som möjligt)
window.scrollTo(0, 0);

// När sidan visas (funkar även vid back/forward cache)
window.addEventListener("pageshow", () => {
  window.scrollTo(0, 0);
});

// Extra säkerhet vid refresh/navigering
window.addEventListener("beforeunload", () => {
  window.scrollTo(0, 0);
});

  
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

function goAbsoluteTop() {
  // Stäng mobilmeny om den är öppen
  try { closeMobileMenu(); } catch (e) {}

  // 1) Direkt hård reset
  window.scrollTo(0, 0);

  // 2) På nästa frame (efter layout)
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);

    // Säkerställ navbar default-läge direkt
    header?.classList.remove("shrink");
  });
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
// Kör en gång direkt så default-läget blir korrekt vid start
header?.classList.toggle("shrink", window.scrollY > 80);


// ===============================
// PROCESS (QS) – STICKY TIMELINE + STICKY CARD
// ===============================
let lastStep = null;

const qsSteps = Array.from(document.querySelectorAll(".qs-step"));
const qsTriggers = Array.from(document.querySelectorAll(".qs-trigger"));

const qsFill = document.getElementById("qsRailFill");
const qsGlow = document.getElementById("qsGlow");

const qsKicker = document.getElementById("qsKicker");
const qsTitle = document.getElementById("qsTitle");
const qsBody = document.getElementById("qsBody");
const qsResult = document.getElementById("qsResult");

let qsLocked = false;
let qsLockTimer = null;
const qsLock = (ms = 650) => {
  qsLocked = true;
  clearTimeout(qsLockTimer);
  qsLockTimer = setTimeout(() => (qsLocked = false), ms);
};

function setQS(stepNum) {
  if (stepNum === lastStep) return;
  lastStep = stepNum;

  qsSteps.forEach(b => b.classList.toggle("active", b.dataset.step === stepNum));

  // glow följer aktivt steg
  const activeBtn = qsSteps.find(b => b.dataset.step === stepNum);
  if (activeBtn && qsGlow) {
    const y = activeBtn.offsetTop + activeBtn.offsetHeight / 2 - 140;
    qsGlow.style.transform = `translateY(${Math.max(0, y)}px)`;
  }

  // uppdatera sticky card content
  const trg = qsTriggers.find(t => t.dataset.step === stepNum);
  if (trg) {
    if (qsKicker) qsKicker.textContent = `Steg ${stepNum}`;
    if (qsTitle) qsTitle.textContent = trg.dataset.title || "";
    if (qsBody) qsBody.textContent = trg.dataset.body || "";
    if (qsResult) qsResult.textContent = trg.dataset.result || "";
  }
}

// ===============================
// QS – CONTINUOUS RAIL PROGRESS (smooth)
// ===============================
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

let triggerMids = [];

function recalcTriggerMids(){
  triggerMids = qsTriggers.map(t => {
    const r = t.getBoundingClientRect();
    return (window.scrollY + r.top + r.height / 2);
  });
}

// Kör direkt + på resize + efter att sidan laddat
recalcTriggerMids();
window.addEventListener("resize", recalcTriggerMids);

let railTicking = false;

function updateRailContinuous(){
  railTicking = false;
// ✅ Om vi är ovanför: tvinga steg 1 och avbryt
  if (forceStep1IfAbove()) return;

  // ✅ Om vi inte ens är inne i process: gör inget
  if (processState() !== "inside") return;
  if (!qsFill || triggerMids.length < 2) return;

  const y = window.scrollY + window.innerHeight * 0.5; // viewport-mitten

  // Clamp mot första/sista så linjen inte flippar
  const first = triggerMids[0];
  const last  = triggerMids[triggerMids.length - 1];

  const yc = clamp(y, first, last);

  let i = 0;
  while (i < triggerMids.length - 2 && yc > triggerMids[i + 1]) i++;

  const a = triggerMids[i];
  const b = triggerMids[i + 1];
  const t = (b - a) === 0 ? 0 : clamp((yc - a) / (b - a), 0, 1);

  const progress = clamp((i + t) / (triggerMids.length - 1), 0, 1);

  // Bara linjen (kontinuerlig)
  qsFill.style.transform = `scaleY(${progress})`;
}


window.addEventListener("scroll", () => {
  if (!railTicking) {
    railTicking = true;
    requestAnimationFrame(updateRailContinuous);
  }
}, { passive: true });

// init
requestAnimationFrame(updateRailContinuous);

let qsActiveIndex = 0; // håller koll på vilket steg som är aktivt

const processSection = document.getElementById("process");

function processState() {
  if (!processSection) return "outside";

  const r = processSection.getBoundingClientRect();
  const headerOffset = 140; // typ din sticky header / spacing

  // ovanför sektionen (inte nått steg 1 ännu)
  if (r.top > headerOffset) return "above";

  // långt under sektionen (har lämnat den)
  if (r.bottom < headerOffset) return "below";

  return "inside";
}

function forceStep1IfAbove() {
  if (processState() === "above") {
    lastStep = null;          // reset så setQS får köra
    setQS("1");               // alltid steg 1 när man är ovanför
    if (qsFill) qsFill.style.transform = "scaleY(0)"; // om du kör continuous fill
    return true;
  }
  return false;
}



const qsIO = new IntersectionObserver(() => {
  if (qsLocked) return;

  // ✅ Om vi är ovanför: tvinga steg 1 och avbryt
  if (forceStep1IfAbove()) return;

  // ✅ Om vi inte ens är inne i process: gör inget
  if (processState() !== "inside") return;

  const viewportMid = window.innerHeight / 2;

  let bestEl = null;
  let bestDist = Infinity;

  // ✅ kolla ALLA triggers, inte bara entries
  for (const el of qsTriggers) {
    const r = el.getBoundingClientRect();
    if (r.bottom <= 0 || r.top >= window.innerHeight) continue;

    const mid = r.top + r.height / 2;
    const dist = Math.abs(mid - viewportMid);

    if (dist < bestDist) {
      bestDist = dist;
      bestEl = el;
    }
  }

 if (bestEl) {
  const bestIndex = qsTriggers.indexOf(bestEl);
  const curEl = qsTriggers[qsActiveIndex];

  // hysteresis: byt bara om nya är "tydligt bättre"
  const viewportMid = window.innerHeight / 2;

  const dist = (el) => {
    const r = el.getBoundingClientRect();
    const mid = r.top + r.height / 2;
    return Math.abs(mid - viewportMid);
  };

  const bestDist = dist(bestEl);
  const curDist  = curEl ? dist(curEl) : Infinity;

  if (bestIndex !== -1 && bestDist + 40 < curDist) {
    qsActiveIndex = bestIndex;
    setQS(bestEl.dataset.step);
  }
}

}, {
  threshold: 0.01,
  rootMargin: "-30% 0px -30% 0px"
});

qsTriggers.forEach(t => qsIO.observe(t));

// Klick: scrolla till trigger (center) och lås observern en kort stund
qsSteps.forEach(btn => {
  btn.addEventListener("click", () => {
    const trg = qsTriggers.find(t => t.dataset.step === btn.dataset.step);
    if (!trg) return;

    qsActiveIndex = qsTriggers.indexOf(trg); // ✅ lägg till denna
    setQS(btn.dataset.step);
    qsLock(800);
    trg.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(recalcTriggerMids, 350);
  });
});

// init
/*if (qsSteps[0]) setQS(qsSteps[0].dataset.step);*/
window.addEventListener("load", () => {
  lastStep = null;
  setQS("1");
  if (qsFill) qsFill.style.transform = "scaleY(0)";
});

// Tvinga absolut toppläge vid load (för navbar-zoom m.m.)
window.addEventListener("load", () => {
  window.scrollTo(0, 0);
  header?.classList.remove("shrink");
});

function goAbsoluteTop() {
  try { closeMobileMenu(); } catch (e) {}

  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";

  window.scrollTo(0, 0);

  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
    html.style.scrollBehavior = prev || "";
    header?.classList.remove("shrink");
  });
}

const logoHome = document.getElementById("logoHome");

if (logoHome) {
  logoHome.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    goAbsoluteTop();
  });
}





