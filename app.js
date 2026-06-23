// ==========================
// STATE
// ==========================

let todos = JSON.parse(localStorage.getItem("todos")) || [];

let currentFilter = "all";

// ==========================
// DOM ELEMENTS
// ==========================

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const filterButtons = document.querySelector(".filters");

// ==========================
// LOCAL STORAGE
// ==========================

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// ==========================
// CRUD OPERATIONS
// ==========================

// CREATE
function addTodo(text) {
  const todo = {
    id: Date.now(),
    text,
    completed: false
  };

  todos.push(todo);
  saveTodos();
  renderTodos();
}

// UPDATE
function editTodo(id) {
  const todo = todos.find(t => t.id === id);

  const newText = prompt("Edit task:", todo.text);

  if (newText && newText.trim()) {
    todo.text = newText.trim();
    saveTodos();
    renderTodos();
  }
}

// UPDATE STATUS
function toggleTodo(id) {
  todos = todos.map(todo =>
    todo.id === id
      ? { ...todo, completed: !todo.completed }
      : todo
  );

  saveTodos();
  renderTodos();
}

// DELETE
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);

  saveTodos();
  renderTodos();
}

// ==========================
// FILTERING
// ==========================

function getFilteredTodos() {
  switch (currentFilter) {
    case "active":
      return todos.filter(todo => !todo.completed);

    case "completed":
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
}

// ==========================
// RENDER UI
// ==========================

function renderTodos() {

  todoList.innerHTML = "";

  const filteredTodos = getFilteredTodos();

  filteredTodos.forEach(todo => {

    const li = document.createElement("li");

    li.className = `todo-item ${
      todo.completed ? "completed" : ""
    }`;

    li.dataset.id = todo.id;

    li.innerHTML = `
      <span class="todo-text">${todo.text}</span>

      <div class="actions">
        <button class="toggle-btn">
          ${todo.completed ? "Undo" : "Done"}
        </button>

        <button class="edit-btn">
          Edit
        </button>

        <button class="delete-btn">
          Delete
        </button>
      </div>
    `;

    todoList.appendChild(li);
  });
}

// ==========================
// EVENT HANDLING
// ==========================

// CREATE
form.addEventListener("submit", e => {
  e.preventDefault();

  const text = input.value.trim();

  if (!text) return;

  addTodo(text);

  input.value = "";
});

// EVENT DELEGATION
todoList.addEventListener("click", e => {

  const li = e.target.closest(".todo-item");

  if (!li) return;

  const id = Number(li.dataset.id);

  if (e.target.classList.contains("toggle-btn")) {
    toggleTodo(id);
  }

  if (e.target.classList.contains("edit-btn")) {
    editTodo(id);
  }

  if (e.target.classList.contains("delete-btn")) {
    deleteTodo(id);
  }
});

// FILTERS
filterButtons.addEventListener("click", e => {

  if (!e.target.dataset.filter) return;

  currentFilter = e.target.dataset.filter;

  document
    .querySelectorAll(".filters button")
    .forEach(btn => btn.classList.remove("active"));

  e.target.classList.add("active");

  renderTodos();
});

// ==========================
// INITIAL RENDER
// ==========================

renderTodos();