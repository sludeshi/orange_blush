/* Orange Blush Salon and Barber. Plain JavaScript, no libraries. */

/* 1. Edit your details here. Everything on the site reads from this block. */
const CONFIG = {
  phone: "254799496725", // digits only, with country code (no + or spaces)
  email: "orangeblushke@gmail.com",
  reviewUrl: "https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Orange+Blush+Salon+and+Barber+Tuala",
  message: "Hello Orange Blush, I would like to book an appointment."
};

/* Opening hours in 24h decimals. 0 = Sunday ... 6 = Saturday. */
const HOURS = { 0: [8, 20.5], 1: [12, 20.5], 2: [8, 20.5], 3: [8, 20.5], 4: [8, 20.5], 5: [8, 20.5], 6: [8, 20.5] };

/* 2. Fill in links (WhatsApp, phone, email, review, map) */
const setLinks = (selector, href) =>
  document.querySelectorAll(selector).forEach(a => a.setAttribute("href", href));

setLinks("[data-wa]", `https://wa.me/${CONFIG.phone}?text=${encodeURIComponent(CONFIG.message)}`);
setLinks("[data-tel]", `tel:+${CONFIG.phone}`);
setLinks("[data-mail]", `mailto:${CONFIG.email}`);
setLinks("[data-review]", CONFIG.reviewUrl);
setLinks("[data-map]", CONFIG.mapsUrl);
document.querySelectorAll("[data-wa]").forEach(a => {
  a.target = "_blank";
  a.rel = "noopener";
});

/* 3. Mobile menu */
const menuBtn = document.querySelector(".menu-btn");
const menu = document.getElementById("menu");
const toggleMenu = open => {
  menu.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
};
menuBtn.addEventListener("click", () => toggleMenu(!menu.classList.contains("open")));
menu.addEventListener("click", e => { if (e.target.closest("a")) toggleMenu(false); });
document.addEventListener("keydown", e => { if (e.key === "Escape") toggleMenu(false); });

/* 4. "Open now" badge, using Nairobi time */
function updateStatus() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23"
  }).formatToParts(new Date());
  const get = type => parts.find(p => p.type === type).value;
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  const now = Number(get("hour")) + Number(get("minute")) / 60;
  const [open, close] = HOURS[day];
  const fmt = h => {
    const hh = Math.floor(h), mm = h % 1 ? "30" : "00";
    return `${hh % 12 || 12}:${mm} ${hh < 12 ? "am" : "pm"}`;
  };
  const isOpen = now >= open && now < close;
  document.getElementById("badge").textContent = isOpen ? "Open now" : "Closed now";
  document.getElementById("status").textContent =
    `Today we are open ${fmt(open)} to ${fmt(close)}. Tuesday to Sunday from 8:00 am, Monday from 12:00 pm.`;
}
updateStatus();

/* 5. Hero video: load after the page finishes so it never slows first paint */
const tour = document.getElementById("tour");
const saveData = navigator.connection && navigator.connection.saveData;
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches || saveData;
if (tour) {
  if (calm) {
    tour.controls = true; // visitor chooses to play
    tour.src = tour.dataset.src;
  } else {
    window.addEventListener("load", () => {
      tour.src = tour.dataset.src;
      tour.play().catch(() => { tour.controls = true; });
    });
  }
}

/* 6. Gallery: hide broken images (shows the label tile) and open a lightbox */
const markMissing = img => img.classList.add("missing");
document.querySelectorAll(".shot img").forEach(img => {
  img.addEventListener("error", () => markMissing(img));
  if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) {
    // Lazy images that have not loaded yet report complete=false, so this only catches real failures.
    markMissing(img);
  }
});

const box = document.getElementById("lightbox");
const boxImg = box.querySelector("img");
document.querySelectorAll(".shot").forEach(btn => {
  btn.addEventListener("click", () => {
    const img = btn.querySelector("img");
    if (img.classList.contains("missing")) return;
    boxImg.src = img.currentSrc || img.src;
    boxImg.alt = img.alt;
    box.showModal();
  });
});
box.querySelector(".close").addEventListener("click", () => box.close());
box.addEventListener("click", e => { if (e.target === box) box.close(); });

/* 7. Footer year */
document.getElementById("year").textContent = new Date().getFullYear();
