// js/login.js
// This script sends the entered email/password to a serverless endpoint for verification.
// The endpoint should compare the values against secure environment variables and return
// { authorized: true } on success.

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorMsg = document.getElementById("errorMsg");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    try {
      let authorized = false;

      if (isLocal) {
        // LOCAL FALLBACK: Try to fetch from local-auth.json (ignored by git)
        try {
          const localRes = await fetch("js/local-auth.json");
          if (localRes.ok) {
            const localData = await localRes.json();
            authorized =
              email === localData.email && password === localData.password;
          }
        } catch (localErr) {
          console.log("Local auth file not found or failed, trying API...");
        }
      }

      // If not local or local check didn't pass, try the serverless API
      if (!authorized) {
        const response = await fetch("/api/verifyLogin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          authorized = data.authorized;
        }
      }

      if (authorized) {
        localStorage.setItem("mcvid_admin_auth", "true");
        window.location.href = "admin.html";
      } else {
        errorMsg.style.display = "block";
        passwordInput.value = "";
        passwordInput.focus();
        setTimeout(() => (errorMsg.style.display = "none"), 3000);
      }
    } catch (err) {
      console.error("Login verification failed", err);
      // Last ditch effort: if API failed entirely and we are on localhost, show error
      errorMsg.style.display = "block";
    }
  });

  // Clear auth on load if it was just a logout request
  if (window.location.search.includes("logout")) {
    localStorage.removeItem("mcvid_admin_auth");
  }
});
