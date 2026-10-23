const supabaseClient = window.supabase.createClient(
  "https://gydjbpcvjjhndecrdnmc.supabase.co",
  "sb_publishable_teUydYcRK49zKsjLFId5Dg_3r81IJNJ",
);

const loginForm = document.querySelector("#login-form");
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");
const loginMessage = document.querySelector("#login-message");
const loginButton = loginForm.querySelector(".login-button");

// Validate the form before sending the signup request.
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginMessage.textContent = "";
  loginMessage.classList.remove("is-error", "is-success", "password-mismatch");

  loginButton.disabled = true;
  loginButton.textContent = "Loging in...";

  try {
    // Ask Supabase to create the account with the entered email and password.
    const response = await supabaseClient.auth.signInWithPassword({
      email: emailInput.value.trim(),
      password: passwordInput.value,
    });

    if (response.error) {
      loginMessage.textContent = response.error.message;
      loginMessage.classList.add("is-error");
      return;
    }

    loginForm.reset();
    if (response.data.user) {
      window.location.href = "../pages/home.html";
    }
  } catch (error) {
    loginMessage.textContent =
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.";
    loginMessage.classList.add("is-error");
  } finally {
    loginButton.textContent = "Log In";
    loginButton.disabled = false;
  }
});
