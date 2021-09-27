"use strict";
import { pl5To10, take1 } from "./dictPL.js";
import { eng5To10 } from "./dictENG.js";
const checkB = document.querySelector('input[type="checkbox"]');
const hiddenDropbox = document.querySelectorAll(".hide");
let passwordInitial = document.querySelector('input[type="password"]');
let categoryInitial = document.querySelector(
  'input[placeholder="OPTIONAL MAX=25"]'
);
let triesInitial = document.querySelector(
  'input[placeholder="DEFAULT=11, MIN=1, MAX=15"]'
);
const warningInitial = document.querySelector(".warning1");
const options = document.querySelector(".langs");
let lettersNumber = document.querySelector('input[placeholder="LETTERS 5-10"]');

const startInitial = document.querySelector('button[name="startinitial"]');
const container = document.querySelector(".container");
const init = document.querySelector(".initial");
const actualGame = document.querySelector(".two");
const restart = document.querySelector(".two button");
let state = 0;
const seconds = document.querySelector(".spantime");
let time = 0;
// console.log(take1(10, pl5To10));

actualGame.style.display = "none";
container.style.backgroundColor = "#208c8c";
String.prototype.replaceAt = function (index, replacement) {
  if (index >= this.length) {
    return this.valueOf();
  }

  return this.substring(0, index) + replacement + this.substring(index + 1);
};
let password, category, tries;
const triesDefault = 11;
// prettier-ignore
const validLetters = ["a","ą","b","c","ć","d","e","ę","f","g","h","i","j",
"k","l","ł","m","n","ń","o","ó","p","q",
"r","s","ś","t","u","v","w","x","y","z",
"ź","ż"];
const validLettersUpper = validLetters.map((el) => el.toUpperCase());

checkB.addEventListener("click", function (e) {
  e.stopPropagation();
  if (checkB.checked) {
    for (let i = 0; i < hiddenDropbox.length; i++) {
      hiddenDropbox[i].style.display = "inline-block";
    }
    passwordInitial.disabled = true;
    categoryInitial.disabled = true;
    warningInitial.textContent = "POLISH SPECIAL CHARACTERS INCLUDED";
  } else {
    for (let i = 0; i < hiddenDropbox.length; i++) {
      hiddenDropbox[i].style.display = "none";
    }
    passwordInitial.disabled = "";
    categoryInitial.disabled = "";
  }
});
function moveToGame(e) {
  warningInitial.textContent = "";
  if (checkB.checked === true) {
    tries = triesInitial.value;
    try {
      if (
        Number(lettersNumber.value) < 5 ||
        Number(lettersNumber.value) > 10 ||
        !Number.isInteger(Number(lettersNumber.value))
      ) {
        lettersNumber.value = "";
        throw "WRONG LETTERS NUMBER";
      }
      if (tries) {
        if (
          Number(tries) < 1 ||
          Number(tries) > 15 ||
          !Number.isInteger(Number(tries))
        ) {
          triesInitial.value = "";
          throw "WRONG TRIES NUMBER";
        } else {
          tries = Number(tries);
        }
      } else {
        tries = triesDefault;
      }
    } catch (e) {
      warningInitial.textContent = e;
      return;
    }
    if (options.value === "pl") {
      password = take1(Number(lettersNumber.value), pl5To10);
      lettersNumber.value = "";
    }
    if (options.value === "eng") {
      password = take1(Number(lettersNumber.value), eng5To10);
      lettersNumber.value = "";
    }
  } else if (checkB.checked === false) {
    password = passwordInitial.value;
    category = categoryInitial.value;
    tries = triesInitial.value;
    password = password.trim().toUpperCase();
    category = category.trim().toUpperCase();

    let passwordArray = password.split("");
    try {
      passwordArray.forEach(function (el) {
        if (!validLettersUpper.includes(el)) {
          passwordInitial.value = "";
          throw "INVALID SYMBOL IN PASSWORD";
        }
      });
      if (passwordArray.length < 5 || passwordArray.length > 20) {
        passwordInitial.value = "";
        throw "PASSWORD TOO LONG OR TOO SHORT";
      }
      if (category.length > 25) throw "CATEGORY TOO LONG MAX = 20";
      if (tries) {
        if (
          Number(tries) < 1 ||
          Number(tries) > 15 ||
          !Number.isInteger(Number(tries))
        ) {
          triesInitial.value = "";
          throw "WRONG TRIES NUMBER";
        } else {
          tries = Number(tries);
        }
      } else {
        tries = triesDefault;
      }
    } catch (e) {
      warningInitial.textContent = e;
      return;
    }
  }
  container.style.backgroundColor = "#f29f05";
  init.style.display = "none";
  actualGame.style.display = "";
  populateData();
}

// Event listener to move to game
startInitial.addEventListener("click", moveToGame);
init.addEventListener("keyup", function (event) {
  if (event.code === "Enter") moveToGame();
});

let submitLetter = document.querySelector('input[type="submit"]');
let letterSlot = document.querySelector(
  'input[placeholder="enter a letter or password"]'
);
let warining2 = document.querySelector(".two h5");
let pDisplay = document.querySelector("h1");
let sUsed = document.querySelector(".spanused");
let sTries = document.querySelector(".spantry");
let sTriesLeft = document.querySelector(".spantriesleft");
let sLength = document.querySelector(".spanpasslength");
let sCategory = document.querySelector(".spancategory");
const populateData = function () {
  sLength.textContent = password.length;
  pDisplay.textContent = "_".repeat(password.length);
  if (category) {
    sCategory.textContent = category;
  } else {
    sCategory.textContent = "NOT DEFINED";
  }
  sUsed.textContent = "";
  sTries.textContent = 0;
  warining2.textContent = "ENTER YOUR FIRST LETTER";
  warining2.style.color = "#034959";
  sTriesLeft.textContent = tries;
  state = 1;
  letterSlot.focus();
  startTimer();
};

// password = "ANANAS";
// tries = 12;
// category = "FRUIT";
// state = 1;
// populateData();

function checkLetter() {
  if (state === 0) return;
  warining2.textContent = "";
  warining2.style.color = "#a62424";
  let letterValueUpper = letterSlot.value.toUpperCase().trim();
  let passwordArray = password.split("");
  if (letterValueUpper.length < 5) {
    try {
      if (letterValueUpper.length === 0)
        throw "NO INPUT OF LETTER OR PASSWORD FOUND";
      if (!validLettersUpper.includes(letterValueUpper))
        throw "INPUT OUT OF SCOPE OF VALID LETTERS";
      if (sUsed.textContent.includes(letterValueUpper))
        throw "LETTER ALREADY USED";
    } catch (e) {
      letterSlot.focus();
      warining2.textContent = e;
      letterSlot.value = "";
      return;
    }
    let positionInArray = [];
    passwordArray.forEach(function (el, index) {
      if (el === letterValueUpper) positionInArray.push(index);
    });
    if (positionInArray.length === 0) {
      warining2.textContent = `LETTER ${letterValueUpper} IS NOT IN PASSWORD`;
      letterSlot.value = "";
      sTries.textContent = Number(sTries.textContent) + 1;
      sTriesLeft.textContent = Number(sTriesLeft.textContent) - 1;
      sUsed.textContent = sUsed.textContent.concat(` ${letterValueUpper} `);
      letterSlot.focus();
    } else {
      for (let pos = 0; pos < positionInArray.length; pos++) {
        pDisplay.textContent = pDisplay.textContent.replaceAt(
          positionInArray[pos],
          `${letterValueUpper}`
        );
        letterSlot.value = "";
        warining2.style.color = "#034959";
        warining2.textContent = `LETTER ${letterValueUpper} FOUND IN PASSWORD AT ${
          positionInArray.length
        } ${positionInArray.length > 1 ? "POSITIONS" : "POSITION"}`;
      }
      sUsed.textContent = sUsed.textContent.concat(` ${letterValueUpper} `);
      sTries.textContent = Number(sTries.textContent) + 1;
      letterSlot.focus();
    }
  }
  if (letterValueUpper.length >= 5) {
    let passwordTry = letterValueUpper.split("");

    try {
      passwordTry.forEach(function (el) {
        if (!validLettersUpper.includes(el)) throw "INVALID SYMBOL IN ATTEMPT";
      });
      if (passwordTry.length > 20) throw "ATTEMPT LONGER THAN MAXIMUM RANGE";
    } catch (e) {
      letterSlot.focus();
      warining2.textContent = e;
      letterSlot.value = "";
      return;
    }
    if (password === letterValueUpper) {
      pDisplay.textContent = letterValueUpper;
      sTries.textContent = Number(sTries.textContent) + 1;
    } else {
      sTries.textContent = Number(sTries.textContent) + 1;
      sTriesLeft.textContent = Number(sTriesLeft.textContent) - 1;
      warining2.textContent = `${letterValueUpper} IS NOT A PASSWORD`;
      letterSlot.value = "";
      letterSlot.focus();
    }
  }

  // win final text
  if (!pDisplay.textContent.includes("_")) {
    warining2.style.color = "#034959";
    warining2.textContent = "CONGRATULATIONS, YOU WON";
    state = 0;
    letterSlot.disabled = true;
  }

  // loose final text
  if (Number(sTriesLeft.textContent) === 0) {
    warining2.textContent = `UNFORTUNATELY, YOU LOST. HERE IS THE PASSWORD: ${password}`;
    state = 0;
    letterSlot.disabled = true;
  }
}

// event listeners for click and enter keypress
submitLetter.addEventListener("click", checkLetter);
letterSlot.addEventListener("keyup", function (event) {
  if (event.code === "Enter") checkLetter();
});
restart.addEventListener("click", reset);

function reset(e) {
  tries = category = password = "";
  checkB.checked = letterSlot.disabled = false;
  for (let i = 0; i < hiddenDropbox.length; i++) {
    hiddenDropbox[i].style.display = "none";
  }
  state = 0;
  warining2.textContent =
    passwordInitial.value =
    categoryInitial.value =
    triesInitial.value =
    letterSlot.value =
    passwordInitial.disabled =
    categoryInitial.disabled =
      "";
  container.style.backgroundColor = "#208c8c";
  init.style.display = "";
  actualGame.style.display = "none";
  time = 0;
}

const startTimer = function () {
  const tick = function () {
    seconds.textContent = time;
    if (state === 0) {
      clearInterval(timer);
      //   here state changes to 0
    }
    time++;
  };
  tick();
  const timer = setInterval(tick, 1000);
};
