/**
 * AI ENGINEER TERMINAL / CYBERCORE - CONTACT MODULE & CLI HOOK
 * Author: Anuj Wagmore
 */

document.addEventListener("DOMContentLoaded", () => {
  initContactTerminal();
});

function initContactTerminal() {
  const form = document.getElementById("cliContactForm");
  const consoleFeedback = document.getElementById("cliFeedbackConsole");
  const submitBtn = document.getElementById("cliSubmitBtn");

  if (!form || !consoleFeedback) return;

  // Initialize EmailJS public key
  if (typeof emailjs !== "undefined") {
    try {
      emailjs.init("7aNbzIs6XhUuOYNLy");
      logToConsole("COMMS_BUS initialized. Socket ready on port :443");
    } catch (err) {
      console.warn("EmailJS init note:", err);
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("cliName");
    const emailInput = document.getElementById("cliEmail");
    const messageInput = document.getElementById("cliMessage");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      logToConsole("Please fill in all fields (Name, Email, Message).", "error");
      return;
    }

    // UI Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> SENDING...`;
    }

    logToConsole(`Connecting to mail service...`);

    try {
      // Backend EmailJS call
      const response = await emailjs.send(
        "service_n4g2mdg",
        "template_5tgs2tm",
        {
          name: name,
          email: email,
          message: message,
          timestamp: new Date().toISOString()
        },
        "7aNbzIs6XhUuOYNLy"
      );

      console.log("EmailJS SUCCESS:", response);
      logToConsole(`Message sent successfully! Anuj will reply to you soon.`, "success");
      form.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      logToConsole(`Failed to send. Please reach out directly to anujwagmore8@gmail.com`, "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> [ SEND_MESSAGE ]`;
      }
    }
  });

  function logToConsole(message, statusClass = "") {
    const timestamp = new Date().toLocaleTimeString();
    consoleFeedback.className = "cli-console-feedback " + statusClass;
    consoleFeedback.innerHTML = `<span style="color: var(--neon-cyan); margin-right: 8px;">[${timestamp}]</span> <span>${message}</span>`;
  }
}
