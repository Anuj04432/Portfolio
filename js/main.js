/**
 * ANUJ WAGMORE - AI LAB / PORTFOLIO MAIN CONTROLLER
 * Handles navigation, role animation, scroll reveals, and skill ring metrics.
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initRoleSwitcher();
  initScrollReveals();
  initSkillRings();
});

/* ==========================================================================
   1. Navbar & Mobile Menu Interaction
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  const mobileToggle = document.querySelector(".mobile-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-link");

  // Scroll effect on navbar
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isActive = navLinks.classList.toggle("active");
      mobileToggle.setAttribute("aria-expanded", String(isActive));
      const icon = mobileToggle.querySelector("i");
      if (icon) {
        icon.className = isActive ? "fa-solid fa-xmark" : "fa-solid fa-bars";
      }
    });

    // Close menu when clicking a link
    navItems.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        mobileToggle.setAttribute("aria-expanded", "false");
        const icon = mobileToggle.querySelector("i");
        if (icon) icon.className = "fa-solid fa-bars";
      });
    });

    // Close menu on outside click
    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        navLinks.classList.remove("active");
        mobileToggle.setAttribute("aria-expanded", "false");
        const icon = mobileToggle.querySelector("i");
        if (icon) icon.className = "fa-solid fa-bars";
      }
    });
  }

  // Active section spy
  const sections = document.querySelectorAll("section[id]");
  if (sections.length && navItems.length) {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute("id");
          navItems.forEach((link) => {
            const href = link.getAttribute("href");
            if (href === `#${currentId}` || href === `index.html#${currentId}`) {
              link.classList.add("active");
            } else if (href && href.startsWith("#")) {
              link.classList.remove("active");
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((sec) => sectionObserver.observe(sec));
  }
}

/* ==========================================================================
   2. Rotating Role Subline
   ========================================================================== */
function initRoleSwitcher() {
  const roleElement = document.getElementById("hero-role-text");
  if (!roleElement) return;

  const roles = [
    "AI & Machine Learning Engineer",
    "Local LLM & Neural Model Developer",
    "Deep Learning & NLP Specialist",
    "Intelligent Systems & Agent Architect",
    "B.Tech Computer Science (AI/ML)"
  ];

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    roleElement.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 65;
  const deletingSpeed = 35;
  const holdDelay = 2200;

  function typeRole() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      roleElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      roleElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = holdDelay;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    setTimeout(typeRole, delay);
  }

  typeRole();
}

/* ==========================================================================
   3. Scroll-Triggered Reveals
   ========================================================================== */
function initScrollReveals() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    reveals.forEach((el) => el.classList.add("revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   4. Circular Skill Progress Rings
   ========================================================================== */
function initSkillRings() {
  const skillCards = document.querySelectorAll(".skill-card");
  if (!skillCards.length) return;

  const circumference = 2 * Math.PI * 38; // r = 38 => ~238.76

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ringObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const progressRing = card.querySelector(".skill-ring-progress");
          const percentLabel = card.querySelector(".skill-ring-value");
          const targetPercent = parseInt(progressRing?.getAttribute("data-target") || "0", 10);

          if (progressRing) {
            const offset = circumference - (circumference * targetPercent) / 100;
            progressRing.style.strokeDasharray = `${circumference}`;
            progressRing.style.strokeDashoffset = `${offset}`;
          }

          if (percentLabel) {
            if (prefersReducedMotion) {
              percentLabel.textContent = `${targetPercent}%`;
            } else {
              animateCounter(percentLabel, targetPercent, 1200);
            }
          }

          observer.unobserve(card);
        }
      });
    },
    {
      threshold: 0.25
    }
  );

  skillCards.forEach((card) => {
    const progressRing = card.querySelector(".skill-ring-progress");
    if (progressRing) {
      progressRing.style.strokeDasharray = `${circumference}`;
      progressRing.style.strokeDashoffset = `${circumference}`;
    }
    ringObserver.observe(card);
  });
}

function animateCounter(element, target, duration) {
  let start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.round(start + (target - start) * easeProgress);

    element.textContent = `${currentVal}%`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = `${target}%`;
    }
  }

  requestAnimationFrame(update);
}
