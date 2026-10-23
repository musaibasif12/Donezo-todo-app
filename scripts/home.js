const supabaseClient = supabase.createClient(
  "https://gydjbpcvjjhndecrdnmc.supabase.co",
  "sb_publishable_teUydYcRK49zKsjLFId5Dg_3r81IJNJ",
);

const routeUser = async () => {
  const response = await supabaseClient.auth.getUser();
  if (!response.data.user) {
    window.location.href = "../pages/login.html";
  }
};
routeUser();
// oWo5EKxQ8KYbQguO;
const input = document.querySelector("#input");
const buttonAdd = document.querySelector("#button-add");
const output = document.querySelector("#output");
const searchInput = document.querySelector("#search-input");
const searchForm = document.querySelector("#search-form");
const completed = document.querySelector("#completed");
// const homeLink = document.querySelector("#home-link");
// const taskLink = document.querySelector("#task-link");
// const focusLink = document.querySelector("#focus-mode-link");
// const insightsLink = document.querySelector("#insights-link");
// const allLink = document.querySelectorAll(".nav-link");

let editId = null; // Update Ka function isko change krdega jis todo ko change krna h uski id idahr aygi
let latestRequest = 0; // isko searching mei duplicates display krne se rokne keleye banaya h humein latest request ko show krna h bs

const sendData = async (event) => {
  event.preventDefault();

  const todo = input.value;

  if (editId !== null) {
    // agar update krna h tou editId me todo ki id ajayegi e.g editId = 1
    const { data, error } = await supabaseClient
      .from("todo")
      .update({ todo })
      .eq("id", editId);

    if (error) {
      console.log(error.message);
    }

    editId = null;
  } else {
    if (input.value === "") return; // check krega agr input khali h tou return krdega function ko
    const { data, error } = await supabaseClient.from("todo").insert({ todo }); //yeh new todo add kargea
    if (error) {
      console.log(error.message);
    }
  }
  getData(); //screen par display karega todo ko
};

const renderTodos = (todos, emptyMessage) => {
  output.innerHTML = "";

  if (todos.length === 0) {
    output.innerHTML = `<li class="empty-message">${emptyMessage}</li>`;
    return;
  }
  for (let i = 0; i < todos.length; i++) {
    output.innerHTML += `<li><input type="checkbox" id="completed" class= "todo-checkbox"> ${todos[i].todo}<button onclick = "deleteTodo(${todos[i].id})">Delete</button><button onclick = "updateTodo(${todos[i].id})">Update</button></li>`;
  }
};

const getData = async (searchTerm = "") => {
  let requestId = ++latestRequest;
  let searchValue = searchTerm.trim();

  let response = supabaseClient.from("todo").select("*"); // todo mei sb ko select kargea
  if (searchValue) {
    response = response.ilike("todo", `%${searchValue}%`); // search karega % ----- % se jitne bhi relative todos honge sare le ayega
  }

  const { data, error } = await response; // response obj ke destructure kra h
  if (requestId !== latestRequest) return;

  renderTodos(
    data || [],
    searchValue ? "No Matching Task Found" : "No Task Added Yet", // agar data h to wo pass hoga nahi tou khali array []
  );
  if (!searchValue) {
    input.value = "";
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
