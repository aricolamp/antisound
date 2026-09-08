const form = document.getElementById("contact-form");
if (!form) throw new Error("Contact form not found");

const button = form.querySelector("button[type=submit]");
const status = form.querySelector(".form-status");
const picker = form.querySelector(".picker");
const pickerTrigger = form.querySelector(".picker-trigger");
const pickerValue = form.querySelector(".picker-value");
const pickerMenu = form.querySelector(".picker-menu");
const pickerNative = form.querySelector(".picker-native");

function closePicker() {
  if (!picker) return;
  picker.classList.remove("is-open");
  pickerMenu.hidden = true;
  pickerTrigger.setAttribute("aria-expanded", "false");
}

function openPicker() {
  picker.classList.add("is-open");
  pickerMenu.hidden = false;
  pickerTrigger.setAttribute("aria-expanded", "true");
}

if (picker) {
  pickerTrigger.addEventListener("click", () => {
    if (picker.classList.contains("is-open")) closePicker();
    else openPicker();
  });

  pickerMenu.querySelectorAll("[data-value]").forEach((option) => {
    option.addEventListener("click", () => {
      const value = option.dataset.value;
      pickerValue.textContent = value;
      pickerNative.value = value;
      pickerMenu.querySelectorAll("[data-value]").forEach((item) => {
        item.setAttribute("aria-selected", item === option ? "true" : "false");
      });
      closePicker();
    });
  });

  document.addEventListener("click", (event) => {
    if (!picker.contains(event.target)) closePicker();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePicker();
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const method = String(data.get("contact_method") || "Email").trim();
  const note = String(data.get("message") || "").trim();

  const details = [];
  if (phone) details.push(`Phone: ${phone}`);
  details.push(`Preferred contact: ${method}.`);

  const letter = [
    "Hi ANTI,",
    "",
    `${name} (${email}) just reached out from the site about a booking.`,
    "",
    ...details,
    "",
    note,
    "",
    "Reply directly to this email to continue the conversation.",
  ]
    .filter((line) => line !== null)
    .join("\n");

  button.disabled = true;
  button.textContent = "Sending…";
  status.hidden = true;

  try {
    const response = await fetch(
      "https://formsubmit.co/ajax/bookantisound@gmail.com",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          _replyto: email,
          _subject: `Booking inquiry from ${name}`,
          _template: "basic",
          _captcha: "false",
          message: letter,
        }),
      }
    );

    if (!response.ok) throw new Error("Send failed");

    form.reset();
    button.textContent = "Sent";
    status.hidden = false;
    status.textContent = "Got it — I'll get back to you.";
  } catch {
    button.disabled = false;
    button.textContent = "Send";
    status.hidden = false;
    status.textContent = "Something went wrong. Try again, or email bookantisound@gmail.com.";
  }
});
