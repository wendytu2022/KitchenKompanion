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

// Lets users add ingredients to recipe
addIngredientButton.addEventListener('click', function () {
  const ingredientRow = document.createElement('div');
  ingredientRow.className = 'ingredient-row';
  ingredientRow.innerHTML = `
    <input type="text" class="ingredient-name" placeholder="Ingredient" maxlength="60" />
    <input type="text" class="ingredient-size" placeholder="Serving Size" />
    <button type="button" class="remove-ingredient">Remove</button>
  `;
  // Lets users remove ingredients 
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
      e.preventDefault(); // Prevent default form submission which reloads page

      // Get new values
      const updatedName = document.getElementById('recipeName').value;
      const updatedDescription = document.getElementById('description').value;
      const updatedFullDescription = document.getElementById('fullDescription').value;
      const updatedTags = document.getElementById('tags').value;

      recipeHeading.textContent = updatedName;
      recipeDesc.textContent = updatedDescription;
      
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
          }
          
          if (updatedTags) {
            const tagsElement = document.createElement('p');
            tagsElement.textContent = `Tags: ${updatedTags}`;
            modalContentDiv.appendChild(tagsElement);
          }
          
          modal.style.display = 'block';
        });
      }

      recipeForm.reset();
      hideForm();

      recipeForm.onsubmit = defaultFormSubmit;
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

  const newArticle = document.createElement('article');
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

  const seeMoreButton = document.createElement('button');
  seeMoreButton.textContent = 'See More';
  seeMoreButton.className = 'see-more-button';
  seeMoreButton.addEventListener('click', function () {
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
    }
    
    if (tags) {
      const tagsElement = document.createElement('p');
      tagsElement.textContent = `Tags: ${tags}`;
      modalContentDiv.appendChild(tagsElement);
    }
    
    modal.style.display = 'block';
  });
  recipeDiv.appendChild(seeMoreButton);
  
  const editButton = createEditButton(newArticle, recipeHeading, recipeDesc, recipeTags, ingredients, fullDescription);
  recipeDiv.appendChild(editButton);

  newArticle.appendChild(recipeDiv);
  recipeList.appendChild(newArticle);

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
