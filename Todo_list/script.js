let currentUser = localStorage.getItem("user");
let tasks = [];

const taskList = document.getElementById("taskList");
const profileUsername = document.getElementById("profileUsername");


function login() {
  const u = document.getElementById("username").value.trim();
  if (!u) return alert("Enter username");
  localStorage.setItem("user", u);
  loadUser();
}

function loadUser() {
  currentUser = localStorage.getItem("user");
  if (currentUser) {
    document.getElementById("loginBox").classList.add("d-none");
    document.getElementById("app").classList.remove("d-none");
    profileUsername.textContent = currentUser;
    tasks = JSON.parse(localStorage.getItem("tasks_" + currentUser)) || [];
    renderTasks();
  }
}
loadUser();

function save() {
  localStorage.setItem("tasks_" + currentUser, JSON.stringify(tasks));
}


function addTask() {
  const text = taskText.value.trim();
  if (!text) return alert("Enter task");

  tasks.push({
    id: Date.now(),
    text,
    date: taskDate.value,
    category: taskCategory.value,
    priority: taskPriority.value,
    completed: false,
  });

  taskText.value = "";
  taskDate.value = "";
  save();
  renderTasks();
}


function renderTasks() {
  taskList.innerHTML = "";
  const filter = filterCategory.value;

  const filtered = tasks.filter(
    (t) => filter === "All" || t.category === filter
  );

  if (filtered.length === 0) {
    taskList.innerHTML = `<div class="empty">📭 No tasks yet</div>`;
    return;
  }

  filtered.forEach((t, index) => {
    const div = document.createElement("div");
    div.className = "task";
    div.draggable = true;
    div.dataset.index = index;

    div.innerHTML = `
      <div>
        <input type="checkbox" ${
          t.completed ? "checked" : ""
        } onclick="toggle(${t.id})">
        <span class="${t.completed ? "completed" : ""} fw-semibold ms-2">${
      t.text
    }</span>
        <div class="small text-secondary">${t.date || ""}</div>
        <span class="badge bg-secondary me-1">${t.category}</span>
        <span class="badge badge-${t.priority.toLowerCase()}">${
      t.priority
    }</span>
      </div>
      <div>
        <button class="btn btn-sm btn-outline-warning" onclick="editTask(${
          t.id
        })">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="del(${t.id})">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;
    addDrag(div);
    taskList.appendChild(div);
  });
}

let dragIndex;
function addDrag(el) {
  el.ondragstart = () => (dragIndex = el.dataset.index);
  el.ondragover = (e) => e.preventDefault();
  el.ondrop = () => {
    const dropIndex = el.dataset.index;
    const temp = tasks[dragIndex];
    tasks.splice(dragIndex, 1);
    tasks.splice(dropIndex, 0, temp);
    save();
    renderTasks();
  };
}


function toggle(id) {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  save();
  renderTasks();
}

function del(id) {
  tasks = tasks.filter((t) => t.id !== id);
  save();
  renderTasks();
}

function editTask(id) {
  const t = tasks.find((x) => x.id === id);
  const txt = prompt("Edit Task", t.text);
  if (txt) {
    t.text = txt;
    save();
    renderTasks();
  }
}
