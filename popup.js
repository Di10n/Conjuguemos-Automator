let timewarning = [0, 0, 0];
let nogos = [0, 0];
let nogo = 0;
let badpage = 0;
let badnum = [0, 0];
let inProgress = 0;
let intervalID = 0;
let gradientID = 0;

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
  let url = tabs[0].url;
  if (!supportedUrl(url)) {
    shutdown();
  }
});

function supportedUrl(u) {
  u = u.split("#")[0]
  let urlnums = [133, 135, 134, 132, 1958161, 131, 130, 138, 139, 137, 136, 119, 116, 114, 127, 126, 125, 115, 123, 113, 1940930, 1940929, 128, 121, 129, 117, 118, 124, 122, 140, 141, 1334208, 120, 142, 2218983, 1419289, 1419288, 1484396, 1418371, 1419284, 1419285]
  let validURLs = urlnums.map((x) => "https://conjuguemos.com/verb/homework/" + x.toString());
  return validURLs.includes(u);
}

function shutdown() {
  badpage = 1;
  checkgrey();
  let warning = document.getElementById("unsupported");
  warning.style.display = "inline";
}

function startTimer(timerbox, minbox, secbox, min, sec) {
  nogos[0] = 1;
  nogo = (nogos[0] || nogos[1]);
  checkgrey();
  let inbox = document.getElementById("number");
  let totalbox = document.getElementById("total");
  let wrongCheck = document.getElementById("getTotal");
  let wrongLabel = document.getElementById("totalLabel");
  inbox.style.zIndex = "-1";
  totalbox.style.zIndex = "-1";
  wrongCheck.style.zIndex = "-1";
  timerbox.style.zIndex = "-1";
  inbox.disabled = "true";
  totalbox.disabled = "true";
  wrongCheck.disabled = "true";
  minbox.disabled = "true";
  secbox.disabled = "true";
  wrongLabel.style.color = "#5f6367";
  minbox.value = min;
  secbox.value = sec;
  inProgress = 1;
}

function endTimer() {
  let inbox = document.getElementById("number");
  let totalbox = document.getElementById("total");
  let wrongCheck = document.getElementById("getTotal");
  let wrongLabel = document.getElementById("totalLabel");
  let minbox = document.getElementById("min");
  let secbox = document.getElementById("sec");
  nogos[0] = 0;
  nogo = (nogos[0] || nogos[1]);
  checkgrey();
  inbox.removeAttribute("disabled");
  totalbox.removeAttribute("disabled");
  wrongCheck.removeAttribute("disabled");
  minbox.removeAttribute("disabled");
  secbox.removeAttribute("disabled");
  wrongLabel.style.color = "black";
  inbox.style.zIndex = "0";
  totalbox.style.zIndex = "0";
  wrongCheck.style.zIndex = "0";
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
  let timerbox = document.getElementById("timerbox");
  let minbox = document.getElementById("min");
  let secbox = document.getElementById("sec");
  startTimer(timerbox, minbox, secbox, min, sec);
  const interval = () => {
    if (!min && !sec) {
      endTimer();
      clearInterval(intervalID);
      clearInterval(gradientID);
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "save",
        });
      });
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
    n = (n + 1)%100;
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
  if (!nogo && !badpage) {
    let numbox = document.getElementById("number");
    let questions = numbox.value
    if (questions === "") {
      questions = 0;
      numbox.value = 0;
    }
    questions = parseInt(questions);
    let totalbox = document.getElementById("total");
    let total = totalbox.value;
    if (total === "") {
      total = questions;
      totalbox.value = questions;
    }
    total = parseInt(total);
    console.log(questions, total-questions)
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "start",
        data: [questions, total - questions],
      });
    });
    if (document.getElementById("SaveScore").checked) {
      let min = document.getElementById("min").value;
      let sec = document.getElementById("sec").value;
      timer(min, sec);
    }
  }
}

function inputHandler() {
  let value = document.getElementById("number").value;
  if (value > 999) {
    badnum [0]= 1;
    numWarnings();
  } else if (value <= 999) {
    badnum[0] = 0;
    numWarnings();
  }
  checkRatio();
}

function clickListen() {
  document.getElementById("number").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      clickHandler();
      event.preventDefault();
    }
  });
  document.getElementById("total").addEventListener("keydown", function (event) {
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
  if (nogo || badpage) {
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
    nogos[0] = 1;
    nogo = (nogos[0] || nogos[1]);
  } else {
    warning.style.display = "none";
    nogos[0] = 0;
    nogo = (nogos[0] || nogos[1]);
  }
  checkgrey();
}

function checkRatio() {
  let firstBox = document.getElementById("number");
  let extraBox = document.getElementById("total");
  if (parseInt(firstBox.value) > parseInt(extraBox.value)) {
    badnum[1] = 1;
    nogos[1] = 1;
    nogo = (nogos[0] || nogos[1]);
    numWarnings();
  } else {
    badnum[1] = 0;
    nogos[1] = 0;
    nogo = (nogos[0] || nogos[1]);
    numWarnings();
  }
  checkgrey();
}

function numWarnings() {
  let ratioWarning = document.getElementById("totalwarning");
  let numWarning = document.getElementById("warning");
  if (badnum[1]) {
    ratioWarning.style.display = "inline";
    numWarning.style.display = "none";
  } else if (badnum[0]) {
    ratioWarning.style.display = "none";
    numWarning.style.display = "inline";
  } else {
    ratioWarning.style.display = "none";
    numWarning.style.display = "none";
  }
}

function checkListen() {
  let label = document.getElementById("SaveLabel");
  let time = document.getElementById("timerbox");
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

function totalListen() {
  let firstBox = document.getElementById("number");
  let extraBox = document.getElementById("total");
  let separator = document.getElementById("separator");
  let label = document.getElementById("totalLabel");
  document.getElementById("getTotal").addEventListener('change', function() {
    if (this.checked) {
      firstBox.style.margin = "0px 4.5px";
      extraBox.style.margin = "0px 4.5px";
      label.style.color = "black";
      extraBox.style.display = "inline";
      firstBox.style.width = "63px";
      firstBox.placeholder = "Correct"
      separator.style.display = "inline";
    } else {
      firstBox.style.margin = "auto";
      extraBox.style.margin = "auto";
      label.style.color = "#5f6367";
      extraBox.style.display = "none";
      firstBox.style.width = "auto";
      firstBox.placeholder = "Number of Questions"
      separator.style.display = "none";
    }
    checkRatio();
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
  let total = document.getElementById("total");
  total.addEventListener("input", checkRatio);
  clickListen();
  checkListen();
  totalListen();
  restrictInput();
});