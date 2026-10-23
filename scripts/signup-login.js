const supabaseClient = window.supabase.createClient(
  "https://gydjbpcvjjhndecrdnmc.supabase.co",
  "sb_publishable_teUydYcRK49zKsjLFId5Dg_3r81IJNJ",
);
const signupForm = document.querySelector("#signup-form");
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");
const confirmPasswordInput = document.querySelector("#confirm-password-input");
const signupMessage = document.querySelector("#signup-message");
const signupButton = signupForm.querySelector("button");

// Show an alert and mark the confirmation field as incorrect.
const showPasswordMismatch = () => {
  signupMessage.textContent =
    "Passwords do not match. Please check and try again.";
  signupMessage.classList.remove("is-success");
  signupMessage.classList.add("is-error", "password-mismatch");
  confirmPasswordInput.classList.add("is-invalid");
  confirmPasswordInput.setAttribute("aria-invalid", "true");
}

// Remove the alert and red outline after the passwords match.
const clearPasswordMismatch = () => {
  signupMessage.textContent = "";
  signupMessage.classList.remove("is-error", "password-mismatch");
  confirmPasswordInput.classList.remove("is-invalid");
  confirmPasswordInput.removeAttribute("aria-invalid");
}
const checkPasswordMatch = () => {
  const pasword = passwordInput.value;
  const confirmPasword = confirmPasswordInput.value;

  if (confirmPasword === "") {
    clearPasswordMismatch();
    return;
  }

  if (pasword !== confirmPasword) {
    showPasswordMismatch();
    return;
  }
  clearPasswordMismatch();
};

// Update the feedback as the user types.
passwordInput.addEventListener("input", checkPasswordMatch);
confirmPasswordInput.addEventListener("input", checkPasswordMatch);

// Validate the form before sending the signup request.
signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  signupMessage.textContent = "";
  signupMessage.classList.remove("is-error", "is-success", "password-mismatch");
  confirmPasswordInput.classList.remove("is-invalid");
  confirmPasswordInput.removeAttribute("aria-invalid");

  if (passwordInput.value !== confirmPasswordInput.value) {
    showPasswordMismatch();
    confirmPasswordInput.focus();
    return;
  }

  signupButton.disabled = true;
  signupButton.textContent = "Creating account...";

  try {
    // Ask Supabase to create the account with the entered email and password.
    const { error } = await supabaseClient.auth.signUp({
      email: emailInput.value.trim(),
      password: passwordInput.value,
    });

    if (error) {
      signupMessage.textContent = error.message;
      signupMessage.classList.add("is-error");
      return;
    }

    signupMessage.textContent =
      "Account created. Check your email to confirm your account.";

    signupMessage.classList.add("is-success");
    signupForm.reset();
  } catch (error) {
    signupMessage.textContent =
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.";
    signupMessage.classList.add("is-error");
  } finally {
    signupButton.textContent = "Create Account";
    signupButton.disabled = false;
  }
});
