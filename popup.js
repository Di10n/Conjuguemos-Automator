let timewarning = [0, 0, 0];
let nogo = 0;
let inProgress = 0;
let intervalID = 0;
let gradientID = 0;

function startTimer(tohide, timerbox, minbox, secbox, min, sec) {
  nogo = 1;
  checkgrey();
  for (e of tohide) {
    e.style.opacity = "50%";
    e.style.zIndex = "-1";
  }
  timerbox.style.zIndex = "-1";
  minbox.disabled = "true";
  secbox.disabled = "true";
  minbox.value = min;
  secbox.value = sec;
  inProgress = 1;
}

function endTimer() {
  let tohide = [
    document.getElementById("number"),
    document.getElementById("warning"),
  ];
  let minbox = document.getElementById("min");
  let secbox = document.getElementById("sec");
  nogo = 0;
  checkgrey();
  for (e of tohide) {
    e.style.opacity = "100%";
    e.style.zIndex = "0";
  }
  minbox.removeAttribute("disabled");
  secbox.removeAttribute("disabled");
  timerbox.style.zIndex = "0";
  inProgress = 0;
}

function initialize(min, sec) {
  if (min == "") {
    min = 0;
  }
  if (sec == "") {
    sec = 0;
  }
  min = parseInt(min);
  sec = parseInt(sec);
  return [min, sec];
}

function update(min, sec, minbox, secbox) {
  sec = sec.toString();
  if (sec.length == 1) {
    sec = "0" + sec;
  }
  minbox.value = min;
  secbox.value = sec;
  sec = parseInt(sec);
  newtime = decrement(min, sec);
  min = newtime[0];
  sec = newtime[1];
  return [min, sec];
}

function updategradient(imin, isec, min, sec, n) {
  let itime = (imin * 60 + isec);
  let time = (min * 60 + sec - n/100);
  let proportion = (1 - (time + 1) / itime) * 100;
  button = document.getElementById("start-btn");
  button.style.background = `linear-gradient(90deg, #03bd65 ${proportion}%, #c0c0c0 ${proportion}%)`;
}

function timer(min, sec) {
  init = initialize(min, sec);
  min = init[0];
  sec = init[1];
  let imin = min
  let isec = sec
  let tohide = [
    document.getElementById("number"),
    document.getElementById("warning"),
  ];
  let timerbox = document.getElementById("timerbox");
  let minbox = document.getElementById("min");
  let secbox = document.getElementById("sec");
  startTimer(tohide, timerbox, minbox, secbox, min, sec);
  const interval = () => {
    if (!min && !sec) {
      endTimer();
      clearInterval(intervalID);
      clearInterval(gradientID);
    }
    newtime = update(min, sec, minbox, secbox);
    min = newtime[0];
    sec = newtime[1];
  };
  intervalID = setInterval(interval, 1000);
  interval();
  let n = 0;
  const gradient = () => {
    updategradient(imin, isec, min, sec, n);
    n = n%100 + 1
  };
  gradientID = setInterval(gradient, 10);
  gradient();
}

function decrement(min, sec) {
  if (sec) {
    return [min, sec - 1];
  } else {
    return [min - 1, 59];
  }
}

function clickHandler() {
  if (!nogo) {
    if (document.getElementById("SaveScore").checked) {
      let min = document.getElementById("min").value;
      let sec = document.getElementById("sec").value;
      if (parseInt(min) || parseInt(sec)) {
        timer(min, sec);
      }
    }
    let numbox = document.getElementById("number");
    let questions = numbox.value
    if (questions === "") {
      questions = 0;
      numbox.value = 0;
    }
    let inputId = "answer-input";
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "insertText",
        inputId: inputId,
        data: questions,
      });
    });
  }
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
  document.getElementById("number").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      clickHandler();
      event.preventDefault();
    }
  });
  document.getElementById("min").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      clickHandler();
      event.preventDefault();
    }
  });
  document.getElementById("sec").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      clickHandler();
      event.preventDefault();
    }
  });
}

function checkgrey() {
  let button = document.getElementById("start-btn");
  if (nogo) {
    button.style.background = "#c0c0c0";
    button.style.cursor = "not-allowed"
  } else {
    button.style.background = "#03bd65";
    button.style.cursor = "pointer"
  }
}

function checkTime() {
  let warning = document.getElementById("timewarning");
  if ((timewarning[0] || timewarning[1]) && timewarning[2]) {
    warning.style.display = "inline";
    nogo = 1;
  } else {
    warning.style.display = "none";
    nogo = 0;
  }
  checkgrey();
}

function checkListen() {
  let label = document.getElementById("SaveLabel")
  let time = document.getElementById("timerbox")
  document.getElementById("SaveScore").addEventListener('change', function() {
    if (this.checked) {
      label.style.color = "black";
      time.style.display = "inline"
      timewarning[2] = 1;
    } else {
      label.style.color = "#5f6367";
      time.style.display = "none"
      timewarning[2] = 0;
      if (inProgress) {
        endTimer();
        clearInterval(intervalID);
        clearInterval(gradientID);
      }
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
  let button = document.getElementById("start-btn");
  button.addEventListener("click", clickHandler);
  let input = document.getElementById("number");
  input.addEventListener("input", inputHandler);
  let min = document.getElementById("min");
  min.addEventListener("input", minHandler);
  let sec = document.getElementById("sec");
  sec.addEventListener("input", secHandler);
  clickListen();
  checkListen();
  restrictInput();
});