// Get elements
const addRecipeButton = document.querySelector('.add-recipe-button');
const recipeFormContainer = document.getElementById('recipeFormContainer');
const formOverlay = document.getElementById('formOverlay');
const closeFormButton = document.getElementById('closeForm');
const recipeForm = document.getElementById('recipeForm');
const recipeList = document.getElementById('recipeList');
const searchInput = document.querySelector('.search-bar input[type="search"]');
const ingredientsContainer = document.getElementById('ingredientsContainer');
const addIngredientButton = document.getElementById('addIngredient');

function saveRecipesToStorage() {
  const recipes = [];
  document.querySelectorAll('#recipeList article').forEach(article => {
    const recipeInfo = article.querySelector('.recipe-info');
    const name = recipeInfo.querySelector('h2').textContent;
    const description = recipeInfo.querySelector('p').textContent;
    //desc
    const fullDescription = article.dataset.fullDescription || '';
    // tags
    const tagsElement = recipeInfo.querySelector('.tags');
    const tags = tagsElement ? tagsElement.textContent.replace('Tags: ', '') : '';
    
    //  ingredients
    const ingredients = [];
    const ingredientItems = recipeInfo.querySelectorAll('.ingredients-list li');
    ingredientItems.forEach(item => {
      const parts = item.textContent.split(' - ');
      if (parts.length === 2) {
        ingredients.push({ name: parts[0], size: parts[1] });
      }
    });
    
    recipes.push({ name, description, fullDescription, tags, ingredients });
  });
  
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

// load recipes from localStorage
function loadRecipesFromStorage() {
  try {
    const savedRecipes = JSON.parse(localStorage.getItem('recipes'));
    if (savedRecipes && Array.isArray(savedRecipes)) {
      savedRecipes.forEach(recipe => {
        createRecipeElement(
          recipe.name,
          recipe.description,
          recipe.fullDescription,
          recipe.tags,
          recipe.ingredients
        );
      });
    }
  } catch (e) {
    console.error('Error loading saved recipes:', e);
  }
}


function createRecipeElement(name, description, fullDescription, tags, ingredients) {
  const newArticle = document.createElement('article');
  newArticle.dataset.fullDescription = fullDescription || '';
  
  const recipeDiv = document.createElement('div');
  recipeDiv.className = 'recipe-info';

  const recipeHeading = document.createElement('h2');
  recipeHeading.textContent = name;
  recipeDiv.appendChild(recipeHeading);

  const recipeDesc = document.createElement('p');
  recipeDesc.textContent = description;
  recipeDiv.appendChild(recipeDesc);

  if (ingredients.length > 0) {
    const ingredientsTitle = document.createElement('h3');
    ingredientsTitle.textContent = 'Ingredients';
    recipeDiv.appendChild(ingredientsTitle);

    const ingredientsList = document.createElement('ul');
    ingredientsList.className = 'ingredients-list';
    ingredients.forEach(ingredient => {
      const listItem = document.createElement('li');
      listItem.textContent = `${ingredient.name} - ${ingredient.size}`;
      ingredientsList.appendChild(listItem);
    });
    recipeDiv.appendChild(ingredientsList);
  }

  let recipeTags = null;
  if (tags) {
    recipeTags = document.createElement('p');
    recipeTags.className = 'tags';
    recipeTags.textContent = `Tags: ${tags}`;
    recipeDiv.appendChild(recipeTags);
  }

  // See More button
  const seeMoreButton = document.createElement('button');
  seeMoreButton.textContent = 'See More';
  seeMoreButton.className = 'see-more-button';
  seeMoreButton.addEventListener('click', function () {
    showRecipeModal(name, description, fullDescription, tags, ingredients);
  });
  recipeDiv.appendChild(seeMoreButton);
  
  // Edit button
  const editButton = createEditButton(newArticle, recipeHeading, recipeDesc, recipeTags, ingredients, fullDescription);
  recipeDiv.appendChild(editButton);
  
  // Remove button
  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.className = 'remove-recipe-button';
  removeButton.addEventListener('click', function() {
    newArticle.remove();
    saveRecipesToStorage();
  });
  recipeDiv.appendChild(removeButton);

  newArticle.appendChild(recipeDiv);
  recipeList.appendChild(newArticle);
  
  // Save to localStorage whenever a recipe is added
  saveRecipesToStorage();
  
  return newArticle;
}

// Helper function to show recipe modal
function showRecipeModal(name, description, fullDescription, tags, ingredients) {
  const modal = document.getElementById('recipeModal');
  const modalContentDiv = document.getElementById('modalRecipeDetails');
  
  modalContentDiv.innerHTML = '';
  
  const titleElement = document.createElement('h2');
  titleElement.textContent = name;
  modalContentDiv.appendChild(titleElement);
  
  const descElement = document.createElement('p');
  descElement.textContent = description;
  modalContentDiv.appendChild(descElement);
  
  if (fullDescription && fullDescription.trim()) {
    const fullDescHeading = document.createElement('h3');
    fullDescHeading.textContent = 'Full Description';
    modalContentDiv.appendChild(fullDescHeading);
    
    const fullDescElement = document.createElement('div');
    fullDescElement.className = 'full-description';
    fullDescElement.textContent = fullDescription;
    modalContentDiv.appendChild(fullDescElement);
  }
  
  if (ingredients.length > 0) {
    const ingredientsHeading = document.createElement('h3');
    ingredientsHeading.textContent = 'Ingredients';
    modalContentDiv.appendChild(ingredientsHeading);

    const ingredientsList = document.createElement('ul');
    ingredients.forEach(ingredient => {
      const listItem = document.createElement('li');
      listItem.textContent = `${ingredient.name} - ${ingredient.size}`;
      ingredientsList.appendChild(listItem);
    });
    modalContentDiv.appendChild(ingredientsList);
    
    // allergy warnings
    const allergens = getAllergyWarnings(ingredients);
    if (allergens.length > 0) {
      const allergensHeading = document.createElement('h4');
      allergensHeading.textContent = 'Allergy Warning';
      allergensHeading.style.color = '#E34C35'; 
      modalContentDiv.appendChild(allergensHeading);
      
      const allergensList = document.createElement('ul');
      allergensList.className = 'allergens-list';
      allergensList.style.color = '#E34C35';
      
      allergens.forEach(allergen => {
        const listItem = document.createElement('li');
        listItem.textContent = allergen;
        allergensList.appendChild(listItem);
      });
      
      modalContentDiv.appendChild(allergensList);
    }
  }
  
  if (tags) {
    const tagsElement = document.createElement('p');
    tagsElement.textContent = `Tags: ${tags}`;
    modalContentDiv.appendChild(tagsElement);
  }
  
  const addToListBtn = document.createElement('button');
  addToListBtn.textContent = 'Add Missing Ingredients to List';
  addToListBtn.className = 'add-to-list-btn';
  addToListBtn.addEventListener('click', function() {
    addMissingIngredientsToList(ingredients);
  });
  modalContentDiv.appendChild(addToListBtn);
  
  modal.style.display = 'block';
}

// Helper function to add missing ingredients to list
function addMissingIngredientsToList(ingredients) {
  // Get current grocery list items from localStorage
  const currentListHTML = localStorage.getItem("data") || "";
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = currentListHTML;
  const currentItems = Array.from(tempDiv.querySelectorAll("li"))
    .map(li => li.textContent.replace("×", "").trim().toLowerCase());
  
  // Get current inventory items from localStorage
  let inventoryItems = [];
  try {
    inventoryItems = JSON.parse(localStorage.getItem("inventoryItems")) || [];
  } catch (e) {
    inventoryItems = [];
  }
  
  const inventoryItemNames = inventoryItems.map(item => item.name.toLowerCase());
  
  // get missing ingredients
  const missingIngredients = ingredients.filter(ingredient => 
    !inventoryItemNames.includes(ingredient.name.toLowerCase()));
  
  if (missingIngredients.length === 0) {
    alert("You have all ingredients needed for this recipe!");
    return;
  }
  
  // Add missing ingredients to grocery list if not already there
  let addedCount = 0;
  missingIngredients.forEach(ingredient => {
    const ingredientName = ingredient.name.toLowerCase();
    if (!currentItems.includes(ingredientName)) {
      const li = document.createElement("li");
      li.textContent = ingredient.name;
      const span = document.createElement("span");
      span.innerHTML = "\u00d7";
      li.appendChild(span);
      tempDiv.appendChild(li);
      addedCount++;
    }
  });
  
  // Save updated grocery list back to localStorage
  localStorage.setItem("data", tempDiv.innerHTML);
  
  if (addedCount > 0) {
    alert(`${addedCount} missing ingredient${addedCount === 1 ? '' : 's'} added to your grocery list!`);
  } else {
    alert("These ingredients are already on your grocery list!");
  }
}

addIngredientButton.addEventListener('click', function () {
  const ingredientRow = document.createElement('div');
  ingredientRow.className = 'ingredient-row';
  ingredientRow.innerHTML = `
    <input type="text" class="ingredient-name" placeholder="Ingredient" maxlength="60" />
    <input type="text" class="ingredient-size" placeholder="Serving Size" />
    <button type="button" class="remove-ingredient">Remove</button>
  `;
  ingredientRow.querySelector('.remove-ingredient').addEventListener('click', function () {
    ingredientRow.remove();
  });
  ingredientsContainer.appendChild(ingredientRow);
});

function showForm() {
  recipeFormContainer.style.display = 'block';
  formOverlay.style.display = 'block';
}

function hideForm() {
  recipeFormContainer.style.display = 'none';
  formOverlay.style.display = 'none';
}


addRecipeButton.addEventListener('click', showForm);
closeFormButton.addEventListener('click', hideForm);
formOverlay.addEventListener('click', hideForm);

function createEditButton(article, recipeHeading, recipeDesc, recipeTags, recipeIngredients, fullDescription) {
  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.className = 'edit-recipe-button';

  editButton.addEventListener('click', function () {
    // Populate the form with the current recipe details
    document.getElementById('recipeName').value = recipeHeading.textContent;
    document.getElementById('description').value = recipeDesc.textContent;
    document.getElementById('fullDescription').value = fullDescription || '';
    document.getElementById('tags').value = recipeTags ? recipeTags.textContent.replace('Tags: ', '') : '';

    ingredientsContainer.innerHTML = '';

    // Populate the ingredients container with the current ingredients
    recipeIngredients.forEach(ingredient => {
      const ingredientRow = document.createElement('div');
      ingredientRow.className = 'ingredient-row';
      ingredientRow.innerHTML = `
        <input type="text" class="ingredient-name" value="${ingredient.name}" placeholder="Ingredient" />
        <input type="text" class="ingredient-size" value="${ingredient.size}" placeholder="Serving Size" />
        <button type="button" class="remove-ingredient">Remove</button>
      `;
      ingredientsContainer.appendChild(ingredientRow);

      ingredientRow.querySelector('.remove-ingredient').addEventListener('click', function () {
        ingredientRow.remove();
      });
    });

    showForm();


    recipeForm.onsubmit = function (e) { 
      e.preventDefault();

      // Get new values
      const updatedName = document.getElementById('recipeName').value;
      const updatedDescription = document.getElementById('description').value;
      const updatedFullDescription = document.getElementById('fullDescription').value;
      const updatedTags = document.getElementById('tags').value;

      recipeHeading.textContent = updatedName;
      recipeDesc.textContent = updatedDescription;
      
      article.dataset.fullDescription = updatedFullDescription;
      fullDescription = updatedFullDescription;
      
      if (recipeTags) {
        recipeTags.textContent = `Tags: ${updatedTags}`;
      } else if (updatedTags) {
        const newTags = document.createElement('p');
        newTags.className = 'tags';
        newTags.textContent = `Tags: ${updatedTags}`;
        article.querySelector('.recipe-info').appendChild(newTags);
        recipeTags = newTags;
      }

      // Update ingredients
      const updatedIngredients = [];
      document.querySelectorAll('.ingredient-row').forEach(row => {
        const ingredientName = row.querySelector('.ingredient-name').value;
        const ingredientSize = row.querySelector('.ingredient-size').value;
        if (ingredientName && ingredientSize) {
          updatedIngredients.push({ name: ingredientName, size: ingredientSize });
        }
      });

      recipeIngredients.length = 0;
      updatedIngredients.forEach(ingredient => recipeIngredients.push(ingredient));

      const ingredientsList = article.querySelector('.ingredients-list');
      ingredientsList.innerHTML = '';
      updatedIngredients.forEach(ingredient => {
        const listItem = document.createElement('li');
        listItem.textContent = `${ingredient.name} - ${ingredient.size}`;
        ingredientsList.appendChild(listItem);
      });

      const seeMoreButton = article.querySelector('.see-more-button');
      if (seeMoreButton) {
        const newSeeMoreButton = seeMoreButton.cloneNode(true);
        seeMoreButton.parentNode.replaceChild(newSeeMoreButton, seeMoreButton);
        
        newSeeMoreButton.addEventListener('click', function() {
          const modal = document.getElementById('recipeModal');
          const modalContentDiv = document.getElementById('modalRecipeDetails');
          
          modalContentDiv.innerHTML = '';
          
          const titleElement = document.createElement('h2');
          titleElement.textContent = updatedName;
          modalContentDiv.appendChild(titleElement);
          
          const descElement = document.createElement('p');
          descElement.textContent = updatedDescription;
          modalContentDiv.appendChild(descElement);
          
          if (fullDescription && fullDescription.trim()) {
            const fullDescHeading = document.createElement('h3');
            fullDescHeading.textContent = 'Full Description';
            modalContentDiv.appendChild(fullDescHeading);
            
            const fullDescElement = document.createElement('div');
            fullDescElement.className = 'full-description';
            fullDescElement.textContent = fullDescription;
            modalContentDiv.appendChild(fullDescElement);
          }
          
          if (recipeIngredients.length > 0) {
            const ingredientsHeading = document.createElement('h3');
            ingredientsHeading.textContent = 'Ingredients';
            modalContentDiv.appendChild(ingredientsHeading);
        
            const ingredientsList = document.createElement('ul');
            recipeIngredients.forEach(ingredient => {
              const listItem = document.createElement('li');
              listItem.textContent = `${ingredient.name} - ${ingredient.size}`;
              ingredientsList.appendChild(listItem);
            });
            modalContentDiv.appendChild(ingredientsList);
            
            // Add allergy warnings
            const allergens = getAllergyWarnings(recipeIngredients);
            if (allergens.length > 0) {
              const allergensHeading = document.createElement('h4');
              allergensHeading.textContent = 'Allergy Warning';
              modalContentDiv.appendChild(allergensHeading);
              
              const allergensList = document.createElement('ul');
              allergensList.className = 'allergens-list';
                            
              allergens.forEach(allergen => {
                const listItem = document.createElement('li');
                listItem.textContent = allergen;
                allergensList.appendChild(listItem);
              });
              
              modalContentDiv.appendChild(allergensList);
            }
          }
          
          if (updatedTags) {
            const tagsElement = document.createElement('p');
            tagsElement.textContent = `Tags: ${updatedTags}`;
            modalContentDiv.appendChild(tagsElement);
          }
          
          const addToListBtn = document.createElement('button');
          addToListBtn.textContent = 'Add Missing Ingredients to List';
          addToListBtn.className = 'add-to-list-btn';
          addToListBtn.addEventListener('click', function() {
            // Get current grocery list items from localStorage
            const currentListHTML = localStorage.getItem("data") || "";
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = currentListHTML;
            const currentItems = Array.from(tempDiv.querySelectorAll("li"))
              .map(li => li.textContent.replace("×", "").trim().toLowerCase());
            
            // Get current inventory items from localStorage
            let inventoryItems = [];
            try {
              inventoryItems = JSON.parse(localStorage.getItem("inventoryItems")) || [];
            } catch (e) {
              inventoryItems = [];
            }
            
            const inventoryItemNames = inventoryItems.map(item => item.name.toLowerCase());
            
            // get missing ingredients
            const missingIngredients = recipeIngredients.filter(ingredient => 
              !inventoryItemNames.includes(ingredient.name.toLowerCase()));
            
            if (missingIngredients.length === 0) {
              alert("You have all ingredients needed for this recipe!");
              return;
            }
            
            // Add missing ingredients to grocery list if they're not already there
            let addedCount = 0;
            missingIngredients.forEach(ingredient => {
              const ingredientName = ingredient.name.toLowerCase();
              if (!currentItems.includes(ingredientName)) {
                const li = document.createElement("li");
                li.textContent = ingredient.name;
                const span = document.createElement("span");
                span.innerHTML = "\u00d7";
                li.appendChild(span);
                tempDiv.appendChild(li);
                addedCount++;
              }
            });
            
            // Save updated grocery list back to localStorage
            localStorage.setItem("data", tempDiv.innerHTML);
            
            if (addedCount > 0) {
              alert(`${addedCount} missing ingredient${addedCount === 1 ? '' : 's'} added to your grocery list!`);
            } else {
              alert("These ingredients are already on your grocery list!");
            }
          });
          modalContentDiv.appendChild(addToListBtn);
          
          modal.style.display = 'block';
        });
      }

      recipeForm.reset();
      hideForm();
      
      recipeForm.onsubmit = defaultFormSubmit;
      saveRecipesToStorage();
    };
  });

  return editButton;
}

function defaultFormSubmit(e) {
  e.preventDefault(); // Prevent default form submission which reloads pager

  const name = document.getElementById('recipeName').value;
  const description = document.getElementById('description').value;
  const fullDescription = document.getElementById('fullDescription').value;
  const tags = document.getElementById('tags').value;

  const ingredients = [];
  document.querySelectorAll('.ingredient-row').forEach(row => {
    const ingredientName = row.querySelector('.ingredient-name').value;
    const ingredientSize = row.querySelector('.ingredient-size').value;
    if (ingredientName && ingredientSize) {
      ingredients.push({ name: ingredientName, size: ingredientSize });
    }
  });

  createRecipeElement(name, description, fullDescription, tags, ingredients);

  recipeForm.reset();
  ingredientsContainer.innerHTML = ''; 

  hideForm();
}

recipeForm.onsubmit = defaultFormSubmit;

// Function to filter recipes based on search input
searchInput.addEventListener('input', function () {
  const query = searchInput.value.toLowerCase(); 
  const recipes = document.querySelectorAll('#recipeList article'); 

  recipes.forEach(recipe => {
    const title = recipe.querySelector('h2').textContent.toLowerCase(); 
    const description = recipe.querySelector('p').textContent.toLowerCase();
    const tags = recipe.querySelector('.tags')?.textContent.toLowerCase() || ''; 

    if (title.includes(query) || description.includes(query) || tags.includes(query)) {
      recipe.style.display = '';
    } else {
      recipe.style.display = 'none';
    }
  });
});

const modal = document.getElementById('recipeModal');
const closeModalButton = modal.querySelector('.close-modal');

closeModalButton.addEventListener('click', function() {
  modal.style.display = 'none';
});

window.addEventListener('click', function(event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

window.addEventListener('load', loadRecipesFromStorage);

// Helper function to check for allergens in household members
function getAllergyWarnings(ingredients) {
  // Get the household allergens from localStorage
  let memberAllergens = [];
  try {
    memberAllergens = JSON.parse(localStorage.getItem("member_allergens")) || [];
  } catch (e) {
    console.error("Error loading allergens:", e);
    return [];
  }
  
  if (!memberAllergens || !memberAllergens.length) {
    return [];
  }
  
  // get ingredient names
  const ingredientNames = ingredients.map(ing => ing.name.toLowerCase());
  
  const warnings = [];
  
  // Check if any ingredients contain allergen names
  memberAllergens.forEach(allergen => {
    const allergenLower = allergen.toLowerCase();
    
    for (const ingredient of ingredientNames) {
      // Check if the ingredient contains the allergen name or vice versa
      if (ingredient.includes(allergenLower) || allergenLower.includes(ingredient)) {
        warnings.push(`This recipe contains ${allergen} which may cause allergic reactions for household members.`);
        break;
      }
    }
  });
  
  return warnings;
}
