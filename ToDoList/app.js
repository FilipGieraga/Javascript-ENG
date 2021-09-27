"use strict";
const addNew = document.querySelector(".add");
const createNew = document.querySelector(".createnew");
const allTasks = document.querySelector(".alltasks");
createNew.style.display = "none";
let data = 1;
let activeEdit = false;
if (localStorage.getItem("content")) {
  if (localStorage.getItem("content").trim()) {
    allTasks.insertAdjacentHTML("afterbegin", localStorage.getItem("content"));
    data = localStorage.getItem("dataAtr").trim();
  }
}
const container = document.querySelector(".container");
container.addEventListener("click", function (e) {
  e.preventDefault();
  const elem = e.target;
  console.log();
  if (elem.closest("div").classList.contains("add")) revealCreateForm();
  if (elem.value === "Add") taskAdded();
  if (elem.value === "Escape") hideCreateForm();
});

function taskDone(elem) {
  if (activeEdit) return;
  const currentTask = elem.closest(".listtask").getAttribute("data-task");
  const taskByData = document.querySelector(`[data-task='${currentTask}']`);
  const textContentH3 = taskByData.querySelector("h3");
  //   textContentH3.textContent = "sasd"
  if (!textContentH3.style.textDecoration) {
    textContentH3.style.textDecoration = "line-through";
  } else {
    textContentH3.style.textDecoration = "";
  }
  localStorage.setItem(`content`, allTasks.innerHTML);
}

allTasks.addEventListener("click", function (e) {
  const elem = e.target.closest(".btn");
  if (!elem) return;
  if (elem.classList.contains("complete")) taskDone(elem);
  if (elem.classList.contains("edit")) editTask(elem);
  if (elem.classList.contains("remove")) taskRemove(elem);
});

function taskRemove(elem) {
  if (activeEdit) return;
  const currentTask = elem.closest(".listtask").getAttribute("data-task");
  const taskByData = document.querySelector(`[data-task='${currentTask}']`);
  taskByData.remove();
  localStorage.setItem(`content`, allTasks.innerHTML);
}

function revealCreateForm() {
  addNew.style.display = "none";
  createNew.style.display = "";
  document.querySelector('input[type="newTask"]').focus();
}

function hideCreateForm() {
  createNew.reset();
  addNew.style.display = "";
  createNew.style.display = "none";
}

function taskAdded(e) {
  if (activeEdit) return;
  let inputVal = document.querySelector('input[type="newTask"]');

  if (!inputVal.value.trim()) {
    inputVal.value = "";
    return;
  }
  let toDo = inputVal.value.trim();
  const htmlToAddTask = `<div class="listtask" data-task="${data}">
        <div class="note"><h3>${toDo}</h3></div>
        <div class="icons">
          <button class="btn complete">
            <img src="./styles/tick.png" title="complete" width="20px" />
          </button>
          <button class="btn edit">
            <img src="./styles/edit.png" title="edit" width="20px" />
          </button>
          <button class="btn remove">
            <img src="./styles/delete.png" title="remove" width="20px" />
          </button>
        </div>
      </div>`;
  hideCreateForm();
  data++;
  allTasks.insertAdjacentHTML("afterbegin", htmlToAddTask);
  localStorage.setItem(`content`, allTasks.innerHTML);
  localStorage.setItem(`dataAtr`, data);
  // eventListenersForECR();
}

function editTask(elem) {
  if (!activeEdit) {
    activeEdit = true;
  } else {
    return;
  }
  const currentTask = elem.closest(".listtask").getAttribute("data-task");
  const taskByData = document.querySelector(`[data-task='${currentTask}']`);
  const notePart = taskByData.querySelector(".note");
  const textContentH3 = taskByData.querySelector("h3"); ///// added
  const iconsPart = taskByData.querySelector(".icons");
  const form = `<form class="edittask">
  <input type="newTask" placeholder="Changes are a part of life..." value="${textContentH3.textContent}" />
  <input type="submit" value="Save" />
  <input type="button" value="Discard" />
</form>`;
  notePart.style.display = "none";
  iconsPart.style.display = "none";
  taskByData.insertAdjacentHTML("afterbegin", form);
  const formCloser = taskByData.querySelector(".edittask");
  const saveBtn = taskByData.querySelector('input[value="Save"]');
  const discardBtn = taskByData.querySelector('input[value="Discard"]');
  formCloser.querySelector('input[type="newTask"]').focus();
  formCloser
    .querySelector('input[type="newTask"]')
    .setSelectionRange(1000, 1000);
  function hideForm() {
    notePart.style.display = "";
    iconsPart.style.display = "";
    formCloser.reset();
    formCloser.style.display = "none";
    activeEdit = false;
  }
  discardBtn.addEventListener("click", hideForm);
  saveBtn.addEventListener("click", function (e) {
    e.preventDefault();

    let inputVal = formCloser.querySelector('input[type="newTask"]');
    if (!inputVal.value.trim()) {
      inputVal.value = "";
      inputVal.focus();
      return;
    } else {
      let edited = inputVal.value.trim();
      hideForm();
      textContentH3.textContent = edited;
      localStorage.setItem(`content`, allTasks.innerHTML);
      activeEdit = false;
    }
    // textContentH3.style.textDecoration = "";
  });
}
