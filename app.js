// oWo5EKxQ8KYbQguO;

const supabaseClient = supabase.createClient(
  "https://gydjbpcvjjhndecrdnmc.supabase.co",
  "sb_publishable_teUydYcRK49zKsjLFId5Dg_3r81IJNJ",
);
const sendData = async () => {
  const response = await supabaseClient.from("todo").insert({ todo: "Hello" });
  console.log(response.data);
  
}

sendData()
