function clickHandler() {
  var questions = document.getElementById("number").value;
  var inputId = "answer-input";
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "insertText",
      inputId: inputId,
      data: questions,
    });
  });
}

function inputHandler() {
  let warning = document.getElementById("warning");
  let value = document.getElementById("number").value;
  if (value > 999) {
    warning.style.display = "inline";
  } else if (value <= 999) {
    warning.style.display = "none";
  }
}

function clickListen() {
  document
    .getElementById("number")
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        clickHandler();
        event.preventDefault();
      }
    });
}

var timewarning = [0, 0, 0];

function checkTime() {
  let warning = document.getElementById("timewarning");
  if ((timewarning[0] || timewarning[1]) && timewarning[2]) {
    warning.style.display = "inline";
  } else {
    warning.style.display = "none";
  }
}

function checkListen() {
  var label = document.getElementById("SaveLabel")
  var time = document.getElementById("timerbox")
  document.getElementById("SaveScore").addEventListener('change', function() {
    if (this.checked) {
      label.style.color = "black";
      time.style.display = "inline"
      timewarning[2] = 1;
    } else {
      label.style.color = "#5f6367";
      time.style.display = "none"
      timewarning[2] = 0;
    }
    checkTime();
  });
}

function minHandler() {
  let value = document.getElementById("min").value;
  if (value > 59) {
    timewarning[0] = 1;
  } else if (value <= 59) {
    timewarning[0] = 0;
  }
  checkTime();
}

function secHandler() {
  let value = document.getElementById("sec").value;
  if (value > 59) {
    timewarning[1] = 1;
  } else if (value <= 59) {
    timewarning[1] = 0;
  }
  checkTime();
}

function restrictInput() {
  for (e of document.querySelectorAll("input")) {
    e.addEventListener("keypress", function (evt) {
      if (!["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(evt.key)) {
        evt.preventDefault();
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("warning").style.display = "none";
  var button = document.getElementById("start-btn");
  button.addEventListener("click", clickHandler);
  var input = document.getElementById("number");
  input.addEventListener("input", inputHandler);
  var min = document.getElementById("min");
  min.addEventListener("input", minHandler);
  var sec = document.getElementById("sec");
  sec.addEventListener("input", secHandler);
  clickListen();
  checkListen();
  restrictInput();
});