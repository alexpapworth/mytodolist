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
    container.insertBefore(dragging, dropping);
  }
  else {
    container.insertBefore(dragging, dropping.nextSibling);
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
    name = document.querySelectorAll('.input')[i].dataset.name;

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

function loadContent() {
  for (var index = 0; index < localStorage.length; index++) {

    let name = localStorage.key(index);

    if (name != "order") {
      if (document.querySelector(`.input[data-name="${name}"]`)) {
        let value = JSON.parse(localStorage.getItem(name));
        document.querySelector(`.input[data-name="${name}"]`).innerHTML = value.content;
      }
    }
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
  let todo = document.createElement('div');

  todo.classList.add("input", color);
  todo.id = color;
  todo.dataset.name = letter;
  todo.contentEditable = true;
  todo.draggable = true;
  todo.innerHTML = content;

  container.appendChild(todo);
  addEventListeners();
}

function createNewTodo() {
  if (document.querySelectorAll('.input').length == 0) {
    let colorIndex = 0;
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

    if (name != "order") {
      let storage = JSON.parse(localStorage.getItem(name));

      createTodo(storage.color, name, storage.content);
    }
  }
}

function loadTodos() {
  if (localStorage.length == 0) {
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

let ready;
let addEventListeners;

ready = function() {
  container = document.querySelector('#items');

  loadTodos();

  document.querySelector('.new-todo').addEventListener("click", createNewTodo);

  addEventListeners();
}

addEventListeners = function() {
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
    }
  }
}

document.addEventListener('DOMContentLoaded', ready);