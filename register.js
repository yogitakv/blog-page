/* ==========================================================================
   Registration form validation
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registerForm");
  const fullName = document.getElementById("fullName");
  const username = document.getElementById("username");
  const email = document.getElementById("regEmail");
  const phone = document.getElementById("phone");
  const password = document.getElementById("regPassword");
  const confirmPassword = document.getElementById("confirmPassword");
  const terms = document.getElementById("terms");
  const genderError = document.getElementById("genderError");
  const strengthBar = document.getElementById("strengthBar");
  const successBox = document.getElementById("registerSuccess");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[6-9]\d{9}$/; // 10 digits, valid mobile starting digit

  // Password show / hide toggles
  document.querySelectorAll(".password-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const target = document.getElementById(btn.dataset.target);
      const isHidden = target.type === "password";
      target.type = isHidden ? "text" : "password";
      btn.textContent = isHidden ? "Hide" : "Show";
    });
  });

  // Phone number: strip non-numeric characters as the user types
  phone.addEventListener("input", function () {
    phone.value = phone.value.replace(/\D/g, "").slice(0, 10);
    validatePhone();
  });

  function setState(field, valid) {
    field.classList.toggle("is-invalid", !valid);
    field.classList.toggle("is-valid", valid);
    return valid;
  }

  function validateFullName() {
    return setState(fullName, fullName.value.trim().length >= 3);
  }

  function validateUsername() {
    return setState(username, username.value.trim().length >= 4);
  }

  function validateEmail() {
    return setState(email, emailPattern.test(email.value.trim()));
  }

  function validatePhone() {
    return setState(phone, phonePattern.test(phone.value.trim()));
  }

  function passwordChecks(value) {
    return {
      length: value.length >= 8,
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~]/.test(value),
    };
  }

  function validatePassword() {
    const checks = passwordChecks(password.value);
    const passedCount = Object.values(checks).filter(Boolean).length;
    const allValid = Object.values(checks).every(Boolean);

    strengthBar.style.width = (passedCount / 5) * 100 + "%";
    strengthBar.style.background =
      passedCount <= 2 ? "var(--rust)" : passedCount <= 4 ? "var(--gold)" : "var(--teal)";

    return setState(password, allValid);
  }

  function validateConfirmPassword() {
    return setState(
      confirmPassword,
      confirmPassword.value.length > 0 && confirmPassword.value === password.value
    );
  }

  function validateGender() {
    const selected = document.querySelector('input[name="gender"]:checked');
    genderError.style.display = selected ? "none" : "block";
    return !!selected;
  }

  function validateTerms() {
    return setState(terms, terms.checked);
  }

  fullName.addEventListener("input", validateFullName);
  fullName.addEventListener("blur", validateFullName);
  username.addEventListener("input", validateUsername);
  username.addEventListener("blur", validateUsername);
  email.addEventListener("input", validateEmail);
  email.addEventListener("blur", validateEmail);
  phone.addEventListener("blur", validatePhone);
  password.addEventListener("input", function () {
    validatePassword();
    if (confirmPassword.value) validateConfirmPassword();
  });
  password.addEventListener("blur", validatePassword);
  confirmPassword.addEventListener("input", validateConfirmPassword);
  confirmPassword.addEventListener("blur", validateConfirmPassword);
  terms.addEventListener("change", validateTerms);
  document.querySelectorAll('input[name="gender"]').forEach(function (radio) {
    radio.addEventListener("change", validateGender);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    successBox.classList.add("d-none");

    const results = [
      validateFullName(),
      validateUsername(),
      validateEmail(),
      validatePhone(),
      validatePassword(),
      validateConfirmPassword(),
      validateGender(),
      validateTerms(),
    ];

    if (!results.every(Boolean)) {
      return;
    }

    // Persist the new user to localStorage (demo only — not secure storage)
    const users = JSON.parse(localStorage.getItem("theMarginUsers") || "[]");
    users.push({
      fullName: fullName.value.trim(),
      username: username.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      password: password.value,
      gender: document.querySelector('input[name="gender"]:checked').value,
    });
    localStorage.setItem("theMarginUsers", JSON.stringify(users));

    successBox.classList.remove("d-none");
    form.reset();
    strengthBar.style.width = "0%";
    document
      .querySelectorAll(".form-control")
      .forEach(function (el) { el.classList.remove("is-valid", "is-invalid"); });

    setTimeout(function () {
      window.location.href = "login.html";
    }, 1800);
  });
});
