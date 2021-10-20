"use strict";
const wholeMenu = {};
const tableArea = document.querySelector(".content-table");
const container = document.querySelector(".container");
const popUp = document.querySelector(".pop-up");
const makeNewPizza = document.querySelector(".make-new");
const addToOrderForm = document.querySelector(".add-order");
const finalSubmitForm = document.querySelector(".final-submit");
const overlay = document.querySelector(".overlay");
const closePopUpBtn = document.querySelector(".close-pop-up");
const createNewBtn = document.querySelector(".create-new");
let checkedIngs = 0;
const ingredientsArea = popUp.querySelector(".ing-checks");
const allPricesForNew = makeNewPizza.querySelectorAll("span");
const orderListLeft = document.querySelector(".order-list");
const finalOrderList = document.querySelector(".list");
const allOrders = {};
let selected;
let priceTag = addToOrderForm.querySelector(".pprice");
const expanderBtn = document.querySelector(".expander");
let valueCount = document.getElementById("quantity");
const addToMenuBtn = document.querySelector(".add-to-menu");
let tempPizzaContainer = { pname: "", pings: [], ps: "", pm: "", pl: "" };
const addToCart = addToOrderForm.querySelector(".add-to-cart");

class Pizza {
  allIngs = [
    "Mushrooms",
    "Onion",
    "Bacon",
    "Cheese",
    "Ham",
    "Salami",
    "Jalapeno",
    "Mozzarella",
    "Olives",
    "Corn",
    "Garlic",
    "Arugula",
    "Peas",
    "Sauce",
    "Sausage",
  ];
  constructor(name, ingredients, small, medium, large) {
    this.name = name;
    this.ings = ingredients;
    this.s = small;
    this.m = medium;
    this.l = large;
    this.num = ++Pizza.counter;
    this.initIngs();
    this.initAddToMenu();
    this.initAddToWebsite();
  }

  initIngs() {
    for (let i = 0; i < this.ings.length; i++) {
      this.ings[i] = this.allIngs[this.ings[i]];
    }
  }

  initAddToMenu() {
    wholeMenu[`Pizza${this.num}`] = this;
  }

  initAddToWebsite() {
    tableArea.querySelector("tbody").insertAdjacentHTML(
      "beforeend",
      `<tr>
                <td>
                  ${this.name}<br /><span class="ingredients"
                    >${this.ings.join(", ")}</span>
                </td>
                <td class="fontbold">${this.s}$</td>
                <td class="fontbold">${this.m}$</td>
                <td class="fontbold">${this.l}$</td>
                <td><img src="styles/add.png" width="30px"></td>
              </tr>`
    );
  }

  information() {
    console.log(
      `Name of your pizza: ${this.name}
Number of your pizza: ${this.num}
Ingredients: ${this.ings.join(", ")}
Prices
Small: ${this.s}$
Medium: ${this.m}$
Large: ${this.l}$`
    );
  }

  static sizes() {
    console.log(
      `Small:30cm
Medium:40cm
Large:52cm`
    );
  }

  showAllIngs() {
    this.allIngs.forEach(function (element, index) {
      console.log(`${index + 1}: ${element}`);
    });
  }
}
Pizza.counter = 0;
Pizza.makeYourOwn = {
  3: { s: 26, m: 34, l: 46 },
  4: { s: 28, m: 36, l: 48 },
  5: { s: 30, m: 38, l: 50 },
};

const pizza1 = new Pizza("Margerita", [3, 13], 10, 15, 20);
const pizza2 = new Pizza("Capricciosa", [4, 0], 12, 16, 22);
const pizza3 = new Pizza("Italiano", [5, 8], 12, 16, 22);
const pizza4 = new Pizza("Riviera", [0, 2, 1, 14], 13, 17, 23);
const pizza5 = new Pizza("Mafiozo", [5, 6, 7, 11], 14, 18, 24);
const pizza6 = new Pizza("Wege", [0, 1, 7, 9, 12], 14, 18, 24);
const pizza7 = new Pizza("Primavera", [5, 2, 10, 1, 11], 15, 19, 25);
// const pizza8 = new Pizza("CustomPizza", [5, 2, 4, 1, 11], 15, 19, 25);

// Pizza.sizes(); //works
// pizza1.showAllIngs(); //works
// pizza1.information(); //works
// console.log(wholeMenu);

createNewBtn.addEventListener("click", createNew);

function createNew(e) {
  e.stopPropagation();
  openPU();
  makeNewPizza.classList.toggle("hide");
  if (ingredientsArea.children.length === 0) {
    pizza1.allIngs.forEach(function (elem) {
      ingredientsArea.insertAdjacentHTML(
        "beforeend",
        `<div class="flex--item"><input type="checkbox" name="${elem}">
           <label for="${elem}">${elem}</label></div>`
      );
    });
  }
}

ingredientsArea.addEventListener("click", function (e) {
  e.stopPropagation();
  if (e.target.type === "checkbox" && e.target.checked) {
    checkedIngs++;
    tempPizzaContainer.pings.push(e.target.name);
  } else if (e.target.type === "checkbox" && !e.target.checked) {
    checkedIngs--;
    let removeIndex;
    removeIndex = tempPizzaContainer.pings.indexOf(e.target.name);
    tempPizzaContainer.pings.splice(removeIndex, 1);
  }
  if (checkedIngs > 2 && checkedIngs < 6) {
    allPricesForNew[0].textContent = `${Pizza.makeYourOwn[checkedIngs].s} $`;
    allPricesForNew[1].textContent = `${Pizza.makeYourOwn[checkedIngs].m} $`;
    allPricesForNew[2].textContent = `${Pizza.makeYourOwn[checkedIngs].l} $`;
    tempPizzaContainer.ps = Pizza.makeYourOwn[checkedIngs].s;
    tempPizzaContainer.pm = Pizza.makeYourOwn[checkedIngs].m;
    tempPizzaContainer.pl = Pizza.makeYourOwn[checkedIngs].l;
  } else {
    allPricesForNew[0].textContent =
      allPricesForNew[1].textContent =
      allPricesForNew[2].textContent =
        "";
    tempPizzaContainer.ps = tempPizzaContainer.pm = tempPizzaContainer.pl = "";
  }
});

addToMenuBtn.addEventListener("click", function () {
  if (
    tempPizzaContainer.pings.length < 3 ||
    tempPizzaContainer.pings.length > 5
  ) {
    alert("Pick 3 to 5 ingredients.");
    return;
  }

  for (let i = 0; i < tempPizzaContainer.pings.length; i++) {
    tempPizzaContainer.pings[i] = pizza1.allIngs.indexOf(
      tempPizzaContainer.pings[i]
    );
  }
  new Pizza(
    `CustomPizza${Pizza.counter + 1}`,
    tempPizzaContainer.pings,
    tempPizzaContainer.ps,
    tempPizzaContainer.pm,
    tempPizzaContainer.pl
  );
  Array.from(tableArea.getElementsByTagName("img")).forEach((elem) =>
    elem.addEventListener("click", addNewOrder)
  );
  closePU();
});

class Order {
  constructor(pizzaname, amount, price, size, subtotal) {
    this.pizzaname = pizzaname;
    this.amount = amount;
    this.price = price;
    this.size = size;
    this.subtotal = subtotal;
    this.num = ++Order.counter;
    this.addToAllOrders();
    this.countTotal();
    this.addToSidebar();
  }

  addToAllOrders() {
    allOrders[`Order${this.num}`] = this;
  }

  countTotal() {
    Order.total += this.subtotal;
    document.querySelector(".total").textContent = `${Order.total}$`;
  }

  addToSidebar() {
    orderListLeft.insertAdjacentHTML(
      "beforeend",
      `<div class="single-order Order${this.num} display-flex-r">
      <p>🍕${this.pizzaname} Size: ${this.size} <br />Amount: ${
        this.amount
      } Total: ${this.amount}*${this.price}$ = ${this.amount * this.price}$</p>
      <button class="delete"><img src="styles/delete.png" width="20px"></button>
      </div>`
    );
  }

  deleteFromSidebar() {
    Order.total -= this.subtotal;
    document.querySelector(".total").textContent = `${Order.total}$`;
    delete allOrders[`Order${this.num}`];
  }
}

Order.counter = 0;
Order.total = 0;

// new Order("CustomPizza", 3, 22, "L", 66);
// new Order("Margarrita", 14, 12, "M", 168);

document.querySelector(".order-list").addEventListener("click", removeOrder);

function removeOrder(e) {
  if (e.target.tagName === "IMG" || e.target.classList.contains("delete")) {
    let temp = e.target.closest("div");
    allOrders[temp.classList[1]].deleteFromSidebar();
    temp.remove();
  }
}

Array.from(tableArea.getElementsByTagName("img")).forEach((elem) =>
  elem.addEventListener("click", addNewOrder)
);

function addNewOrder() {
  selected =
    this.parentNode.parentNode.childNodes[1].firstChild.textContent.trim();
  openPU();
  selected = getKeyByValue(wholeMenu, selected);
  addToOrderForm.classList.toggle("hide");
  addToOrderForm.querySelector(".pname").textContent = wholeMenu[selected].name;
  addToOrderForm.querySelector(".pings").textContent =
    wholeMenu[selected].ings.join(", ");
  priceTag.textContent = wholeMenu[selected].l;
  updateFullPrice();
}

addToOrderForm.querySelector("#sizes").addEventListener("change", function () {
  priceTag.textContent = wholeMenu[selected][this.value];
  updateFullPrice();
});

addToCart.addEventListener("click", addToSide);

function addToSide() {
  new Order(
    wholeMenu[selected].name,
    Number(valueCount.value),
    Number(priceTag.textContent),
    addToOrderForm.querySelector("#sizes").value.toUpperCase(),
    Number(valueCount.value) * Number(priceTag.textContent)
  );
  closePU();
}

function updateFullPrice() {
  document.querySelector(".ptotal").textContent = `${
    Number(priceTag.textContent) * Number(valueCount.value)
  } $`;
}

document.querySelector(".submit-order").addEventListener("click", finalForm);
function finalForm(e) {
  if (Object.keys(allOrders).length === 0) {
    alert("No Orders to Submit!");
  } else {
    openPU();
    finalSubmitForm.classList.toggle("hide");
    for (let i = 1; i <= Object.keys(allOrders).length; i++) {
      finalOrderList.insertAdjacentHTML(
        "beforeend",
        `<p>${i}</p>
      <p>${allOrders[Object.keys(allOrders)[i - 1]].pizzaname}</p>
      <p>${allOrders[Object.keys(allOrders)[i - 1]].size}</p>
      <p>${allOrders[Object.keys(allOrders)[i - 1]].amount}</p>
      <p>${allOrders[Object.keys(allOrders)[i - 1]].subtotal}$</p>
      <hr>`
      );
    }
    document.querySelector(".final-total").textContent = `${Order.total} $`;
  }
}

document.querySelector(".send-mail").addEventListener("click", sendInfo);

function sendInfo() {
  let emailf = document.querySelector('input[placeholder="E-mail"]').value;
  let phonef = document.querySelector('input[placeholder="Phone"]').value;
  let addressf = document.querySelector('input[placeholder="Address"]').value;
  if (!addressf.trim()) {
    alert("Please input anything in address field");
    return;
  }
  let tempParams = {
    Order_details: convertToText(allOrders),
    total: Order.total,
    email: emailf,
    phone: phonef,
    address: addressf,
  };
  emailjs
    .send("service_izcsorz", "template_8ab01yd", tempParams)
    .then(function (res) {
      console.log("success", res.status);
      alert("Email has been sent. Page will now reload.");
    })
    .then(function () {
      window.location.reload(true);
    });
}

// Quantity btns (2 funcs)
document.querySelector(".minus-btn").setAttribute("disabled", "disabled");
document.querySelector(".minus-btn").addEventListener("click", function () {
  valueCount.value = Number(valueCount.value) - 1;
  if (Number(valueCount.value) == 1) {
    document.querySelector(".minus-btn").setAttribute("disabled", "disabled");
  }
  updateFullPrice();
});

document.querySelector(".plus-btn").addEventListener("click", function () {
  valueCount.value = Number(valueCount.value) + 1;
  if (Number(valueCount.value) > 1) {
    document.querySelector(".minus-btn").removeAttribute("disabled");
    document.querySelector(".minus-btn").classList.remove("disabled");
  }
  updateFullPrice();
});

expanderBtn.addEventListener("click", expand);

function expand() {
  this.classList.toggle("hidden");
  if (this.classList.contains("hidden")) {
    this.parentNode.style.left = "100vw";
    this.parentNode.style.width = "0vw";
    setTimeout(function () {
      expanderBtn.previousElementSibling.style.display = "none";
    }, 10);
  } else {
    this.parentNode.style.left = "80vw";
    this.parentNode.style.width = "20vw";
    setTimeout(function () {
      expanderBtn.previousElementSibling.style.display = "block";
    }, 380);
  }
}

closePopUpBtn.addEventListener("click", closePU);
overlay.addEventListener("click", closePU);

function openPU(e) {
  popUp.classList.toggle("hide");
  overlay.classList.toggle("hide");
}

function closePU(e) {
  if (!makeNewPizza.classList.contains("hide")) {
    tempPizzaContainer = { pname: "", pings: [], ps: "", pm: "", pl: "" };
    checkedIngs = 0;
    let checkboxes = document.querySelectorAll("input[type=checkbox]");
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
    allPricesForNew[0].textContent = "";
    allPricesForNew[1].textContent = "";
    allPricesForNew[2].textContent = "";
    makeNewPizza.classList.toggle("hide");
  }
  if (!addToOrderForm.classList.contains("hide")) {
    document.querySelector(".minus-btn").setAttribute("disabled", "disabled");
    document.getElementById("quantity").value = 1;
    document.querySelector("#sizes").value = "l";
    addToOrderForm.classList.toggle("hide");
  }
  if (!finalSubmitForm.classList.contains("hide")) {
    finalSubmitForm.classList.toggle("hide");
    finalOrderList.innerHTML = "";
  }
  popUp.classList.toggle("hide");
  overlay.classList.toggle("hide");
}

function convertToText() {
  let text = "";
  for (let elem of Object.values(allOrders)) {
    if (elem.pizzaname.startsWith("Custom")) {
      let customIngsToMail = getKeyByValue(wholeMenu, elem.pizzaname);
      text += `Pizza Name: ${elem.pizzaname}, Amount: ${elem.amount}, Size: ${
        elem.size
      }, <br>Custom Ingredients: ${wholeMenu[customIngsToMail].ings.join(
        ", "
      )}<br>`;
    } else {
      text += `Pizza Name: ${elem.pizzaname}, Amount: ${elem.amount}, Size: ${elem.size}<br>`;
    }
  }
  return text;
}
convertToText(allOrders);
function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key].name === value);
}

// console.log(objectdsa);
// delete objectdsa.o1
// console.log(objectdsa);

// document.addEventListener("click", function (e) {
//   console.log(e.target);
//   if (e.target.textContent === "Create New") console.log("CN");
//   if (e.target.tagName === "IMG") console.log("ATC");
// });

// for (let elem of Object.values(allOrders)) {
//   Order.total += elem.subtotal;
// }
