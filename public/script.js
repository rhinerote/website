"use strict";

function changeText() {
  const demo = document.getElementById("demo");
  if (demo) demo.innerHTML = "Текст змінено за допомогою JavaScript!";
}

function toggleVisibility() {
  const block = document.getElementById("toggleBlock");
  if (block) block.style.display = block.style.display === "none" ? "block" : "none";
}

function toggleMenu() {
  const menu = document.getElementById("sideMenu");
  menu?.classList.toggle("open");
}

const banners = document.querySelectorAll(".parallax-banner");
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("reveal");
    });
  },
  { threshold: 0.3 }
);
banners.forEach(b => observer.observe(b));

document.querySelectorAll(".feature-card").forEach(card => {
  const btn = card.querySelector(".learn-btn");
  btn?.addEventListener("click", () => {
    if (card.classList.contains("expanded")) return;

    const full = card.querySelector(".card-full");
    full.innerHTML = full.textContent
      .trim()
      .split(/\s+/)
      .map(word => `<span>${word}</span>`)
      .join(" ");

    card.classList.add("expanded");
  });
});

const revealEls = document.querySelectorAll(".reveal-up");
const ioReveal = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        ioReveal.unobserve(e.target);
      }
    });
  },
  { rootMargin: "0px 0px -10% 0px" }
);
revealEls.forEach(el => ioReveal.observe(el));

document.addEventListener("DOMContentLoaded", () => {
  const track   = document.getElementById("track");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const form    = document.getElementById("messageForm");

  prevBtn?.addEventListener("click", () =>
    track?.scrollBy({ left: -380, behavior: "smooth" })
  );
  nextBtn?.addEventListener("click", () =>
    track?.scrollBy({ left: 380, behavior: "smooth" })
  );

  async function fetchMessages() {
    if (!track) return;

    const res  = await fetch("/api/messages");
    const msgs = await res.json();

    track.querySelectorAll(".testimonial").forEach(el => el.remove());

    msgs
      .filter(m => m.firstName || m.lastName)
      .forEach(({ _id, text, firstName = "", lastName = "", avatarUrl }) => {
        const card = document.createElement("article");
        card.className = "testimonial";
        card.innerHTML = `
          <img class="avatar" src="${avatarUrl || "img/avatar-default.jpg"}" alt="">
          <svg class="quotes" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M14 4h-6l-6 10v14h12V14H8.6l3.4-6h2V4zm20 0h-6l-6 10v14h12V14h-5.4l3.4-6h2V4z"/>
          </svg>
          <h3 class="author">${`${firstName} ${lastName}`.trim()}</h3>
          <p  class="text">${text}</p>
          <button class="message-delete" title="Видалити">×</button>
        `;

        card.querySelector(".message-delete").onclick = async () => {
          await fetch(`/api/messages/${_id}`, { method: "DELETE" });
          await fetchMessages();
        };

        track.appendChild(card);
      });
  }

  fetchMessages();

  form?.addEventListener("submit", async e => {
    e.preventDefault();

    const payload = {
      firstName: document.getElementById("firstName")?.value.trim() ?? "",
      lastName : document.getElementById("lastName") ?.value.trim() ?? "",
      phone    : document.getElementById("phone")    ?.value.trim() ?? "",
      email    : document.getElementById("email")    ?.value.trim() ?? "",
      text     : document.getElementById("text")     ?.value.trim() ?? ""
    };

    if (Object.values(payload).some(v => !v)) return;

    const submitBtn = form.querySelector(".btn");
    submitBtn.disabled = true;

    try {
      await fetch("/api/messages", {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify(payload)
      });
      form.reset();
      await fetchMessages();
    } finally {
      submitBtn.disabled = false;
    }
  });

  const logoTrack = document.querySelector(".logo-track");
  if (logoTrack) logoTrack.innerHTML += logoTrack.innerHTML;

  const triggers = document.querySelectorAll(".mega-link");
  const mega     = document.getElementById("mega-menu");
  const panes    = mega?.querySelectorAll(".mega-pane") ?? [];
  const overlay  = document.getElementById("mega-overlay");
  let hideTO;

  const setActivePane = name => {
    panes.forEach(p => p.classList.toggle("active", p.dataset.pane === name));
  };

  const openMega = name => {
    clearTimeout(hideTO);
    setActivePane(name);
    document.body.classList.add("mega-open");
  };

  const closeMega = () => {
    hideTO = setTimeout(() => document.body.classList.remove("mega-open"), 120);
  };

  triggers.forEach(link => {
    const pane = link.dataset.pane;

    link.addEventListener("mouseenter", () => openMega(pane));
    link.addEventListener("focus",      () => openMega(pane));

    link.addEventListener("mouseleave", closeMega);
    link.addEventListener("blur",       closeMega);
  });

  mega?.addEventListener("mouseenter", () => clearTimeout(hideTO));
  mega?.addEventListener("mouseleave", closeMega);

  overlay?.addEventListener("click", () => document.body.classList.remove("mega-open"));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") document.body.classList.remove("mega-open");
  });

  const ctaBtn   = document.getElementById("ctaDemo");
  const sheet    = document.getElementById("demoSheet");
  if (ctaBtn && sheet) {
    const closeBtn  = sheet.querySelector(".sheet-close");

    const openSheet  = () => document.body.classList.add("sheet-open");
    const closeSheet = () => document.body.classList.remove("sheet-open");

    ctaBtn.addEventListener("click", openSheet);
    closeBtn?.addEventListener("click", closeSheet);

    sheet.addEventListener("click", e => {
      if (e.target === sheet) closeSheet();
    });
    window.addEventListener("keydown", e => {
      if (e.key === "Escape") closeSheet();
    });

    document.getElementById("demoForm")?.addEventListener("submit", e => {
      e.preventDefault();
      alert("Дякуємо! Ми з вами зв’яжемося.");
      closeSheet();
      e.target.reset();
    });
  }

  /* ----- demo form handler (separate page) ----- */
  const demoForm   = document.getElementById("demoForm");
  const demoStatus = demoForm?.querySelector(".demo-status");

  demoForm?.addEventListener("submit", async e => {
    e.preventDefault();

    const btn = demoForm.querySelector(".demo-submit");
    btn.disabled = true;

    const formData = Object.fromEntries(new FormData(demoForm));

    try {
      await fetch("/api/demo", {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify(formData)
      });
      demoForm.reset();
      if (demoStatus) demoStatus.hidden = false;
    } catch {
      alert("Упс, щось пішло не так. Спробуйте пізніше.");
    } finally {
      btn.disabled = false;
    }
  });
});























document.addEventListener('DOMContentLoaded', () => {
  const toggle   = document.getElementById('navToggle');
  const overlay  = document.getElementById('navOverlay');

  if (!toggle) return;

  const close = () => {
    document.body.classList.remove('menu-open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
  };

  toggle.addEventListener('click', () => {
    const opened = !document.body.classList.toggle('menu-open');
    toggle.classList.toggle('open', !opened);
    toggle.setAttribute('aria-expanded', String(!opened));
  });

  overlay?.addEventListener('click', close);
  window.addEventListener('keydown', e => { if (e.key==='Escape') close(); });
});
