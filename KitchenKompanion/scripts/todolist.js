//DOM Elements
const inventoryList = document.getElementById("inventory-list");
const itemNameInput = document.getElementById("item-name");
const quantityInput = document.getElementById("item-quantity");
const locationInput = document.getElementById("item-location");
const expirationInput = document.getElementById("item-expiration");
const addButton = document.querySelector(".row button");
const unitSelect = document.getElementById("item-unit");
const locationFilter = document.getElementById("location-filter");

// Wizard Mode (Transferred Items from Grocery List)
let transferredItems = JSON.parse(localStorage.getItem("inventoryItems")) || [];
let currentIndex = 0;

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


//Add inventory items 
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
    ${name} <span class="item-quantity editable-quantity">${quantity}</span>
 ${location} 
    <span class="expiration">${expiration}</span>
    <span class="remove-btn" style="cursor: pointer; color: red;">&times;</span>
  `;

  inventoryList.appendChild(li);

  if (currentIndex < transferredItems.length) {
    currentIndex++;
    startWizard();
  } else {
    clearInputs();
  }

  saveInventory();
}



//Save and load inventory

function saveInventory() {
  const items = [];
  const listItems = document.querySelectorAll(
    "#inventory-list .inventory-item"
  );

  listItems.forEach((li) => {
    const name = li.childNodes[0].textContent.trim();
    const quantity =
      li.querySelector(".item-quantity")?.textContent.trim() || "";
    const location = li.childNodes[2]?.textContent.trim() || "";
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
      ${name}  <span class="item-quantity editable-quantity">${quantity}</span>  ${location} 

      <span class="expiration">${item.expiration}</span>
      <span class="remove-btn" style="cursor: pointer; color: red;">&times;</span>
    `;

    inventoryList.appendChild(li);
  });

  locationFilter.addEventListener("change", filterInventoryByLocation);
  locationFilter.addEventListener("change", renderItems);

}


function filterInventoryByLocation() {
  const selected = locationFilter.value.toLowerCase();
  const items = document.querySelectorAll("#inventory-list .inventory-item");

  items.forEach((item) => {
    const location = item.textContent.toLowerCase();
    item.style.display =
      selected === "" || location.includes(selected) ? "" : "none";
  });
}


//clear inputs 

function clearInputs() {
  itemNameInput.value = "";
  quantityInput.value = "";
  locationInput.selectedIndex = 0;
  expirationInput.value = "";
}


//Search filter

function myFunction() {
  const input = document.getElementById("myInput");
  const filter = input.value.toUpperCase();
  const li = inventoryList.getElementsByTagName("li");

  for (let i = 0; i < li.length; i++) {
    const txtValue = li[i].textContent || li[i].innerText;
    li[i].style.display =
      txtValue.toUpperCase().indexOf(filter) > -1 ? "" : "none";
  }
}


//Locations add,load,save

document.getElementById("add-location-btn").addEventListener("click", () => {
  const newLocation = prompt("Enter new storage location:");
  if (newLocation) {
    const exists = Array.from(locationInput.options).some(
      (opt) => opt.value.toLowerCase() === newLocation.toLowerCase()
    );

    // Only add new location if it doesn't already exist
    if (!exists) {
      const option = document.createElement("option");
      option.value = newLocation;
      option.textContent = newLocation;
      locationInput.appendChild(option);

      // Update the filter dropdown too
      const filterOption = document.createElement("option");
      filterOption.value = newLocation;
      filterOption.textContent = newLocation;
      locationFilter.appendChild(filterOption);

      // Save the new location to localStorage
      saveLocation(newLocation);
    }

    // Set the new location as selected in the location input
    locationInput.value = newLocation;
  }
});


function saveLocation(newLocation) {
  const saved = JSON.parse(localStorage.getItem("customLocations")) || [];

  // Avoid duplicates in localStorage
  if (!saved.includes(newLocation)) {
    saved.push(newLocation);
    localStorage.setItem("customLocations", JSON.stringify(saved));
  }
}


function loadLocations() {
  const savedLocations =
    JSON.parse(localStorage.getItem("customLocations")) || [];
  const locations = ["Fridge", "Freezer", "Pantry", ...savedLocations];

  // Clear existing options
  locationFilter.innerHTML = '<option value="">All Locations</option>'; // Add the default "All Locations" option

  // Add the locations to the filter dropdown
  locations.forEach((loc) => {
    const option = document.createElement("option");
    option.value = loc;
    option.textContent = loc;
    locationFilter.appendChild(option);
  });
}



//grocery list

function transferToGroceryList() {
  const checkedItems = [];

  document.querySelectorAll("#inventory-container li.checked").forEach((li) => {
    checkedItems.push({ name: li.textContent.replace("×", "").trim() });
    li.remove(); // optional: remove from inventory list
  });

  // Get existing grocery list data
  const existingList = JSON.parse(localStorage.getItem("groceryItems")) || [];

  // Append new items
  const updatedList = [...existingList, ...checkedItems];

  // Save back to localStorage
  localStorage.setItem("groceryItems", JSON.stringify(updatedList));

  saveData(); // if this updates UI or other state
  window.location.href = "grocerylist.html"; // redirect to grocery list
}


//inventory click list 

inventoryList.addEventListener("click", function (e) {
  const li = e.target.closest("li");

  if (e.target.classList.contains("remove-btn")) {
    li.remove();
    saveInventory();
  }

  if (e.target.classList.contains("item-quantity")) {
    const newQuantity = prompt("Enter new quantity:", e.target.textContent);
    if (newQuantity?.trim()) {
      e.target.textContent = newQuantity.trim();
      saveInventory();
    }
  }

  if (e.target.classList.contains("to-grocery")) {
    const itemText = li.textContent.split("-")[0].trim();
    addToGroceryList(itemText);
  }
});


function renderItems() {
  const itemList = document.getElementById("item-list");
  itemList.innerHTML = "";

  const items = loadItems(); // get all items
  const selectedLocation = locationFilter.value;

  // Sort items: selected location items go first
  items.sort((a, b) => {
    if (selectedLocation === "") return 0; // No sorting if "All Locations"
    if (a.location === selectedLocation && b.location !== selectedLocation)
      return -1;
    if (a.location !== selectedLocation && b.location === selectedLocation)
      return 1;
    return 0;
  });

  //render inventory
  function renderInventory() {
  const inventoryList = document.getElementById("inventory-list");
  inventoryList.innerHTML = ""; // clear old items
  const inventoryItems = JSON.parse(localStorage.getItem("inventoryItems")) || [];

  inventoryItems.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ${item.quantity} ${item.unit}`;

    // ADD THIS BUTTON
    const addButton = document.createElement("button");
    addButton.textContent = "+";
    addButton.className = "small-transfer-button";
    addButton.style.marginLeft = "10px";
    addButton.onclick = () => {
      const groceryItems = JSON.parse(localStorage.getItem("groceryItems")) || [];
      groceryItems.push({ name: item.name });
      localStorage.setItem("groceryItems", JSON.stringify(groceryItems));
    };

    li.appendChild(addButton);
    inventoryList.appendChild(li);
  });
}


  // Filter and render
  items.forEach((item, index) => {
    const matchesFilter =
      !selectedLocation || item.location === selectedLocation;
    if (matchesFilter || selectedLocation === "") {
      const li = document.createElement("li");
      li.textContent = `${item.name} - ${item.location} - ${item.expiration}`;
      itemList.appendChild(li);
    }
  });
}


// Close dropdowns when clicking outside
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    Array.from(dropdowns).forEach(dropdown => {
      if (dropdown.classList.contains("show")) {
        dropdown.classList.remove("show");
      }
    });
  }
};

//load locations logic

function loadLocations() {
  const savedLocations =
    JSON.parse(localStorage.getItem("customLocations")) || [];
  const locations = ["Fridge", "Freezer", "Pantry", ...savedLocations];

  // Clear existing options
  locationFilter.innerHTML = '<option value="">All Locations</option>';

  locations.forEach((loc) => {
    const option = document.createElement("option");
    option.value = loc;
    option.textContent = loc;
    locationFilter.appendChild(option);
  });
}

//filter for location 
function filterInventoryByLocation() {
  const selectedLocation = locationFilter.value.toLowerCase(); // Get the selected location
  const items = document.querySelectorAll("#inventory-list .inventory-item"); // All items in the list

  items.forEach((item) => {
    const itemLocation = item
      .querySelector(".item-location")
      .textContent.toLowerCase();
    item.style.display =
      selectedLocation === "" || itemLocation.includes(selectedLocation)
        ? ""
        : "none";
  });
}

//rest logic 

document.getElementById("reset-app-btn").addEventListener("click", () => {
  if (
    confirm(
      "Are you sure you want to reset the app? This will remove all saved data."
    )
  ) {
    localStorage.clear();
    location.reload();
  }
});


//final setup

loadInventory();
loadLocations();
loadLocations();
renderItems();
