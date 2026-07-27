/* ==========================================================================
   Login form validation
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const emailField = document.getElementById("loginEmail");
  const passwordField = document.getElementById("loginPassword");
  const successBox = document.getElementById("loginSuccess");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Password show / hide toggle
  document.querySelectorAll(".password-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const target = document.getElementById(btn.dataset.target);
      const isHidden = target.type === "password";
      target.type = isHidden ? "text" : "password";
      btn.textContent = isHidden ? "Hide" : "Show";
    });
  });

  function validateEmail() {
    const value = emailField.value.trim();
    const valid = emailPattern.test(value);
    emailField.classList.toggle("is-invalid", !valid);
    emailField.classList.toggle("is-valid", valid);
    return valid;
  }

  function validatePassword() {
    const value = passwordField.value;
    const valid = value.length >= 8;
    passwordField.classList.toggle("is-invalid", !valid);
    passwordField.classList.toggle("is-valid", valid);
    return valid;
  }

  emailField.addEventListener("input", validateEmail);
  emailField.addEventListener("blur", validateEmail);
  passwordField.addEventListener("input", validatePassword);
  passwordField.addEventListener("blur", validatePassword);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    successBox.classList.add("d-none");

    const emailValid = validateEmail();
    const passwordValid = validatePassword();

    if (!emailValid || !passwordValid) {
      return;
    }

    // Demo authentication against localStorage (falls back to seeded demo user)
    const email = emailField.value.trim().toLowerCase();
    const password = passwordField.value;
    const storedUsers = JSON.parse(localStorage.getItem("theMarginUsers") || "[]");
    const demoUser = { email: "demo@gmail.com", password: "demo123" };
    const allUsers = [demoUser, ...storedUsers];
    const match = allUsers.find(function (user) {
      return user.email.toLowerCase() === email && user.password === password;
    });

    if (!match) {
      passwordField.classList.add("is-invalid");
      passwordField.nextElementSibling.nextElementSibling.textContent =
        "Email or password is incorrect.";
      return;
    }

    successBox.classList.remove("d-none");
    form.reset();
    document
      .querySelectorAll(".form-control")
      .forEach(function (el) { el.classList.remove("is-valid", "is-invalid"); });

    if (document.getElementById("rememberMe").checked) {
      localStorage.setItem("theMarginRememberedEmail", email);
    }

    setTimeout(function () {
      window.location.href = "index.html";
    }, 1500);
  });
});
