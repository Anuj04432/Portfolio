/**
 * ANUJ WAGMORE - PROJECTS MODULE
 * Handles category filtering, multi-image galleries, and glass modal interactions.
 */

document.addEventListener("DOMContentLoaded", () => {
  initProjectFilters();
  initCardGalleries();
  initProjectModal();
});

/* ==========================================================================
   1. Category Filtering
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll(".filter-tab-btn");
  const projectCards = document.querySelectorAll(".project-card-item");

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter") || "all";

      projectCards.forEach((card) => {
        const categories = (card.getAttribute("data-category") || "").split(" ");
        const isMatch = filter === "all" || categories.includes(filter);

        if (isMatch) {
          card.style.display = "flex";
          requestAnimationFrame(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          });
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.95)";
          setTimeout(() => {
            if (!isMatch) {
              card.style.display = "none";
            }
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   2. Multi-Image Galleries inside Cards
   ========================================================================== */
function initCardGalleries() {
  const galleries = document.querySelectorAll(".gallery-container");

  galleries.forEach((gallery) => {
    const track = gallery.querySelector(".gallery-track");
    const slides = gallery.querySelectorAll(".gallery-slide");
    const prevBtn = gallery.querySelector(".gallery-btn.prev");
    const nextBtn = gallery.querySelector(".gallery-btn.next");
    const dots = gallery.querySelectorAll(".gallery-dot");

    if (!track || slides.length <= 1) return;

    let currentIndex = 0;
    const total = slides.length;

    function goToSlide(index) {
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;
      currentIndex = index;

      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === currentIndex);
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

    gallery.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
      },
      { passive: true }
    );

    gallery.addEventListener(
      "touchend",
      (e) => {
        endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;

        if (Math.abs(diffX) > 40) {
          if (diffX > 0) {
            goToSlide(currentIndex + 1);
          } else {
            goToSlide(currentIndex - 1);
          }
        }
      },
      { passive: true }
    );
  });
}

/* ==========================================================================
   3. Project Detail Modal
   ========================================================================== */
function initProjectModal() {
  const modal = document.getElementById("projectModal");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalCategory = document.getElementById("modalCategory");
  const modalDesc = document.getElementById("modalDesc");
  const modalTags = document.getElementById("modalTags");
  const modalLive = document.getElementById("modalLive");
  const modalGit = document.getElementById("modalGit");
  const closeBtn = document.getElementById("closeProjectModal");

  if (!modal) return;

  window.openProjectModal = function (title, category, desc, imgSrc, techArray = [], liveUrl = "", gitUrl = "") {
    if (modalTitle) modalTitle.textContent = title;
    if (modalCategory) modalCategory.textContent = category;
    if (modalDesc) modalDesc.textContent = desc;

    if (modalImg) {
      modalImg.src = imgSrc || "images/chatbot.png";
      modalImg.alt = title;
    }

    if (modalTags) {
      modalTags.innerHTML = techArray
        .map((tag) => `<span class="tag-pill">${tag}</span>`)
        .join("");
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
    document.body.style.overflow = "hidden";
  };

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
}
