/**
 * AI ENGINEER TERMINAL / CYBERCORE - MAIN CONTROLLER
 * Author: Anuj Wagmore
 */

document.addEventListener("DOMContentLoaded", () => {
  initNeuralBackground();
  initFullscreenIntro();
  initNavbar();
  initTypingEffect();
  initScrollReveals();
  initSkillBars();
  initTelemetryClock();
  initBackToTop();
});

/* ==========================================================================
   NAVBAR & MOBILE MENU
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector(".cyber-navbar");
  const mobileBtn = document.querySelector(".mobile-toggle");
  const navLinks = document.querySelector(".nav-links");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }
  });

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      navLinks.classList.toggle("active");
    });

    // Close on link click
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !mobileBtn.contains(e.target)) {
        navLinks.classList.remove("active");
      }
    });
  }

  // Active section spy
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        links.forEach(l => {
          l.classList.remove("active");
          if (l.getAttribute("href") === `#${sectionId}` || l.getAttribute("href")?.includes(`#${sectionId}`)) {
            l.classList.add("active");
          }
        });
      }
    });
  });
}

/* ==========================================================================
   TERMINAL TYPING SIMULATION (AI ENGINEER FOCUS)
   ========================================================================== */
function initTypingEffect() {
  const typingElement = document.getElementById("typing-text");
  if (!typingElement) return;

  const roles = [
    "AI & Machine Learning Engineer",
    "Local LLM & Neural Model Developer",
    "Deep Learning & NLP Specialist",
    "Intelligent Systems & Agent Architect",
    "B.Tech Computer Science (AI/ML)"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeLoop() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2000; // Pause at completion
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500;
    }

    setTimeout(typeLoop, typingSpeed);
  }

  typeLoop();
}

/* ==========================================================================
   SCROLL REVEALS
   ========================================================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll(".reveal-node, .reveal-left, .reveal-right");

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   SKILLS PROFICIENCY ANIMATOR
   ========================================================================== */
function initSkillBars() {
  const skillNodes = document.querySelectorAll(".skill-terminal-node");
  if (!skillNodes.length) return;

  const skillsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fillBar = entry.target.querySelector(".skill-fill-bar");
        const percentText = entry.target.querySelector(".skill-percent-readout");
        const targetPercent = parseInt(fillBar.getAttribute("data-percent") || "0", 10);

        if (fillBar) {
          fillBar.style.width = `${targetPercent}%`;
        }

        if (percentText) {
          let count = 0;
          const stepTime = Math.max(10, Math.floor(1200 / targetPercent));
          const timer = setInterval(() => {
            if (count >= targetPercent) {
              percentText.textContent = `[${targetPercent}%]`;
              clearInterval(timer);
            } else {
              count++;
              percentText.textContent = `[${count}%]`;
            }
          }, stepTime);
        }

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  skillNodes.forEach(node => skillsObserver.observe(node));
}


/* ==========================================================================
   TELEMETRY CLOCK & HUD STATUS
   ========================================================================== */
function initTelemetryClock() {
  const clockEl = document.getElementById("telemetry-clock");
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const utc = now.toUTCString().split(" ")[4] + " UTC";
    clockEl.textContent = utc;
  }
  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   BACK TO TOP
   ========================================================================== */
function initBackToTop() {
  const backBtn = document.getElementById("backToTop");
  if (!backBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backBtn.style.display = "flex";
    } else {
      backBtn.style.display = "none";
    }
  });

  backBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ==========================================================================
   FULLSCREEN INTRO VIDEO SEQUENCE
   ========================================================================== */
function initFullscreenIntro() {
  const overlay = document.getElementById("fullscreenIntroOverlay");
  const video = document.getElementById("introVideo");
  const skipBtn = document.getElementById("skipIntroBtn");
  const audioToggle = document.getElementById("introAudioToggle");
  const audioIcon = document.getElementById("introAudioIcon");
  const audioText = document.getElementById("introAudioText");
  const startPrompt = document.getElementById("introStartPrompt");
  const startBtn = document.getElementById("introStartBtn");
  const progressBar = document.getElementById("introProgressBar");

  if (!overlay || !video) return;

  // Lock body scroll during intro video
  document.body.style.overflow = "hidden";

  function exitIntro() {
    overlay.classList.add("hidden");
    video.pause();
    document.body.style.overflow = "auto";
  }

  // Skip button event
  if (skipBtn) {
    skipBtn.addEventListener("click", exitIntro);
  }

  // Auto exit when video ends
  video.addEventListener("ended", exitIntro);

  // Keyboard shortcut to skip (Escape or Space)
  window.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("hidden")) {
      if (e.key === "Escape" || e.key === " ") {
        exitIntro();
      }
    }
  });

  // Progress Bar update
  video.addEventListener("timeupdate", () => {
    if (progressBar && video.duration) {
      const pct = (video.currentTime / video.duration) * 100;
      progressBar.style.width = `${pct}%`;
    }
  });

  // Audio Toggle
  let isMuted = false;
  video.muted = isMuted;

  if (audioToggle) {
    audioToggle.addEventListener("click", () => {
      isMuted = !isMuted;
      video.muted = isMuted;
      if (audioIcon) {
        audioIcon.className = isMuted ? "fa-solid fa-volume-xmark" : "fa-solid fa-volume-high";
      }
      if (audioText) {
        audioText.textContent = isMuted ? "SOUND: OFF" : "SOUND: ON";
      }
    });
  }

  // Attempt autoplay
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Browser blocked unmuted autoplay; show interaction overlay
      if (startPrompt) {
        startPrompt.classList.add("active");
      }
    });
  }

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      if (startPrompt) startPrompt.classList.remove("active");
      video.muted = false;
      video.play().catch(() => {});
    });
  }

  // Global replay trigger
  window.replayIntro = function() {
    overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    video.currentTime = 0;
    if (progressBar) progressBar.style.width = "0%";
    video.play().catch(() => {
      if (startPrompt) startPrompt.classList.add("active");
    });
  };
}

/* ==========================================================================
   NEURAL NETWORK & STARS CANVAS ENGINE
   ========================================================================== */
function initNeuralBackground() {
  const canvas = document.getElementById("neuralCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height;
  let animationFrameId;

  // Resize canvas cleanly
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Configuration
  const isMobile = window.innerWidth < 768;
  const nodeCount = isMobile ? 35 : 65;
  const starCount = isMobile ? 40 : 85;
  const maxDistance = isMobile ? 100 : 135;

  // Generate Neural Nodes
  const nodes = [];
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2 + 1.2,
      color: Math.random() > 0.35 ? "#00f0ff" : "#00ff66"
    });
  }

  // Generate Twinkling Stars
  const stars = [];
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.2 + 0.4,
      alpha: Math.random() * 0.7 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1
    });
  }

  // Mouse interactivity
  let mouse = { x: null, y: null, radius: 120 };
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Twinkling Stars
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      star.alpha += star.twinkleSpeed * star.direction;
      if (star.alpha > 0.9) {
        star.alpha = 0.9;
        star.direction = -1;
      } else if (star.alpha < 0.15) {
        star.alpha = 0.15;
        star.direction = 1;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(224, 240, 255, ${star.alpha})`;
      ctx.shadowBlur = 4;
      ctx.shadowColor = "#00f0ff";
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // 2. Draw Neural Synapses (Connecting Lines)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.22;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }
      }
    }

    // 3. Connect to Mouse if near
    if (mouse.x !== null && mouse.y !== null) {
      for (let i = 0; i < nodes.length; i++) {
        const dx = mouse.x - nodes[i].x;
        const dy = mouse.y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const alpha = (1 - dist / mouse.radius) * 0.35;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 255, 102, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // 4. Update & Draw Neural Nodes
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      node.x += node.vx;
      node.y += node.vy;

      // Bounce off boundaries
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = node.color;
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();
}


