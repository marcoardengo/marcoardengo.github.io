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

/* ========================================
   SLIDING NAVIGATION INDICATOR
   ======================================== */

const nav = document.querySelector(".desktop-nav");

const indicator = document.createElement("span");

indicator.className = "nav-indicator";

indicator.setAttribute("aria-hidden", "true");

if (nav) {
  nav.appendChild(indicator);
}

function moveIndicator(activeLink) {

  if (!nav || !activeLink) return;

  const navRect = nav.getBoundingClientRect();

  const linkRect = activeLink.getBoundingClientRect();

  const left = linkRect.left - navRect.left + nav.scrollLeft;

  indicator.style.width = `${linkRect.width}px`;

  indicator.style.transform = `translateX(${left}px)`;

}


  const scrollLinks = document.querySelectorAll(
    'a[href^="#"]:not([href="#"])'
  );

  const sections = document.querySelectorAll(
    "section[id], footer[id]"
  );

  let animationFrame = null;
   let isAutoScrolling = false;


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
     isAutoScrolling = true;

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

         isAutoScrolling = false;

         updateActiveMenu();

      }

    }

    animationFrame = requestAnimationFrame(animate);

  }


  /* ========================================
     HANDLE NAVIGATION CLICKS
     ======================================== */

  scrollLinks.forEach(link => {

    link.addEventListener("click", event => {

      // Sposta immediatamente la linea sulla voce cliccata
if (link.closest(".desktop-nav")) {

  navLinks.forEach(navLink => {
    navLink.classList.remove("active");
    navLink.removeAttribute("aria-current");
  });

  link.classList.add("active");
  link.setAttribute("aria-current", "location");

  moveIndicator(link);

}      
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
         updateActiveMenu()

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

     if (isAutoScrolling) return;

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

     
let activeLink = null;

navLinks.forEach(link => {

  const isActive =
    link.getAttribute("href") ===
    "#" + currentSection;

  link.classList.toggle("active", isActive);

  if (isActive) {

    activeLink = link;

    link.setAttribute("aria-current", "location");

  } else {

    link.removeAttribute("aria-current");

  }

});

// Sposta la linea rossa sotto la voce attiva
moveIndicator(activeLink);



     

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
