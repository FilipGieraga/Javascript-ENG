"use strict";
const startBtn = document.querySelector(".btn-start");
const restartBtn = document.querySelector(".btn-restart");
let points = document.querySelector(".points");
let seconds = document.querySelector(".seconds");
let highScore = document.querySelector(".hs");
let avg = document.querySelector(".avg");
const mainContainer = document.querySelector(".main");
restartBtn.style.display = "none";
let state = 0;
let pointsToNumber = Number(points.textContent);
if (localStorage.getItem("hs")) {
  highScore.textContent = localStorage.getItem("hs");
} else {
  highScore.textContent = 0;
}
let timeDefault = 10;
seconds.textContent = timeDefault;
startBtn.addEventListener("click", function (e) {
  startBtn.style.display = "none";
  state = 1;
  e.stopPropagation();
  //   prevents bubbling up in a dom tree
  startTimer();
  mainContainer.addEventListener("click", clickCounter);
});

const clickCounter = function (e) {
  if (state === 1) {
    pointsToNumber += 1;
    points.textContent = pointsToNumber;
  }
};

const startTimer = function (time = timeDefault) {
  const tick = function () {
    seconds.textContent = time;
    if (time === 0) {
      clearInterval(timer);
      //   here state changes to 0
      state = 0;
      Number(highScore.textContent) < pointsToNumber
        ? (highScore.textContent = pointsToNumber)
        : highScore.textContent;
      avg.textContent = pointsToNumber * 6;
      localStorage.setItem("hs", highScore.textContent);
      //   display restart button
      restartBtn.style.display = "";
    }
    time--;
  };
  tick();
  const timer = setInterval(tick, 1000);
};

restartBtn.addEventListener("click", function () {
  restartBtn.style.display = "none";
  startBtn.style.display = "";
  points.textContent = 0;
  pointsToNumber = 0;
  avg.textContent = "";
  seconds.textContent = timeDefault;
  mainContainer.removeEventListener("click", clickCounter);
});

// console.log(localStorage.getItem("hs"));
