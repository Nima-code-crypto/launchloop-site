  console.log("script.js loaded");
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
    
  // Scroll-shrink navbar & logo
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  header.classList.toggle("shrink", window.scrollY > 80);
});
