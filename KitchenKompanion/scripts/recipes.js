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

// lets users add ingredients to recipe
addIngredientButton.addEventListener('click', function () {
  const ingredientRow = document.createElement('div');
  ingredientRow.className = 'ingredient-row';
  ingredientRow.innerHTML = `
    <input type="text" class="ingredient-name" placeholder="Ingredient" />
    <input type="text" class="ingredient-size" placeholder="Serving Size" />
    <button type="button" class="remove-ingredient">Remove</button>
  `;
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

// Adds edit button to recipes in the list
function createEditButton(article, recipeHeading, recipeDesc, recipeTags, recipeIngredients) {
  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.className = 'edit-recipe-button';

  editButton.addEventListener('click', function () {
    // Populate the form with the current recipe details
    document.getElementById('recipeName').value = recipeHeading.textContent;
    document.getElementById('description').value = recipeDesc.textContent;
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

    // Show the form
    showForm();

    // Update the form submission to save changes
    recipeForm.onsubmit = function (e) {
      e.preventDefault(); // Prevent default form submission

      // Update the recipe details
      recipeHeading.textContent = document.getElementById('recipeName').value;
      recipeDesc.textContent = document.getElementById('description').value;
      if (recipeTags) {
        recipeTags.textContent = `Tags: ${document.getElementById('tags').value}`;
      } else if (document.getElementById('tags').value) {
        const newTags = document.createElement('p');
        newTags.className = 'tags';
        newTags.textContent = `Tags: ${document.getElementById('tags').value}`;
        article.querySelector('.recipe-info div').appendChild(newTags);
      }

      // Update the ingredients list
      const updatedIngredients = [];
      document.querySelectorAll('.ingredient-row').forEach(row => {
        const ingredientName = row.querySelector('.ingredient-name').value;
        const ingredientSize = row.querySelector('.ingredient-size').value;
        if (ingredientName && ingredientSize) {
          updatedIngredients.push({ name: ingredientName, size: ingredientSize });
        }
      });

      // Update the recipeIngredients array to reflect the current state
      recipeIngredients.length = 0; // Clear the array
      updatedIngredients.forEach(ingredient => recipeIngredients.push(ingredient));

      // Clear the old ingredients list and append the updated one
      const ingredientsList = article.querySelector('.ingredients-list');
      ingredientsList.innerHTML = '';
      updatedIngredients.forEach(ingredient => {
        const listItem = document.createElement('li');
        listItem.textContent = `${ingredient.name} - ${ingredient.size}`;
        ingredientsList.appendChild(listItem);
      });

      // Reset the form and hide it
      recipeForm.reset();
      hideForm();

      // Restore the default form submission behavior
      recipeForm.onsubmit = defaultFormSubmit;
    };
  });

  return editButton;
}

// Default form submission 
function defaultFormSubmit(e) {
  e.preventDefault(); // Prevent default form submission behavior

  const name = document.getElementById('recipeName').value;
  const description = document.getElementById('description').value;
  const tags = document.getElementById('tags').value;

  // Retrieve ingredients
  const ingredients = [];
  document.querySelectorAll('.ingredient-row').forEach(row => {
    const ingredientName = row.querySelector('.ingredient-name').value;
    const ingredientSize = row.querySelector('.ingredient-size').value;
    if (ingredientName && ingredientSize) {
      ingredients.push({ name: ingredientName, size: ingredientSize });
    }
  });

  // Create new article and recipe info container elements
  const newArticle = document.createElement('article');
  const recipeDiv = document.createElement('div');
  recipeDiv.className = 'recipe-info';

  // Create and append the recipe title
  const recipeHeading = document.createElement('h2');
  recipeHeading.textContent = name;
  recipeDiv.appendChild(recipeHeading);

  // Create and append the recipe description
  const recipeDesc = document.createElement('p');
  recipeDesc.textContent = description;
  recipeDiv.appendChild(recipeDesc);

  // Create and append the tags
  let recipeTags = null;
  if (tags) {
    recipeTags = document.createElement('p');
    recipeTags.className = 'tags';
    recipeTags.textContent = `Tags: ${tags}`;
    recipeDiv.appendChild(recipeTags);
  }

  // Add a title above the ingredients list
  if (ingredients.length > 0) {
    const ingredientsTitle = document.createElement('h3');
    ingredientsTitle.textContent = 'Ingredients';
    recipeDiv.appendChild(ingredientsTitle);

    // Create and append the ingredients list
    const ingredientsList = document.createElement('ul');
    ingredientsList.className = 'ingredients-list';
    ingredients.forEach(ingredient => {
      const listItem = document.createElement('li');
      listItem.textContent = `${ingredient.name} - ${ingredient.size}`;
      ingredientsList.appendChild(listItem);
    });
    recipeDiv.appendChild(ingredientsList);
  }

  // Create and append the "Edit" button
  const editButton = createEditButton(newArticle, recipeHeading, recipeDesc, recipeTags, ingredients);
  recipeDiv.appendChild(editButton);

  // Append recipeDiv to the new article
  newArticle.appendChild(recipeDiv);

  // Append the new article to the recipe list container
  recipeList.appendChild(newArticle);

  // Reset the form for the next entry
  recipeForm.reset();
  ingredientsContainer.innerHTML = ''; // Clear the ingredients list

  // Hide the form after submission
  hideForm();
}

// Set the default form submission behavior
recipeForm.onsubmit = defaultFormSubmit;

// Function to filter recipes based on search input
searchInput.addEventListener('input', function () {
  const query = searchInput.value.toLowerCase(); 
  const recipes = document.querySelectorAll('#recipeList article'); 

  recipes.forEach(recipe => {
    const title = recipe.querySelector('h2').textContent.toLowerCase(); 
    const description = recipe.querySelector('p').textContent.toLowerCase();
    const tags = recipe.querySelector('.tags')?.textContent.toLowerCase() || ''; 

    // Check if the query matches the title, description, or tags
    if (title.includes(query) || description.includes(query) || tags.includes(query)) {
      recipe.style.display = '';
    } else {
      recipe.style.display = 'none';
    }
  });
});
