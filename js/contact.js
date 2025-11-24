document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let message = document.getElementById("message").value.trim();
  let status = document.getElementById("formStatus");

  // VALIDATION
  if (!name || !email || !message) {
    status.textContent = "All fields are required!";
    status.style.color = "red";
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    status.textContent = "Enter a valid email!";
    status.style.color = "red";
    return;
  }

  // SUCCESS
  status.textContent = "Message sent successfully!";
  status.style.color = "green";

  // RESET FORM
  document.getElementById("contactForm").reset();
});
