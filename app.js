// oWo5EKxQ8KYbQguO;
const input = document.querySelector("#input");
const buttonAdd = document.querySelector("#button-add");
const output = document.querySelector("#output");
const searchInput = document.querySelector("#search-input");
const searchForm = document.querySelector("#search-form");
const supabaseClient = supabase.createClient(
  "https://gydjbpcvjjhndecrdnmc.supabase.co",
  "sb_publishable_teUydYcRK49zKsjLFId5Dg_3r81IJNJ",
);

let editId = null;
let latestRequest = 0;

const sendData = async (event) => {
  event.preventDefault();

  const todo = input.value;

  if (editId !== null) {
    const { data, error } = await supabaseClient
      .from("todo")
      .update({ todo })
      .eq("id", editId);

    if (error) {
      console.log(error.message);
    }

    editId = null;
  } else {
    if (input.value === "") return;
    const response = await supabaseClient.from("todo").insert({ todo });
  }
  getData();
};
const renderTodos = (todos, emptyMessage) => {
  output.innerHTML = "";

  if (todos.length === 0) {
    output.innerHTML = `<li>${emptyMessage}</li>`;
    return;
  }

  for (let i = 0; i < todos.length; i++) {
    output.innerHTML += `<li>${todos[i].todo}<button onclick = "deleteTodo(${todos[i].id})">Delete</button><button onclick = "updateTodo(${todos[i].id})">Update</button></li>`;
  }
};

const getData = async (searchTerm = "") => {
  let requestId = ++latestRequest;
  let searchValue = searchTerm.trim();

  let response = supabaseClient.from("todo").select("*");
  if (searchValue) {
    response = response.ilike("todo", `%${searchValue}%`);
  }

  const { data, error } = await response;
  if (requestId !== latestRequest) return;

  renderTodos(
    data || [],
    searchValue ? "No Matching Task Found" : "No Task Added Yet"
  );
  if(!searchValue){
    input.value = ""
  }
};

const deleteTodo = async (id) => {
  const response = await supabaseClient.from("todo").delete().eq("id", id);
  getData();
};
const updateTodo = async (id) => {
  const { data } = await supabaseClient.from("todo").select().eq("id", id);

  input.value = data[0].todo;

  editId = id;
  buttonAdd.textContent = "Saves Changes";
};
getData();
searchForm.addEventListener("submit", (event) => event.preventDefault());
searchInput.addEventListener("input", () => {
  getData(searchInput.value);
});
