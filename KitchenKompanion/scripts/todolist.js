const inventoryList = document.getElementById("inventory-list");
const itemNameInput = document.getElementById("item-name");
const quantityInput = document.getElementById("item-quantity");
const locationInput = document.getElementById("item-location");
const expirationInput = document.getElementById("item-expiration");
const addButton = document.querySelector(".row button");

// Load items transferred from grocery list (only checked ones)
let transferredItems = JSON.parse(localStorage.getItem("inventoryItems")) || [];
let currentIndex = 0;

// Wizard mode kicks in if there are transferred items
if (transferredItems.length > 0) {
  startWizard();
}

function startWizard() {
  if (currentIndex >= transferredItems.length) {
    endWizard();
    return;
  }

  const item = transferredItems[currentIndex];
  itemNameInput.value = item.name;
  quantityInput.value = "";
  locationInput.value = "";
  expirationInput.value = "";

  addButton.textContent = "Next";
}

function endWizard() {
  transferredItems = [];
  currentIndex = 0;
  localStorage.removeItem("inventoryItems");
  clearInputs();
  addButton.textContent = "+ Add";
}

function addItem() {
  const name = itemNameInput.value.trim();
  const quantity = quantityInput.value.trim();
  const location = locationInput.value.trim();
  const expiration = expirationInput.value;

  if (!name || !quantity || !location || !expiration) {
    alert("Please fill in all fields.");
    return;
  }

  const li = document.createElement("li");
  li.className = "inventory-item";
  li.innerHTML = `
    ${name} - ${quantity} units - ${location} -
    <span class="expiration">${expiration}</span>
    </span>
    <span class="remove-btn" style="cursor: pointer; color: red;">&times;</span>
  `;
  inventoryList.appendChild(li);

  // Wizard mode
  if (currentIndex < transferredItems.length) {
    currentIndex++;
    startWizard();
  } else {
    clearInputs();
  }

  saveInventory();

}

function saveInventory() {
  const items = [];
  const listItems = document.querySelectorAll(
    "#inventory-list .inventory-item"
  );

  listItems.forEach((li) => {
    const text = li.childNodes[0].textContent.trim(); // name - quantity - location -
    const expiration = li.querySelector(".expiration").textContent;
    items.push({ text, expiration });
  });

  localStorage.setItem("savedInventory", JSON.stringify(items));
}

function loadInventory() {
  const saved = JSON.parse(localStorage.getItem("savedInventory")) || [];
  saved.forEach((item) => {
    const li = document.createElement("li");
    li.className = "inventory-item";
    li.innerHTML = `${item.text} <span class="expiration">${item.expiration}</span>`;
    inventoryList.appendChild(li);
  });
}


function clearInputs() {
  itemNameInput.value = "";
  quantityInput.value = "";
  locationInput.value = "";
  expirationInput.value = "";
}

// Hook the button to addItem function
addButton.onclick = addItem;
inventoryList.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-btn")) {
    e.target.parentElement.remove();
  }
});

loadInventory();


