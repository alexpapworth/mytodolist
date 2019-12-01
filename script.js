"use strict";

var container;
var dragging;
var dropping;

let colors = ["red", "orange", "yellow", "limegreen", "green", "aqua", "blue", "purple"]
let letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

function dragstart(e) {
  dragging = this;
  dragging.classList.add('dragging');
}

function dragover(e) {
  e.preventDefault();
}

function dragenter(e) {
  e.preventDefault();
  if (document.querySelector('.ghost')) {
    document.querySelector('.ghost').classList.remove('ghost');
  }

  this.classList.add('ghost');
}

function dragleave(e) {
  e.preventDefault();
}

function dragend() {
  dragging.classList.remove('dragging');
  dropping = document.querySelector('.ghost');
  
  dragIndex = Array.from(document.querySelectorAll('.input')).indexOf(dragging);
  dropIndex = Array.from(document.querySelectorAll('.input')).indexOf(dropping);

  while (document.querySelector('.ghost')) {
    document.querySelector('.ghost').classList.remove('ghost');
  }

  if (dragIndex > dropIndex) {
    container.insertBefore(dragging.parentElement, dropping.parentElement);
  }
  else {
    container.insertBefore(dragging.parentElement, dropping.parentElement.nextSibling);
  }

  updateOrder();
}

function dragEnterContent(e) {
  e.preventDefault();
  this.parentElement.classList.add('ghost');
}

function dragLeaveContent(e) {
  e.preventDefault();
}

function showControls() {
  let controls = document.querySelector('.controls');
  controls.classList.remove("hide-controls");
  let todoContainer = this.parentElement;

  todoContainer.appendChild(controls);
}

function hideControls() {
  let controls = document.querySelector('.controls');
  controls.classList.add("hide-controls");
}

function resetControls() {
  let controls = document.querySelector('.controls');
  container.appendChild(controls);
}

function addContentListener() {
  if (this.querySelector('div')) {
    for (var i = 0; i < this.querySelectorAll('div').length; i++) {
      this.querySelectorAll('div')[i].addEventListener("dragenter", dragEnterContent);
      this.querySelectorAll('div')[i].addEventListener("dragleave", dragLeaveContent);
    }
  }
}

function saveNewContent() {
  updateOrder();
  for (var i = 0; i < document.querySelectorAll('.input').length; i++) {
    let name = document.querySelectorAll('.input')[i].dataset.name;

    if (localStorage.getItem(name) == null) {
      saveContent.call(document.querySelectorAll('.input')[i]);
    }
  }
}

function saveContent() {
  let name = this.dataset.name;
  let color = this.id;
  let content = this.innerHTML;

  let value = JSON.stringify({"color": color, "content": content});
  localStorage.setItem(name, value);
}

function saveTitle() {
  let title = this.innerHTML;
  document.title = title;

  let value = JSON.stringify(title);
  localStorage.setItem("title", value);
}

function loadTitle() {
  let title = JSON.parse(localStorage.getItem("title"));

  if (title != null) {
    document.querySelector("#title").innerHTML = title;
    document.title = title;
  }
}

function updateOrder() {
  var order = [];

  for (var i = 0; i < document.querySelectorAll('.input').length; i++) {
    let name = document.querySelectorAll('.input')[i].dataset.name;
    order.push(name);
  }

  let value = JSON.stringify(order);
  localStorage.setItem("order", value);
}

function createTodo(color, letter, content = "") {
  let todoContainer = document.createElement('div');
  todoContainer.classList.add('input-container');

  let todo = document.createElement('div');

  todo.classList.add("input", color);
  todo.id = color;
  todo.dataset.name = letter;
  todo.contentEditable = true;
  todo.draggable = true;
  todo.innerHTML = content;

  todoContainer.appendChild(todo);
  container.appendChild(todoContainer);
  addTodoEventListeners();
}

function createNewTodo() {
  if (document.querySelectorAll('.input').length == 0) {
    var colorIndex = 0;
    var chosenLetter = "a";
  }
  else {
    let countOfTodos = document.querySelectorAll('.input').length;
    let numberOfCharacters = (Math.floor(countOfTodos / 26) +1);

    var testExistingLetter = "";
    var chosenLetter = "";

    for (var i = 0; i <= countOfTodos; i++) {

      testExistingLetter = "";

      for (var j = 0; j < numberOfCharacters; j++) {
        testExistingLetter += letters[i];
      }

      if (!document.querySelector(`.input[data-name="${testExistingLetter}"`)) {
        chosenLetter = testExistingLetter;
        i = countOfTodos;
      }
    }

    var colorIndex = countOfTodos%7

    if (colorIndex > 7) {
      colorIndex = 0;
    }
  }

  createTodo(colors[colorIndex], chosenLetter);
  saveNewContent();

  window.scrollTo(0,document.body.scrollHeight);
}

function createExistingTodos() {
  let order = JSON.parse(localStorage.getItem("order"));

  for (var index = 0; index < order.length; index++) {
    let name = order[index];
    let storage = JSON.parse(localStorage.getItem(name));
    createTodo(storage.color, name, storage.content);
  }
}

function loadTodos() {
  if (localStorage.length == 0 ||
      localStorage.length == 1 && localStorage.getItem("order") ||
      localStorage.length == 2 && localStorage.getItem("order") && localStorage.getItem("title")) {
    createNewTodo();
    createNewTodo();
    createNewTodo();
    saveNewContent();
  }
  else {
    createExistingTodos();
    saveNewContent();
  }
}

function removeTodo() {
  let todo = document.querySelector('.controls').previousElementSibling;
  let name = todo.dataset.name;

  localStorage.removeItem(name);

  resetControls();

  container.removeChild(todo.parentElement);
  updateOrder();
}

function setTodoColor(todo, color) {
  todo.className = "";
  todo.classList.add("input", color);
  todo.id = color;
}

function setTemporaryTodoColor() {
  let todo = document.querySelector('.controls').previousElementSibling;
  let color = this.dataset.color;

  if (!todo.dataset.previousColor) {
    todo.dataset.previousColor = todo.id
  }

  setTodoColor(todo, color);
}

function unsetTemporaryTodoColor() {
  let todo = document.querySelector('.controls').previousElementSibling;

  if (todo.dataset.previousColor) {
    let previousColor = todo.dataset.previousColor;
    delete todo.dataset.previousColor;

    setTodoColor(todo, previousColor);
  }
}

function setPermanentTodoColor() {
  let todo = document.querySelector('.controls').previousElementSibling;
  let color = this.dataset.color;

  if (todo.dataset.previousColor) {
    delete todo.dataset.previousColor;
  }

  setTodoColor(todo, color);
  saveContent.call(todo);

  hideControls();
}

let ready;
let addTodoEventListeners;

ready = function() {
  container = document.querySelector('#items');

  loadTitle();
  loadTodos();

  document.querySelector('#title').addEventListener("input", saveTitle);

  document.querySelector('.new-todo').addEventListener("click", createNewTodo);
  document.querySelector('.delete-todo').addEventListener("click", removeTodo);

  for (var i = 0; i < document.querySelectorAll('.color-box').length; i++) {
    document.querySelectorAll('.color-box')[i].addEventListener("mouseenter", setTemporaryTodoColor);
    document.querySelectorAll('.color-box')[i].addEventListener("click", setPermanentTodoColor);
  }
  document.querySelector('.color-options').addEventListener("mouseleave", unsetTemporaryTodoColor);

  addTodoEventListeners();
}

addTodoEventListeners = function() {
  for (var i = 0; i < document.querySelectorAll('.input').length; i++) {
    document.querySelectorAll('.input')[i].addEventListener("input", saveContent);

    if (window.navigator.platform == "iPhone") {
        document.querySelectorAll('.input')[i].draggable = false;
    }
    else {
      document.querySelectorAll('.input')[i].addEventListener("dragstart", dragstart);
      document.querySelectorAll('.input')[i].addEventListener("dragend", dragend);
      document.querySelectorAll('.input')[i].addEventListener("dragover", dragover);
      document.querySelectorAll('.input')[i].addEventListener("dragenter", dragenter);
      document.querySelectorAll('.input')[i].addEventListener("dragleave", dragleave);

      document.querySelectorAll('.input')[i].addEventListener("input", addContentListener);

      document.querySelectorAll('.input')[i].addEventListener("mouseenter", showControls);
      document.querySelectorAll('.input')[i].addEventListener("mousedown", hideControls);
    }
  }
}

document.addEventListener('DOMContentLoaded', ready);
