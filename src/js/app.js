const draggables = document.querySelectorAll(".task");
const droppables = document.querySelectorAll(".tasklist");
const closeBtns = document.querySelectorAll(".close");

function delAllTasks() {
  draggables.forEach((task) => {
    task.remove();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const json = localStorage.getItem("formData");
  if (!json) return;
  delAllTasks();
  let formData;
  try {
    formData = JSON.parse(json);
    formData.forEach((table) => {
      table.forEach((task) => {
        createTask(task, formData.indexOf(table));
      });
    });
  } catch (error) {
    console.log(error);
  }
});

const dragstart = (e) => {
  e.target.classList.add("is-dragging");
};

const dragend = (e) => {
  e.target.classList.remove("is-dragging");
};

const deleteTask = (e) => {
  e.target.parentElement.remove();
};

draggables.forEach((task) => {
  task.addEventListener("dragstart", dragstart);
  task.addEventListener("dragend", dragend);
});

droppables.forEach((zone) => {
  zone.addEventListener("dragover", (e) => {
    e.preventDefault();

    const bottomTask = insertAboveTask(zone, e.clientY);
    const curTask = document.querySelector(".is-dragging");

    if (!bottomTask) {
      zone.appendChild(curTask);
    } else {
      zone.insertBefore(curTask, bottomTask);
    }
  });
});

closeBtns.forEach((btn) => {
  btn.addEventListener("click", deleteTask);
});

const insertAboveTask = (zone, mouseY) => {
  const els = zone.querySelectorAll(".task:not(.is-dragging)");

  let closestTask = null;
  let closestOffset = Number.NEGATIVE_INFINITY;

  els.forEach((task) => {
    const { top } = task.getBoundingClientRect();

    const offset = mouseY - top;

    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;
      closestTask = task;
    }
  });

  return closestTask;
};

const addtask = document.querySelector(".addtask");
const addBtn = document.querySelector(".add-btn");
const cnlBtn = document.querySelector(".cancel-btn");
const textarea = document.querySelector(".textarea");
const form = document.querySelector(".todo-form");

let value;

const hideForm = () => {
  textarea.value = "";
  value = "";
  form.style.display = "none";
  addtask.style.display = "flex";
};

addtask.addEventListener("click", () => {
  form.style.display = "block";
  addBtn.style.display = "none";
  addtask.style.display = "none";
});

textarea.addEventListener("input", (e) => {
  value = e.target.value;
  if (value) {
    addBtn.style.display = "block";
  } else {
    addBtn.style.display = "none";
  }
});

cnlBtn.addEventListener("click", hideForm);

const createTask = (textContent, table = 0) => {
  const newTask = document.createElement("DIV");
  newTask.classList.add("task");
  newTask.draggable = true;
  newTask.textContent = textContent;
  droppables[table].append(newTask);
  newTask.addEventListener("dragstart", dragstart);
  newTask.addEventListener("dragend", dragend);

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.textContent = "x";
  closeBtn.classList.add("close");
  newTask.appendChild(closeBtn);
  closeBtn.addEventListener("click", deleteTask);
};

addBtn.addEventListener("click", () => {
  createTask(value);
  hideForm();
});

window.addEventListener("beforeunload", () => {
  let formData = [];

  droppables.forEach((table) => {
    const tasksTable = table.querySelectorAll(".task");
    let tasks = [];
    tasksTable.forEach((task) => {
      tasks.push(task.textContent.substring(0, task.textContent.length - 1));
    });
    formData.push(tasks);
  });
  localStorage.setItem("formData", JSON.stringify(formData));
});
