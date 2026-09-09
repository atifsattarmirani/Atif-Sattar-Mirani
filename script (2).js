// =========================
// Variables
// =========================
const deleteAllBtn = document.getElementById("deleteAllBtn");

const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priority");
const dueDateInput = document.getElementById("dueDate");
const addBtn = document.getElementById("addBtn");

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter");

const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");

const progress = document.getElementById("progress");
const progressText = document.getElementById("progressText");

const themeBtn = document.getElementById("themeBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// =========================
// Add Task
// =========================

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

function addTask() {

    const title = taskInput.value.trim();

    if (title === "") {
        alert("Please enter a task!");
        return;
    }

    const task = {
        id: Date.now(),
        title: title,
        priority: priorityInput.value,
        dueDate: dueDateInput.value,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    dueDateInput.value = "";
    priorityInput.value = "low";

    taskInput.focus();
}

// =========================
// Save Tasks
// =========================

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// =========================
// Render Tasks
// =========================

function renderTasks() {

    taskList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();

    let filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.title.toLowerCase().includes(searchText);

        let matchesFilter = true;

        if (currentFilter === "active") {
            matchesFilter = !task.completed;
        }

        if (currentFilter === "completed") {
            matchesFilter = task.completed;
        }

        return matchesSearch && matchesFilter;
    });

    if (filteredTasks.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }

    filteredTasks.forEach(task => {

        const taskElement = document.createElement("div");

        taskElement.className =
            `task ${task.completed ? "completed" : ""}`;

        taskElement.innerHTML = `
            <input
                type="checkbox"
                class="checkbox"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${task.id})"
            >

            <div class="task-content">

                <div class="task-title">
                    ${escapeHTML(task.title)}
                </div>

                <div class="task-info">

                    <span class="priority ${task.priority}">
                        ${getPriorityText(task.priority)}
                    </span>

                    ${
                        task.dueDate
                        ? `<span class="due-date">
                            📅 ${formatDate(task.dueDate)}
                           </span>`
                        : ""
                    }

                </div>

            </div>

            <div class="task-actions">

                <button
                    class="action-btn edit-btn"
                    onclick="editTask(${task.id})"
                    title="Edit"
                >
                    ✏️
                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteTask(${task.id})"
                    title="Delete"
                >
                    🗑️
                </button>

            </div>
        `;

        taskList.appendChild(taskElement);
    });

    updateStats();
}

// =========================
// Toggle Task
// =========================

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

// =========================
// Delete Task
// =========================

function deleteTask(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this task?");

    if (!confirmDelete) return;

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

// =========================
// Edit Task
// =========================

function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    const newTitle = prompt("Edit your task:", task.title);

    if (newTitle === null) return;

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === "") {
        alert("Task cannot be empty!");
        return;
    }

    task.title = trimmedTitle;

    saveTasks();
    renderTasks();
}

// =========================
// Search
// =========================

searchInput.addEventListener("input", renderTasks);

// =========================
// Filters
// =========================

filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        currentFilter = this.dataset.filter;

        renderTasks();
    });
});

// =========================
// Stats
// =========================

function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const active = total - completed;

    totalTasks.textContent = total;
    activeTasks.textContent = active;
    completedTasks.textContent = completed;

    let percentage = 0;

    if (total > 0) {
        percentage = Math.round((completed / total) * 100);
    }

    progress.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}%`;
}

// =========================
// Priority Text
// =========================

function getPriorityText(priority) {

    if (priority === "high") {
        return "🔴 High";
    }

    if (priority === "medium") {
        return "🟡 Medium";
    }

    return "🟢 Low";
}

// =========================
// Date Format
// =========================

function formatDate(date) {

    const dateObject = new Date(date + "T00:00:00");

    return dateObject.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

// =========================
// Security
// =========================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}

// =========================
// Dark Mode
// =========================

themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark");

    const isDark =
        document.body.classList.contains("dark");

    localStorage.setItem("darkMode", isDark);

    themeBtn.textContent =
        isDark ? "☀️" : "🌙";
});

// Load Dark Mode
if (localStorage.getItem("darkMode") === "true") {

    document.body.classList.add("dark");

    themeBtn.textContent = "☀️";
}

// =========================
// Initial Render
// =========================

renderTasks();
// Delete All Tasks

deleteAllBtn.addEventListener("click", deleteAllTasks);

function deleteAllTasks() {

    if (tasks.length === 0) {
        alert("There are no tasks to delete!");
        return;
    }

    const confirmDelete = confirm(
        "Are you sure you want to delete ALL tasks?"
    );

    if (!confirmDelete) {
        return;
    }

    tasks = [];

    saveTasks();
    renderTasks();
}
