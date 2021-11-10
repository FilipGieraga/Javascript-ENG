"use strict";
const resultsDiv = document.querySelector(".results");
let currentBooksSearch;
const searchBtn = document.querySelector(".btn-search");

async function getDataFromURL(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}

(() => {
  const selectOptions = getDataFromURL(
    "https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=ZpkKcJDaEMBcN0fDJl90LgoHskzEGM49"
  );
  const selectFormClass = document.querySelector(".form-select");
  selectOptions.then((data) => {
    data.forEach((elem) =>
      selectFormClass.insertAdjacentHTML(
        "beforeend",
        `<option value="${elem.list_name_encoded}">${elem.display_name}</option>`
      )
    );
  });
})();

function searchForBooks(type, date = "current") {
  resultsDiv.innerHTML = "";
  const books = getDataFromURL(
    `https://api.nytimes.com/svc/books/v3/lists/${date}/${type}.json?api-key=ZpkKcJDaEMBcN0fDJl90LgoHskzEGM49`
  );
  currentBooksSearch = books;

  books
    .then((data) => {
      data.books.forEach((el) => {
        resultsDiv.insertAdjacentHTML(
          "beforeend",
          `
      <div class="card mx-3 mb-4" data-bs-toggle="modal" data-bs-target="#exampleModal" style="border:none; width: 250px; min-width: 200px; cursor: pointer;">
        <img src="${el.book_image}" class="img-fluid">
          <div class="card-body" style="background-color: var(--nyellow);">
            <h5 class="card-title text-center">${el.title}</h5>
            <p class="card-text mb-0 text-center">Author: ${el.author}</p>
            <p class="rank card-text text-end">#${el.rank}</p>
          </div>
      </div>
      `
        );
      });
    })
    .catch((err) => {
      resultsDiv.insertAdjacentHTML(
        "afterbegin",
        `
    <div class="alert alert-danger text-center" role="alert">
    Something went wrong. Please try again.
    </div>`
      );
    });
}

function displayInfo(e) {
  let rank = e.target
    .closest(".card")
    .querySelector(".rank")
    .textContent.slice(1);
  const modal = document.querySelector("#exampleModal");
  const modalBody = modal.querySelector(".modal-body");
  rank = Number(rank) - 1;
  currentBooksSearch.then((data) => {
    modal.querySelector(
      ".modal-title"
    ).textContent = `TITLE: ${data.books[rank].title}`;
    modalBody.children[0].textContent = `Author: ${data.books[rank].author}`;
    modalBody.children[1].textContent = `Description: ${data.books[rank].description}`;
    modalBody.children[2].textContent = `Publisher: ${data.books[rank].publisher}`;
    modalBody.children[3].textContent = `Rank: ${data.books[rank].rank}`;
    modalBody.children[4].textContent = `Weeks on bestsellers list: ${data.books[rank].weeks_on_list}`;
    modalBody.querySelector(
      "a"
    ).href = `${data.books[rank].amazon_product_url}`;
  });
}

function applySearch(e) {
  let searchDate = document.querySelector(".date-search");
  const searchType = document.querySelector(".type-search").value;
  if (!searchDate.value.trim()) {
    searchForBooks(searchType);
  }
  if (searchDate.value.trim()) {
    searchForBooks(searchType, searchDate.value);
  }
  searchDate.value = "";
}

searchBtn.addEventListener("click", applySearch);
resultsDiv.addEventListener("click", displayInfo);
