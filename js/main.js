// Theme toggle
function toggleTheme() {
  document.body.classList.toggle("light-theme");

  const isLight = document.body.classList.contains("light-theme");

  // Change icon
  document.querySelector(".theme-toggle").textContent = 
    isLight ? "🌙" : "☀️";

  // Save preference
  localStorage.setItem("theme", isLight ? "light" : "dark");
}

// Load saved theme
window.onload = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
    document.querySelector(".theme-toggle").textContent = "🌙";
  }
};

// Typing effect
const text = " ML Enthusiast | Deep Diving in AI | Problem Solver";
let i = 0;

function typeEffect() {
  if (i < text.length) {
    document.getElementById("typing").innerHTML += text.charAt(i);
    i++;
    setTimeout(typeEffect, 80);
  }
}
typeEffect();

// Scroll animations
const fadeItems = document.querySelectorAll(".fade-up, .timeline-item");

window.addEventListener("scroll", () => {
  fadeItems.forEach(item => {
    if (item.getBoundingClientRect().top < window.innerHeight - 100) {
      item.classList.add("show");
    }
  });
});

// Skills animation
document.addEventListener("DOMContentLoaded", () => {
  const skills = document.querySelectorAll(".skill-fill");
  let animated = false;

  function animateSkills() {
    if (animated) return;

    skills.forEach(skill => {
      const target = skill.dataset.percent;
      let count = 0;

      const interval = setInterval(() => {
        if (count >= target) {
          clearInterval(interval);
        } else {
          count++;
          skill.style.width = count + "%";
          skill.innerText = count + "%";
        }
      }, 15);
    });

    animated = true;
  }

  window.addEventListener("scroll", () => {
    const section = document.getElementById("skills");
    if (section.getBoundingClientRect().top < window.innerHeight - 100) {
      animateSkills();
    }
  });
});

// Navbar scroll shadow
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar");
  nav.classList.toggle("scrolled", window.scrollY > 20);
});

// Mobile menu
function toggleMenu() {
  document.querySelector(".nav-links").classList.toggle("active");
}

// Active link highlight
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Reveal animation on scroll
const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
});

// Form handling & Mail response
function sendMessage(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const msg = document.getElementById("message").value;

  if (!name || !email || !msg) {
    alert("Please fill all fields");
    return;
  }

  emailjs.send(
    "service_n4g2mdg",       // your service ID
    "template_5tgs2tm",       // your template ID
    {
      name: name,
      email: email,
      message: msg,
    },
    "7aNbzIs6XhUuOYNLy"
  )
  .then(() => {
    alert("Message sent successfully ✅");
    document.querySelector(".contact-form").reset();
  })
  .catch((error) => {
    alert("Failed to send ❌");
    console.error("EmailJS Error:", error);
  });
}

// Footer
document.getElementById("year").textContent = new Date().getFullYear();

// Back to top button
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// ================= PROJECT MODAL LOGIC =================
function openModal(imageSrc, title, description) {
  const modal = document.getElementById('projectModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');

  if (modal && modalImg && modalTitle && modalDesc) {
    modalImg.src = imageSrc;
    modalTitle.textContent = title;
    modalDesc.textContent = description;
    
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
  }
}

function closeModal() {
  const modal = document.getElementById('projectModal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }
}

window.addEventListener('click', (event) => {
  const modal = document.getElementById('projectModal');
  if (event.target === modal) {
    closeModal();
  }
});
