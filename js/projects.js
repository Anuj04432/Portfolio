/**
 * AI ENGINEER TERMINAL / CYBERCORE - PROJECTS & HANGING CARDS MODULE
 * Author: Anuj Wagmore
 */

document.addEventListener("DOMContentLoaded", () => {
  initHangingPhysics();
  initCardGalleries();
  initProjectFilters();
  initProjectModal();
});

/* ==========================================================================
   HANGING SUSPENSION & PENDULUM INTERACTION
   ========================================================================== */
function initHangingPhysics() {
  const cardWrappers = document.querySelectorAll(".hanging-card-wrapper");

  cardWrappers.forEach((wrapper) => {
    // Mouse enter swing impulse
    wrapper.addEventListener("mouseenter", () => {
      wrapper.classList.remove("swing-active");
      void wrapper.offsetWidth; // Trigger reflow
      wrapper.classList.add("swing-active");
    });

    // 3D Perspective Tilt on Mouse Move
    wrapper.addEventListener("mousemove", (e) => {
      const card = wrapper.querySelector(".hanging-card");
      if (!card) return;

      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateY = (x / (rect.width / 2)) * 6; // Max 6deg
      const rotateX = -(y / (rect.height / 2)) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    wrapper.addEventListener("mouseleave", () => {
      const card = wrapper.querySelector(".hanging-card");
      if (card) {
        card.style.transform = "";
      }
    });
  });
}

/* ==========================================================================
   MULTI-IMAGE SCROLLABLE & SWIPEABLE GALLERIES INSIDE CARDS
   ========================================================================== */
function initCardGalleries() {
  const galleryContainers = document.querySelectorAll(".card-gallery-wrapper");

  galleryContainers.forEach((container) => {
    const track = container.querySelector(".gallery-track");
    const slides = container.querySelectorAll(".gallery-slide");
    const prevBtn = container.querySelector(".gallery-btn.prev");
    const nextBtn = container.querySelector(".gallery-btn.next");
    const dots = container.querySelectorAll(".gallery-dot");

    if (!track || slides.length <= 1) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentIndex = index;

      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Update dots
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        goToSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        goToSlide(currentIndex + 1);
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        goToSlide(idx);
      });
    });

    // Touch Swipe Support
    let startX = 0;
    let endX = 0;

    container.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    container.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;

      if (Math.abs(diffX) > 40) {
        if (diffX > 0) {
          goToSlide(currentIndex + 1); // Swipe left
        } else {
          goToSlide(currentIndex - 1); // Swipe right
        }
      }
    }, { passive: true });
  });
}

/* ==========================================================================
   PROJECT CATEGORY FILTERS
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll(".filter-tag-btn");
  const projectCards = document.querySelectorAll(".hanging-card-wrapper");

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      projectCards.forEach(card => {
        const category = card.getAttribute("data-category") || "";
        if (filterValue === "all" || category.includes(filterValue)) {
          card.style.display = "block";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 10);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.95)";
          setTimeout(() => {
            card.style.display = "none";
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   PROJECT MODAL / DEEP DIVE INSPECTOR
   ========================================================================== */
function initProjectModal() {
  const modal = document.getElementById("projectModal");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalTech = document.getElementById("modalTech");
  const modalLive = document.getElementById("modalLive");
  const modalGit = document.getElementById("modalGit");
  const closeBtn = document.getElementById("closeProjectModal");

  if (!modal) return;

  window.openProjectModal = function(title, desc, imgSrc, techArray = [], liveUrl = "", gitUrl = "") {
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc;
    if (modalImg) {
      modalImg.src = imgSrc || "images/chatbot.png";
      modalImg.alt = title;
    }

    if (modalTech) {
      modalTech.innerHTML = techArray.map(t => `<span class="tech-badge">${t}</span>`).join("");
    }

    if (modalLive) {
      if (liveUrl && liveUrl !== "#" && liveUrl !== "") {
        modalLive.href = liveUrl;
        modalLive.style.display = "inline-flex";
      } else {
        modalLive.style.display = "none";
      }
    }

    if (modalGit) {
      if (gitUrl && gitUrl !== "#" && gitUrl !== "") {
        modalGit.href = gitUrl;
        modalGit.style.display = "inline-flex";
      } else {
        modalGit.style.display = "none";
      }
    }

    modal.classList.add("active");
  };

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
}
