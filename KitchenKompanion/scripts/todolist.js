const inventoryList = document.getElementById("inventory-list");
const itemNameInput = document.getElementById("item-name");
const quantityInput = document.getElementById("item-quantity");
const locationInput = document.getElementById("item-location");
const expirationInput = document.getElementById("item-expiration");
const addButton = document.querySelector(".row button");
const unitSelect = document.getElementById("item-unit");


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
  const quantity = `${quantityInput.value.trim()} ${unitSelect.value}`;
  const location = locationInput.value;
  const expiration = expirationInput.value;

if (!name || !quantity || location === "" || !expiration) {
  alert("Please fill in all fields.");
  return;
}


  const li = document.createElement("li");
  li.className = "inventory-item";
li.innerHTML = `
  ${name} - <span class="item-quantity">${quantity}</span> - ${location} -
  <span class="expiration">${expiration}</span>
  <span class="remove-btn" style="cursor: pointer; color: red;">&times;</span>
  <button class="to-grocery">Add to Grocery List</button>
`;


  inventoryList.appendChild(li);

  // Wizard mode
  if (currentIndex < transferredItems.length) {
    currentIndex++;
    startWizard();
  } else {
    clearInputs();
  }
li.innerHTML = `
  ${name} - <span class="item-quantity">${quantity}</span> - ${location} -
  <span class="expiration">${expiration}</span>
  <span class="remove-btn" style="cursor: pointer; color: red;">&times;</span>
  <button class="to-grocery">Add to Grocery List</button>
`;



  saveInventory();

}

function saveInventory() {
  const items = [];
  const listItems = document.querySelectorAll(
    "#inventory-list .inventory-item"
  );

  listItems.forEach((li) => {
    const text = li.textContent;
    const [namePart, quantityPart, locationPart] = text.split(" - ");
    const name = namePart.trim();
    const quantity =
      li.querySelector(".item-quantity")?.textContent.trim() || "";
    const location = locationPart?.split(" - ")[0]?.trim();
    const expiration = li.querySelector(".expiration").textContent;

    items.push({
      text: `${name} - ${quantity} units - ${location}`,
      expiration,
    });
  });

  localStorage.setItem("savedInventory", JSON.stringify(items));
}


function loadInventory() {
  const saved = JSON.parse(localStorage.getItem("savedInventory")) || [];

  saved.forEach((item) => {
    const li = document.createElement("li");
    li.className = "inventory-item";

    const parts = item.text.split(" - ");
    const name = parts[0];
    const quantity = parts[1].replace(" units", "");
    const location = parts[2];

 li.innerHTML = `
  ${name} - <span class="item-quantity">${quantity}</span> - ${location} -
  <span class="expiration">${expiration}</span>
  <span class="remove-btn" style="cursor: pointer; color: red;">&times;</span>
  <button class="to-grocery">Add to Grocery List</button>
`;



    inventoryList.appendChild(li);
  });

  const locationFilter = document.getElementById("location-filter");
  locationFilter.addEventListener("change", filterInventoryByLocation);

  function filterInventoryByLocation() {
    const selected = locationFilter.value.toLowerCase();
    const items = document.querySelectorAll("#inventory-list .inventory-item");
    items.forEach((item) => {
      const location = item.textContent.toLowerCase();
      item.style.display =
        selected === "" || location.includes(selected) ? "" : "none";
    });
  }

}


function clearInputs() {
  itemNameInput.value = "";
  quantityInput.value = "";
  locationInput.selectedIndex = 0; // Reset to "Select a location"
  expirationInput.value = "";
}




loadInventory();



// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
inventoryList.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-btn")) {
    e.target.parentElement.remove();
    saveInventory();
  }

  if (e.target.classList.contains("item-quantity")) {
    const currentQuantity = e.target.textContent;
    const newQuantity = prompt("Enter new quantity:", currentQuantity);
    if (newQuantity !== null && newQuantity.trim() !== "") {
      e.target.textContent = newQuantity.trim();
      saveInventory();
    }
  }

  if (e.target.classList.contains("to-grocery")) {
    const li = e.target.closest("li");
    const itemText = li.textContent.split("-")[0].trim(); // Get item name
    addToGroceryList(itemText);
  }

});
function myFunction() {
  const input = document.getElementById("myInput");
  const filter = input.value.toUpperCase();
  const ul = document.getElementById("inventory-list");
  const li = ul.getElementsByTagName("li");

  for (let i = 0; i < li.length; i++) {
    const txtValue = li[i].textContent || li[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}


document.getElementById("add-location-btn").addEventListener("click", () => {
  const newLocation = prompt("Enter new storage location:");
  if (newLocation) {
    const locationSelect = document.getElementById("item-location");

    // Prevent duplicates
    const exists = Array.from(locationSelect.options).some(
      (opt) => opt.value.toLowerCase() === newLocation.toLowerCase()
    );
    if (!exists) {
      const option = document.createElement("option");
      option.value = newLocation;
      option.textContent = newLocation;
      locationSelect.appendChild(option);
    }

    // Optional: Auto-select the newly added location
    locationSelect.value = newLocation;
  }
  saveLocation(newLocation);

});


// Load custom locations on page load
function loadLocations() {
  const saved = JSON.parse(localStorage.getItem("customLocations")) || [];
  const locationSelect = document.getElementById("item-location");
  const filterOption = document.createElement("option");
  filterOption.value = loc;
  filterOption.textContent = loc;
  document.getElementById("location-filter").appendChild(filterOption);


  saved.forEach(loc => {
    const option = document.createElement("option");
    option.value = loc;
    option.textContent = loc;
    locationSelect.appendChild(option);
  });
}

// Save new location
function saveLocation(newLocation) {
  const saved = JSON.parse(localStorage.getItem("customLocations")) || [];
  if (!saved.includes(newLocation)) {
    saved.push(newLocation);
    localStorage.setItem("customLocations", JSON.stringify(saved));
  }
}
loadLocations();


function addToGroceryList(itemName) {
  const groceryList = JSON.parse(localStorage.getItem("groceryList")) || [];
  groceryList.push({ name: itemName, checked: false });
  localStorage.setItem("groceryList", JSON.stringify(groceryList));
  alert(`${itemName} added to grocery list.`);
}
