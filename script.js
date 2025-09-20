const tg = window.Telegram.WebApp;
tg.expand();

let cart = [];
let selectedProduct = null;

const translations = {
  ru: {
    products: [
      { name: "Номер", desc: "Номер для тг, без спамблока, 2 месяца гарант", price: 50 },
      { name: "Поддержка", desc: "Товара пока нет, но можете поддержать автора", price: 10 }
    ],
    shop: "Магазин",
    cart: "Корзина",
    buy: "Купить",
    remove: "Удалить",
    confirmBuy: "Вы действительно хотите купить",
    yes: "Да",
    no: "Отмена",
    empty: "Корзина пуста",
    purchased: "Спасибо за покупку!"
  },
  be: {
    products: [
      { name: "Нумар", desc: "Нумар для тг, без спамблока, 2 месяцы гарантыя", price: 50 },
      { name: "Падтрымка", desc: "Тавару пакуль няма, але можаце падтрымаць аўтара", price: 10 }
    ],
    shop: "Крама",
    cart: "Кошык",
    buy: "Купіць",
    remove: "Выдаліць",
    confirmBuy: "Вы сапраўды хочаце купіць",
    yes: "Так",
    no: "Адмена",
    empty: "Кошык пусты",
    purchased: "Дзякуй за куплю!"
  },
  ua: {
    products: [
      { name: "Номер", desc: "Номер для тг, без спамблоку, 2 місяці гарантія", price: 50 },
      { name: "Підтримка", desc: "Товару поки немає, але можете підтримати автора", price: 10 }
    ],
    shop: "Магазин",
    cart: "Кошик",
    buy: "Купити",
    remove: "Видалити",
    confirmBuy: "Ви дійсно хочете купити",
    yes: "Так",
    no: "Скасувати",
    empty: "Кошик порожній",
    purchased: "Дякуємо за покупку!"
  },
  en: {
    products: [
      { name: "Number", desc: "Telegram number, no spam-block, 2 months warranty", price: 50 },
      { name: "Support", desc: "No product yet, but you can support the author", price: 10 }
    ],
    shop: "Shop",
    cart: "Cart",
    buy: "Buy",
    remove: "Remove",
    confirmBuy: "Do you really want to buy",
    yes: "Yes",
    no: "Cancel",
    empty: "Cart is empty",
    purchased: "Thanks for your purchase!"
  }
};

let currentLang = localStorage.getItem("lang") || "ru";

// показать товары
function renderProducts() {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "";

  translations[currentLang].products.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <p><b>${p.price}₽</b></p>
      <button onclick="addToCart('${p.name}')">${translations[currentLang].buy}</button>
    `;
    productsContainer.appendChild(div);
  });
}

// добавить в корзину
function addToCart(productName) {
  if (cart.some(item => item.name === productName)) {
    alert(`${productName} уже в корзине`);
    return;
  }
  const product = translations[currentLang].products.find(p => p.name === productName);
  cart.push(product);
  updateCartUI();
}

// показать магазин
function showShop() {
  document.getElementById("shop").classList.remove("hidden");
  document.getElementById("cart").classList.add("hidden");
  setActiveTab("shop-btn");
}

// показать корзину
function showCart() {
  document.getElementById("shop").classList.add("hidden");
  document.getElementById("cart").classList.remove("hidden");
  updateCartUI();
  setActiveTab("cart-btn");
}

// активная кнопка
function setActiveTab(id) {
  document.getElementById("shop-btn").classList.remove("active");
  document.getElementById("cart-btn").classList.remove("active");
  document.getElementById(id).classList.add("active");
}

// обновить корзину
function updateCartUI() {
  const cartContainer = document.getElementById("cart-items");
  document.getElementById("cart-title").innerText = translations[currentLang].cart;
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p>${translations[currentLang].empty}</p>`;
    return;
  }

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <h4>${item.name}</h4>
      <p>${item.desc}</p>
      <div class="cart-buttons">
        <button class="buy" onclick="confirmBuyPrompt('${item.name}')">${translations[currentLang].buy}</button>
        <button class="remove" onclick="removeFromCart(${index})">${translations[currentLang].remove}</button>
      </div>
    `;
    cartContainer.appendChild(div);
  });
}

// удалить
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

// подтверждение
function confirmBuyPrompt(product) {
  selectedProduct = product;
  document.getElementById("confirm-text").innerText =
    `${translations[currentLang].confirmBuy} ${product}?`;
  document.querySelector("#confirm-box .confirm").innerText = translations[currentLang].yes;
  document.querySelector("#confirm-box .cancel").innerText = translations[currentLang].no;
  document.getElementById("confirm-box").classList.remove("hidden");
}

// обработка подтверждения
function confirmBuy(agree) {
  document.getElementById("confirm-box").classList.add("hidden");

  if (agree) {
    tg.sendData(JSON.stringify({ action: "buy", product: selectedProduct }));
    alert(translations[currentLang].purchased);
  }
}

// ⚙️ кнопка шестерёнки
document.querySelector(".settings-btn").addEventListener("click", () => {
  document.querySelector(".settings-modal").classList.toggle("hidden");
});

// сохранить язык
document.getElementById("save-lang").addEventListener("click", () => {
  const lang = document.getElementById("language-select").value;
  currentLang = lang;
  localStorage.setItem("lang", lang);
  renderProducts();
  updateCartUI();
  document.getElementById("shop-btn").textContent = translations[currentLang].shop;
  document.getElementById("cart-btn").textContent = translations[currentLang].cart;
  document.querySelector(".settings-modal").classList.add("hidden");
});

// загрузка
renderProducts();
showShop();
