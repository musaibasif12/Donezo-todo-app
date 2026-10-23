const supabaseClient = window.supabase.createClient(
  "https://gydjbpcvjjhndecrdnmc.supabase.co",
  "sb_publishable_teUydYcRK49zKsjLFId5Dg_3r81IJNJ",
);

const routeUser = async () => {
  const { data, error } = await supabaseClient.auth.getUser();

  if (!data.user) {
    window.location.href = "./pages/login.html";
  } else {
    window.location.href = "./pages/home.html";
  }
};
routeUser();
