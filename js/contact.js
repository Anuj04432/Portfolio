/**
 * ANUJ WAGMORE - CONTACT MODULE
 * Integrates EmailJS form submission with real-time feedback and state management.
 */

document.addEventListener("DOMContentLoaded", () => {
  initContactForm();
});

function initContactForm() {
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("contactFeedback");
  const submitBtn = document.getElementById("contactSubmitBtn");

  if (!form || !feedback) return;

  // Initialize EmailJS with public key
  if (typeof emailjs !== "undefined") {
    try {
      emailjs.init("7aNbzIs6XhUuOYNLy");
    } catch (err) {
      console.warn("EmailJS init warning:", err);
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("contactName");
    const emailInput = document.getElementById("contactEmail");
    const messageInput = document.getElementById("contactMessage");

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const message = messageInput ? messageInput.value.trim() : "";

    if (!name || !email || !message) {
      showFeedback("Please complete all fields before sending.", "error");
      return;
    }

    // Set UI loading state
    const originalBtnContent = submitBtn ? submitBtn.innerHTML : "Send Message";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...`;
    }

    showFeedback("Sending your message...", "info");

    try {
      if (typeof emailjs === "undefined") {
        throw new Error("Email service is currently offline. Please email directly.");
      }

      await emailjs.send(
        "service_n4g2mdg",
        "template_5tgs2tm",
        {
          name: name,
          email: email,
          message: message,
          timestamp: new Date().toLocaleString()
        },
        "7aNbzIs6XhUuOYNLy"
      );

      showFeedback("Thank you! Your message has been sent successfully. I'll get back to you soon.", "success");
      form.reset();
    } catch (error) {
      console.error("EmailJS submission error:", error);
      showFeedback("Failed to send message. Please reach out directly to anujwagmore8@gmail.com", "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
      }
    }
  });

  function showFeedback(message, type) {
    feedback.className = `form-feedback active ${type}`;
    let iconClass = "fa-solid fa-circle-info";
    if (type === "success") iconClass = "fa-solid fa-circle-check";
    if (type === "error") iconClass = "fa-solid fa-triangle-exclamation";
    if (type === "info") iconClass = "fa-solid fa-circle-notch fa-spin";

    feedback.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;
  }
}
