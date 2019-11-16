var container;
var dragging;
var dropping;

var colors = ["red", "orange", "yellow", "limegreen", "green", "aqua", "blue", "purple"]
var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

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

function saveContent() {
  let name = this.dataset.name;
  let value = JSON.stringify(this.innerHTML);
  localStorage.setItem(name, value);
}

function loadContent() {
  for (var index = 0; index < localStorage.length; index++) {
    let key = localStorage.key(index);
    if (document.querySelector(`.input[data-name="${key}"]`)) {
      document.querySelector(`.input[data-name="${key}"]`).innerHTML = JSON.parse(localStorage.getItem(key));
    }
  }
}

function createTodo() {
  if (document.querySelectorAll('.input').length == 0) {
    var countOfTodos = 0;
    var chosenLetter = "a";
  }
  else {
    var countOfTodos = document.querySelectorAll('.input').length;
    var findExistingLetter = ""
    var chosenLetter = ""
    var numberOfCharacters = (Math.floor(countOfTodos / 26) +1)

    for (var i = 0; i <= countOfTodos; i++) {

      findExistingLetter = ""

      for (var j = 0; j < numberOfCharacters; j++) {
        findExistingLetter += letters[i]
      }

      if (!document.querySelector(`.input[data-name="${findExistingLetter}"`)) {
        chosenLetter = findExistingLetter;
        i = countOfTodos;
      }
    }

    var lastColor = document.querySelectorAll('.input')[countOfTodos-1].id;

    if (!lastColor) {
      lastColor = "red";
    }

    var colorIndex = colors.indexOf(lastColor)+1

    if (colorIndex > 7) {
      colorIndex = 0;
    }
  }

  var todo = document.createElement('div');

  todo.classList.add("input", colors[colorIndex]);
  todo.id = colors[colorIndex];
  todo.dataset.name = chosenLetter;
  todo.contentEditable = true;
  todo.draggable = true;

  container.appendChild(todo);
  ready();

  window.scrollTo(0,document.body.scrollHeight);
}

var ready;

ready = function() {
  loadContent();

  container = document.querySelector('#items');
  document.querySelector('.new-todo').addEventListener("click", createTodo);

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