"use strict";
const container = document.querySelector(".container");
const startBtn = document.querySelector(".btn-start");
const restartBtn = document.querySelector(".btn-restart");
let points = document.querySelector(".points");
let seconds = document.querySelector(".seconds");
let highScore = document.querySelector(".hs");
if (localStorage.getItem("hsaimbot")) {
  highScore.textContent = localStorage.getItem("hsaimbot");
} else {
  highScore.textContent = 0;
}
let timeDefault = 60;
let pointsToNumber = Number(points.textContent);
restartBtn.style.display = "none";

seconds.textContent = timeDefault;
let pathToDot;
let score = 0;
let state = 0;
let gridElems = {};
let gridElemsEmpty = [];
let gridElemsWithDots = [];
const addGridElemsToObj = function () {
  // this function takes all grid elems and stores them in an object
  let divs = document.querySelectorAll("div");
  divs = [...divs];
  for (const div of divs) {
    if (div.className.length === 2) {
      gridElems[`${div.className}`] = document.querySelector(
        `.${div.className}`
      ); //adding key value pair to an object like a1: actual object with it's properties
      let divToArray = div.className;
      gridElemsEmpty.push(divToArray);
    }
  }
  const copy = [...gridElemsEmpty];
};
addGridElemsToObj();

function randomInt(min = 15, max = 85) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const fillArray6dots = function () {
  let popped;
  gridElemsEmpty = shuffleArray(gridElemsEmpty);
  for (let i = 0; i < 6; i++) {
    const l = randomInt();
    const t = randomInt();
    const dotHtml = `<div class="dot" style ="position:absolute; left :${l}%; top:${t}%;"></div>`;
    popped = gridElemsEmpty.shift();
    gridElems[popped].insertAdjacentHTML("beforeend", dotHtml);
    gridElemsWithDots.push(popped);
  }
};

const dotClicked = function (e) {
  if (state === 1) {
    console.log(`You clicked a dot in grid element ${e.path[1].className}`);
    pathToDot = e.path[1].className;
    e.stopPropagation();
    pointsToNumber += 10;
    points.textContent = pointsToNumber;
    //   stopPropagation prevents from triggering addEL on a container
    gridElems[pathToDot].innerHTML = "";
    gridElemsWithDots.splice(gridElemsWithDots.indexOf(pathToDot), 1);
    // removes elems from gridElemsWithDots
    gridElemsEmpty = shuffleArray(gridElemsEmpty);
    gridElemsEmpty.push(pathToDot);
    pathToDot = gridElemsEmpty.shift();
    const l = randomInt();
    const t = randomInt();
    const dotHtml = `<div class="dot" style ="position:absolute; left :${l}%; top:${t}%;"></div>`;
    gridElems[pathToDot].insertAdjacentHTML("beforeend", dotHtml);
    gridElemsWithDots.push(pathToDot);
    let dots = document.querySelectorAll(".dot");
    for (let i = 0; i < dots.length; i++) {
      dots[i].addEventListener("click", dotClicked);
    }
  }
};

const contClicked = function (e) {
  if (state === 1) {
    console.log("You clicked a container");
    pointsToNumber -= 2;
    points.textContent = pointsToNumber;
    e.stopPropagation();
  }
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
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
      //   display restart button
      localStorage.setItem("hsaimbot", highScore.textContent);
      restartBtn.style.display = "";
    }
    time--;
  };
  tick();
  const timer = setInterval(tick, 1000);
};

startBtn.addEventListener("click", function (e) {
  startBtn.style.display = "none";
  state = 1;
  e.stopPropagation();
  //   prevents bubbling up in a dom tree
  startTimer();
  fillArray6dots();
  let dots = document.querySelectorAll(".dot");
  container.addEventListener("click", contClicked);

  for (let i = 0; i < dots.length; i++) {
    dots[i].addEventListener("click", dotClicked);
    //   event listener now listens to all clicks on a dot
  }
});

restartBtn.addEventListener("click", function () {
  restartBtn.style.display = "none";
  startBtn.style.display = "";
  points.textContent = 0;
  pointsToNumber = 0;
  gridElemsEmpty = [...gridElemsEmpty, ...gridElemsWithDots];
  gridElemsWithDots = [];
  seconds.textContent = timeDefault;
  for (const elem in gridElems) {
    gridElems[elem].innerHTML = "";
  }
  console.log(gridElemsEmpty);
  console.log(gridElemsWithDots);
});
