/* ==========================================
   MARCO ARDENGO — ACADEMIC WEBSITE
   Navigation & Smooth Scrolling
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ========================================
     ELEMENTS
     ======================================== */

  const header = document.querySelector(".site-header");

  const navLinks = document.querySelectorAll(
    '.desktop-nav a[href^="#"]'
  );

  const scrollLinks = document.querySelectorAll(
    'a[href^="#"]:not([href="#"])'
  );

  const sections = document.querySelectorAll(
    "section[id], footer[id]"
  );

  let animationFrame = null;


  /* ========================================
     EASING FUNCTION
     ======================================== */

  // Fast start, progressively slower finish.

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }


  /* ========================================
     SMOOTH SCROLLING
     ======================================== */

  function smoothScrollTo(targetPosition, duration = 900) {

    // Cancel any previous animation.

    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
    }

    const startPosition = window.scrollY;

    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const destination = Math.max(
      0,
      Math.min(targetPosition, maxScroll)
    );

    const distance = destination - startPosition;

    const startTime = performance.now();

    function animate(currentTime) {

      const elapsed = currentTime - startTime;

      const progress = Math.min(
        elapsed / duration,
        1
      );

      const easing = easeOutCubic(progress);

      window.scrollTo(
        0,
        startPosition + distance * easing
      );

      if (progress < 1) {

        animationFrame = requestAnimationFrame(animate);

      } else {

        animationFrame = null;

      }

    }

    animationFrame = requestAnimationFrame(animate);

  }


  /* ========================================
     HANDLE NAVIGATION CLICKS
     ======================================== */

  scrollLinks.forEach(link => {

    link.addEventListener("click", event => {

      const targetId = link.getAttribute("href");

      const target = document.getElementById(
        targetId.substring(1)
      );

      if (!target) return;

      event.preventDefault();

      const headerHeight = header
        ? header.getBoundingClientRect().height
        : 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      // Respect accessibility preferences.

      if (
        window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
      ) {

        window.scrollTo(0, targetPosition);

      } else {

        smoothScrollTo(targetPosition, 900);

      }

      // Update the URL without reloading.

      history.pushState(null, "", targetId);

    });

  });


  /* ========================================
     ACTIVE NAVIGATION
     ======================================== */

  function updateActiveMenu() {

    let currentSection = "home";

    const headerHeight = header
      ? header.getBoundingClientRect().height
      : 0;

    const scrollPosition =
      window.scrollY + headerHeight + 80;

    sections.forEach(section => {

      if (scrollPosition >= section.offsetTop) {

        currentSection = section.id;

      }

    });

    // Highlight Contact at the bottom.

    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 5
    ) {

      currentSection = "contact";

    }

    navLinks.forEach(link => {

      const isActive =
        link.getAttribute("href") ===
        "#" + currentSection;

      link.classList.toggle("active", isActive);

      if (isActive) {

        link.setAttribute("aria-current", "location");

      } else {

        link.removeAttribute("aria-current");

      }

    });

  }


  /* ========================================
     EVENT LISTENERS
     ======================================== */

  window.addEventListener(
    "scroll",
    updateActiveMenu,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    updateActiveMenu
  );

  updateActiveMenu();

});
