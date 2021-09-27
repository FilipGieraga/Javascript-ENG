"use strict";
const end = document.querySelector(".end");
const score = document.querySelector(".sscore");
const button = document.querySelector(".easy");
const buttons = document.querySelectorAll(".btn");

const gridContainer = document.querySelector(".grid");

// window.onload = () => {
//   const grid = document.querySelector(".grid");
//   const masonry = new Masonry(grid, {
//     itemSelector: ".grid-item",
//     gutter: 0,
//   });
// };

const gridPics = {
  1: { picture: "./styles/dropbox.png" },
  2: { picture: "./styles/facebook.png" },
  3: { picture: "./styles/instagram.png" },
  4: { picture: "./styles/linkedin.png" },
  5: { picture: "./styles/gplus.png" },
  6: { picture: "./styles/snapchat.png" },
  7: { picture: "./styles/tiktok.png" },
  8: { picture: "./styles/twitter.png" },
  9: { picture: "./styles/whatsapp.png" },
  10: { picture: "./styles/shazam.png" },
  11: { picture: "./styles/reddit.png" },
  12: { picture: "./styles/soundcloud.png" },
  13: { picture: "./styles/spotify.png" },
  14: { picture: "./styles/tumblr.png" },
  15: { picture: "./styles/yahoo.png" },
  16: { picture: "./styles/youtube.png" },
  17: { picture: "./styles/skype.png" },
  18: { picture: "./styles/pinterest.png" },
};

const gridMaker = {
  16: {
    elems: 16,
    gridItemsWidth: "calc(60vw / 4)",
    gridItemsHeight: "calc(80vh / 4)",
    unique: 8,
  },
  24: {
    elems: 24,
    gridItemsWidth: "calc(60vw / 6)",
    gridItemsHeight: "calc(80vh / 4)",
    unique: 12,
  },
  36: {
    elems: 36,
    gridItemsWidth: "calc(60vw / 6)",
    gridItemsHeight: "calc(80vh / 6)",
    unique: 18,
  },
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function randomPictures(unique) {
  const array1To18 = Array.from({ length: 18 }, (_, i) => i + 1);
  shuffleArray(array1To18);
  let array = array1To18.slice(0, unique);
  let array2 = [...array, ...array];
  shuffleArray(array2);
  return array2;
}
// const randomPics = randomPictures(8);
// console.log(randomPics);

function makeGrid(gridSpecs) {
  const randomPics = randomPictures(gridSpecs.unique);
  gridContainer.innerHTML = "";
  for (let i = 0; i < gridSpecs.elems; i++) {
    gridContainer.insertAdjacentHTML(
      "afterbegin",
      `
      <div class="grid-item">
      <div class="flipper">
      <div class="front"></div>
      <div class="back" data-atr="${i}" data-revealed=false>
      <img src="${gridPics[randomPics[i]].picture}" width="40%" />
      </div>
      </div>
      </div>`
    );
  }

  // for (let i = 0; i < gridSpecs.elems; i++) {
  //   let frag = document.createRange().createContextualFragment(`
  //        <div class="grid-item">
  //        <div class="flipper">
  //        <div class="front"></div>
  //        <div class="back" data-atr="${i}" data-revealed=false>
  //        <img src="${gridPics[randomPics[i]].picture}" width="40%" />
  //        </div>
  //        </div>
  //        </div>`);
  //     gridContainer.appendChild(frag)
  // }

  const gridItems = document.querySelectorAll(".grid-item");
  for (let j = 0; j < gridItems.length; j++) {
    gridItems[j].style.width = gridSpecs.gridItemsWidth;
    gridItems[j].style.height = gridSpecs.gridItemsHeight;
  }
  const grid = document.querySelector(".grid");
  let masonry = new Masonry(grid, {
    itemSelector: ".grid-item",
    gutter: 0,
  });
}

function flipCard(flippers) {
  for (let i = 0; i < flippers.length; i++) {
    flippers[i].addEventListener("click", function () {
      if (gameStop === true) return;
      const back = flippers[i].querySelector(".back");
      const backImg = flippers[i]
        .querySelector("img")
        .src.split("/")
        .pop()
        .split(".")[0];
      if (back.getAttribute("data-revealed") === "false") {
        clicked++;
        gameData[clicked] = { back: back, img: backImg };
        gameData[clicked].back.closest(".flipper").style.transform =
          "rotateY(180deg)";
        gameData[clicked].back.setAttribute("data-revealed", true);
      }
      if (clicked === 2 && gameData[1].img === gameData[2].img) {
        gameStop = true;
        function dissapear() {
          gameData[1].back.style.display = "none";
          gameData[2].back.style.display = "none";
          gameData = {};
          clicked = 0;
          gameStop = false;
        }
        setTimeout(dissapear, 700);
        checkWin(flippers);
      }
      if (clicked === 2 && gameData[1].img !== gameData[2].img) {
        gameStop = true;
        score.textContent = Number(score.textContent) + 1;
        function hideCards() {
          for (const key in gameData) {
            let value = gameData[key].back;
            value.setAttribute("data-revealed", false);
            value.closest(".flipper").style.transform = "";
          }
          gameData = {};
          clicked = 0;
          gameStop = false;
        }

        setTimeout(hideCards, 1200);
      }
    });
  }
}

function checkWin(flippers) {
  let checkWin = [];
  for (let i = 0; i < flippers.length; i++) {
    checkWin.push(
      flippers[i].querySelector(".back").getAttribute("data-revealed")
    );
  }
  let result = checkWin.every((item) => item === "true");
  if (result) {
    end.style.display = "block";
    gameStop = true;
  }
}

let flippers, gameData, clicked, gameStop;

function newGame(obj) {
  end.style.display = "none";
  makeGrid(obj);
  flippers = document.querySelectorAll(".flipper");
  gameData = {};
  clicked = 0;
  gameStop = false;
  score.textContent = 0;
  flipCard(flippers);
}

// button.addEventListener("click", function () {
//   newGame();
// });

// newGame();
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function (e) {
    let diff = e.target.textContent;
    let obj;
    if (diff === "Easy") obj = gridMaker[16];
    if (diff === "Medium") obj = gridMaker[24];
    if (diff === "Hard") obj = gridMaker[36];
    newGame(obj);
  });
}
