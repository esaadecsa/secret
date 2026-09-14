(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const slides = Array.from(document.querySelectorAll(".slide"));
  const total = slides.length;

  const prevBtn = $("#prevBtn");
  const nextBtn = $("#nextBtn");
  const progressFill = $("#progressFill");
  const liveRegion = $("#liveRegion");
  const swipeHint = $("#swipeHint");

  let current = 0;
  let isAnimating = false;

  function render() {
    slides.forEach((s, i) => s.classList.toggle("active", i === current));
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;

    const pct = (current / (total - 1)) * 100;
    progressFill.style.width = pct + "%";

    const msg = slides[current].querySelector(".slide-message");
    if (liveRegion && msg) liveRegion.textContent = msg.textContent;

    if (swipeHint) swipeHint.classList.toggle("show", current === 0);
  }

  function goTo(index) {
    if (isAnimating) return;
    if (index < 0 || index > total - 1) return;
    current = index;
    isAnimating = true;
    render();
    window.setTimeout(() => { isAnimating = false; }, 260);
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
  });

  /* swipe sentuh, sederhana & toleran */
  let touchStartX = null;
  let touchStartY = null;
  const stage = $("#stage");

  stage.addEventListener("touchstart", (e) => {
    const t = e.changedTouches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
  }, { passive: true });

  stage.addEventListener("touchend", (e) => {
    if (touchStartX === null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    touchStartX = null;

    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) next(); else prev();
  }, { passive: true });

  render();
})();
