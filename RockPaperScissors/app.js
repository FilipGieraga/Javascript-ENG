"use strict";
const chooseP = document.querySelector(".choose.player");
const chooseC = document.querySelector(".choose.computer");
const pScore = document.querySelector(".playerScore");
const cScore = document.querySelector(".computerScore");
const start = document.querySelector(".start h3");
const range = [3, 4, 5, 6, 7, 8, 9, 10];
const gameObject = {
  rockbtn: { name: "rock", beats: "scissors", src: "styles/rock.png" },
  paperbtn: { name: "paper", beats: "rock", src: "styles/paper.png" },
  scissorsbtn: { name: "scissors", beats: "paper", src: "styles/scissors.png" },
};
const bigImgSelectedP = document.querySelector(".big.p");
const bigImgSelectedC = document.querySelector(".big.c");
let pScoreToNum = Number(pScore.textContent);
let cScoreToNum = Number(cScore.textContent);
let state = 1;
let result = document.querySelector(".result");
bigImgSelectedP.style.opacity = 0;
bigImgSelectedC.style.opacity = 0;
let toWin;

chooseP.addEventListener("click", function (e) {
  e.stopPropagation();
  if (state === 0) return;
  if (cScoreToNum === 0 && pScoreToNum === 0) {
    toWin = document.querySelector('input[type="number"]');
    if (toWin.value && range.includes(Number(toWin.value))) {
      toWin = Number(toWin.value);
    } else {
      toWin = 3;
    }
  }
  let focused = e.target;
  if (focused.className === "choose player") return;
  let closestBtn = focused.closest("button");
  let playerChoice = gameObject[closestBtn.className];
  bigImgSelectedP.src = playerChoice.src;
  let compChoice = computerChoice();
  bigImgSelectedP.style.opacity = 1;
  bigImgSelectedC.style.opacity = 1;
  if (playerChoice.name === compChoice.name) {
    return;
  } else if (playerChoice.beats === compChoice.name) {
    pScoreToNum++;
    pScore.textContent = pScoreToNum;
  } else {
    cScoreToNum++;
    cScore.textContent = cScoreToNum;
  }
  if (cScoreToNum !== 0 || pScoreToNum !== 0)
    start.closest("button").style.display = "";
  if (pScoreToNum === toWin || cScoreToNum === toWin) {
    state = 0;
    if (pScoreToNum === toWin) {
      result.textContent = "Congrats, you won!😊";
    } else {
      result.textContent = "unfortunately, you lost!😔";
    }
  }
});

function computerChoice() {
  let randomChoice = Math.trunc(Math.random() * 3);
  for (let i = 0; i < 3; i++) {
    chooseC.children[i].classList.remove("selected");
  }
  if (randomChoice === 0) {
    randomChoice = gameObject.rockbtn;
    chooseC.children[0].classList.add("selected");
  }
  if (randomChoice === 1) {
    randomChoice = gameObject.paperbtn;
    chooseC.children[1].classList.add("selected");
  }
  if (randomChoice === 2) {
    randomChoice = gameObject.scissorsbtn;
    chooseC.children[2].classList.add("selected");
  }
  bigImgSelectedC.src = randomChoice.src;

  return randomChoice;
}

start.closest("button").addEventListener("click", function () {
  state = 1;
  pScoreToNum = 0;
  pScore.textContent = pScoreToNum;
  cScoreToNum = 0;
  cScore.textContent = cScoreToNum;
  bigImgSelectedP.style.opacity = 0;
  bigImgSelectedC.style.opacity = 0;
  result.textContent = "";
  for (let i = 0; i < 3; i++) {
    chooseC.children[i].classList.remove("selected");
  }
});
