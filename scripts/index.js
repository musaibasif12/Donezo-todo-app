const supabaseClient = window.supabase.createClient(
  "https://gydjbpcvjjhndecrdnmc.supabase.co",
  "sb_publishable_teUydYcRK49zKsjLFId5Dg_3r81IJNJ",
);

const status = document.querySelector('[role="status"]');

const routeUser = async () => {
  const { data, error } = await supabaseClient.auth.getUser();

  if (error) {
    console.error("Unable to check the current user:", error);
    status.textContent = "Unable to check your session. Please refresh and try again.";
    return;
  }

  window.location.href = data.user
    ? "./pages/home.html"
    : "./pages/login.html";
};

routeUser();
