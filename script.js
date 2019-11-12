var container;
var dragging;
var dropping;

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

var ready;

ready = function() {
  if (window.navigator.platform == "iPhone") {
    for (var i = 0; i < document.querySelectorAll('.input').length; i++) {
      document.querySelectorAll('.input')[i].draggable = false;
    }
  }
  else {
    container = document.querySelector('#items');

    for (var i = 0; i < document.querySelectorAll('.input').length; i++) {
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