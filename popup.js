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
  if (value > 1000) {
    warning.style.display = "inline";
  } else if (value <= 1000) {
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

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("warning").style.display = "none";
  var button = document.getElementById("start-btn");
  button.addEventListener("click", clickHandler);
  var input = document.getElementById("number");
  input.addEventListener("input", inputHandler);
  clickListen();
});
