// const res = require("express/lib/response");

//functions for input:
if (document.getElementById("input-page")) {
  var all = [];
  function addIngredient() {
    var name = document.getElementById('name-input').value.trim();
    var category = document.getElementById('category-input').value.trim();
    var amount = document.getElementById('amount-input').value.trim();
    var measurement = document.getElementById('measurement-input').value.trim();
    if (!name || !category || !amount || !measurement || category === "default" || measurement === "default" || amount === "0") {
      alert("You must fill out all the fields!");
    } else {
      var addition = {
        name: name,
        category: category,
        amount: amount,
        measurement: measurement
      };
      fetch("/ingredients/add", {
        method: 'POST',
        body: JSON.stringify(addition),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function (res) {
        if (res.status === 200) {
          createNewIngredient(addition);
          return res.text();
        } else if (res.status === 201) {
          var promise = res.text().then(function (text) {
            var index = Number(text);
            var ingredientContainer = document.querySelectorAll('.ingredient');
            var oldText = ingredientContainer[index].lastElementChild.textContent;
            const words = oldText.split(" ");
            var operation = Number(words[0]) + Number(amount);
            words[0] = operation;
            console.log(words);
            ingredientContainer[index].lastElementChild.textContent = words.join(" ");
          });
        } else {
          alert("An error occured saving your ingredient");
        }
      }).catch(function () {
        alert("An error occured saving your ingredient from catch");
      });
    }
  }

  function createNewIngredient(ingredient) {
    var ingredientTemplate = Handlebars.templates.ingredient;
    var newIngredient = ingredientTemplate(ingredient);
    var ingredientContainer = document.querySelector('.list-owned-ingredients');
    ingredientContainer.insertAdjacentHTML('beforeend', newIngredient);
  }

  function addOne() {
    addIngredient();
    closeIngredientModal();
  }

  function addMore() {
    addIngredient();
    clearIngredientInputs();
  }

  function closeIngredientModal() {
    hideIngredientModal();
    clearIngredientInputs();
  }

  function clearIngredientInputs() {
    var name = document.getElementById('name-input');
    var category = document.getElementById('category-input');
    var amount = document.getElementById('amount-input');
    var measurement = document.getElementById('measurement-input');
    name.value = "";
    category.value = "default";
    amount.value = "";
    measurement.value = "default";
  }

  function showIngredientModal() {
    var modalBackdrop = document.getElementById('modal-backdrop');
    var addIngredientsModal = document.getElementById('add-ingredients-modal');
    modalBackdrop.classList.remove('hidden');
    addIngredientsModal.classList.remove('hidden');
  }

  function hideIngredientModal() {
    var modalBackdrop = document.getElementById('modal-backdrop');
    var addIngredientsModal = document.getElementById('add-ingredients-modal');
    modalBackdrop.classList.add('hidden');
    addIngredientsModal.classList.add('hidden');
  }

  function filter() {
    var container = document.querySelector(".list-owned-ingredients");
    if (container) {
      while(container.lastChild) {
        container.removeChild(container.lastChild);
      }
    }
    if (this.value.toLowerCase() === "default") {
      for (let i = 0; i < all.length; i++) {
        createNewIngredient(all[i]);
      }
    }
    for (let i = 0; i < all.length; i++) {
      if (all[i].category.toLowerCase() === this.value.toLowerCase()) {
        var newIngredient = all[i];
        createNewIngredient(newIngredient);
      }
    }
  }

  function getIngredientObject(ingredientHTML) {
    var ingredient = {};
    var name = ingredientHTML.querySelector('.name');
    ingredient.name = name.textContent.trim();
    var category = ingredientHTML.querySelector('.category');
    ingredient.category = category.textContent.trim();
    var a_m = ingredientHTML.querySelector('.amount');
    var a_m_array = a_m.textContent.split(' ');
    ingredient.amount = a_m_array[0].trim();
    ingredient.measurement = a_m_array[1].trim();
    return ingredient;
  }

  window.addEventListener('DOMContentLoaded', function () {
    var ingredients = document.getElementsByClassName("ingredient");
    for (let i = 0; i < ingredients.length; i++) {
      all.push(getIngredientObject(ingredients[i]));
    }
    var addButton = document.getElementById("add-ingredient");
    addButton.addEventListener('click', showIngredientModal);
    var close = document.getElementById('modal-close-button');
    close.addEventListener('click', closeIngredientModal);
    var cancel = document.getElementById("modal-cancel-button");
    cancel.addEventListener('click', closeIngredientModal);
    var saveButton = document.getElementById("modal-accept-button");
    saveButton.addEventListener('click', addOne);
    var anotherButton = document.getElementById('modal-another-button');
    anotherButton.addEventListener('click', addMore);
    var filters = document.getElementById('filter-selection');
    filters.addEventListener('change', filter);
  });

}

//functions for results:

if (document.getElementById("search-page")) {
  var allRecipes = document.querySelectorAll('.recipe');
  var all = [];
  for (let i = 0; i < allRecipes.length; i++) {
    all.push(getRecipeObject(allRecipes[i]));
  }

  if(localStorage.getItem('input')) {
    document.getElementById("search-input").value = localStorage.getItem('input');;
    updateRecipes();
    localStorage.removeItem('input');
  }

  function addRecipe() {
    var name = document.getElementById('name-input').value;
    name = name.toLowerCase();
    var servings = document.getElementById('servings-input').value;
    servings = servings.toLowerCase();
    var image = document.getElementById('image-input').value;
    image = image.toLowerCase();
    var tags = document.getElementById('tags-input').value;
    tags = tags.toLowerCase();
    var ingredients = document.querySelectorAll('.ingredientToAdd');
    if (!name || !servings || !image || ingredients.length === 0 || !tags) {
      alert("You must fill out all the fields!");
    } else {
      var ingredientsArray = [];
      for(let i = 0; i < ingredients.length; i++) {
        let temp = ingredients[i].textContent;
        temp = temp.toLowerCase();
        ingredientsArray.push(temp);
      }
      fetch("search/add", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: image,
          name: name,
          servings: servings,
          tags: tags,
          ingredients: ingredientsArray
        })
      }).then(function (res) {
        if (res.status === 200) {
          var newRecipe = Handlebars.templates.recipe({
            url: image,
            name: name,
            servings: servings,
            tags: tags
          });
          var recipeContainer = document.getElementById('recipes');
          recipeContainer.insertAdjacentHTML('beforeend', newRecipe);
          return res.text();
        } else {
          alert("An error occured saving your ingredient");
        }
      }).then(function (body) {
        console.log("response body:", body)
      }).catch(function (err) {
        alert("An error occured from the catch() clause");
        console.error(err);
      });
      clearRecipeInputs();
      removeIngredientsToAdd();
      hideRecipeModal();
    }
  }

  function clearRecipeInputs() {
    var name = document.getElementById('name-input');
    var servings = document.getElementById('servings-input');
    var image = document.getElementById('image-input');
    var ingredients = document.getElementById('ingredients-input');
    var tags = document.getElementById('tags-input');
    name.value = "";
    servings.value = "";
    tags.value = "";
    image.value = "";
    ingredients.value = "";
  }

  function showRecipeModal() {
    removeRecipes();
    addRecipes();
    var modalBackdrop = document.getElementById('modal-backdrop');
    var addRecipeModal = document.getElementById('add-recipe-modal');
    modalBackdrop.classList.remove('hidden');
    addRecipeModal.classList.remove('hidden');
  }

  function hideRecipeModal() {
    var modalBackdrop = document.getElementById('modal-backdrop');
    var addIngredientsModal = document.getElementById('add-recipe-modal');
    modalBackdrop.classList.add('hidden');
    addIngredientsModal.classList.add('hidden');
  }

  function removeIngredientsToAdd() {
    let container = document.querySelector('.add-ingredients-container');
    let ingredients = document.querySelectorAll('.ingredientToAdd');
    for (let i = ingredients.length - 1; i >= 0; i--) {
      container.removeChild(ingredients[i]);
    }
  }

  function getRecipeObject(recipeHTML) {
    var recipe = {};
    var url = recipeHTML.querySelector('.url');
    recipe.url = url.currentSrc;
    var name = recipeHTML.querySelector('.recipe-name');
    recipe.name = name.textContent.trim();
    var servings = recipeHTML.querySelector('.recipe-servings');
    recipe.servings = servings.textContent.trim();
    var tags = recipeHTML.querySelector('.recipe-tags');
    recipe.tags = tags.textContent.trim();
    return recipe;
  }

  function createNewRecipe(recipe) {
    var recipeTemplate = Handlebars.templates.recipe;
    var newRecipe = recipeTemplate(recipe);
    var recipeContainer = document.querySelector('#recipes');
    recipeContainer.insertAdjacentHTML('beforeend', newRecipe);
  }

  function filter() {
    var container = document.querySelector("#recipes");
    if (container) {
      while(container.lastChild) {
        container.removeChild(container.lastChild);
      }
    }
    if (this.value.toLowerCase() === "default") {
      for (let i = 0; i < all.length; i++) {
        createNewRecipe(all[i]);
      }
    }
    for (let i = 0; i < all.length; i++) {
      if (all[i].tags.toLowerCase() === this.value.toLowerCase()) {
        var newRecipe = all[i];
        createNewRecipe(newRecipe);
      }
    }
  }

  //removes all recipes from DOM
  function removeRecipes() {
    let container = document.querySelector('#recipes');
    let recipes = document.querySelectorAll('.recipe');
    console.log(container);
    for (let i = recipes.length - 1; i >= 0; i--) {
      container.removeChild(recipes[i]);
    }
  }

  //returns all recipes to the DOM
  function addRecipes() {
    removeRecipes();
    let container = document.querySelector("#recipes")
    allRecipes.forEach(recipe => {
      container.appendChild(recipe);
    })
  }

  //live search
  function updateRecipes() {
    removeRecipes();
    currentRecipes = [];
    category = document.getElementById('filter-selection').value
    console.log(category);
    for(let i = 0; i < all.length; i++) {
      if (category == "default" || all[i].tags.toLowerCase() === category.toLowerCase()) {
        currentRecipes.push(allRecipes[i]);
      }
    }
    var input = document.getElementById("search-input").value
    input = input.toLowerCase()
    var container = document.querySelector("#recipes")
    currentRecipes.forEach(recipe => {
      recipeName = recipe.querySelector(".recipe-name").textContent
      recipeName = recipeName.toLowerCase()
      if (recipeName.includes(input)) {
        container.appendChild(recipe);
      }
    })
  }

  function addIngredientToRecipe() {
    var input = document.getElementById("ingredients-input").value
    if(!input) {
      alert("You must add an ingredient!");
    }
    else {
      var ingredient = document.createElement('p');
      var ingredientText = document.createTextNode(input);
      ingredient.appendChild(ingredientText);
      ingredient.classList.add("ingredientToAdd");
      var container = document.querySelector('.add-ingredients-container');
      container.appendChild(ingredient);
      var inputBox = document.getElementById("ingredients-input");
      inputBox.value = "";
    }
  }

  window.addEventListener('DOMContentLoaded', function () {
    var addRecipeButton = document.getElementById("add-recipe");
    addRecipeButton.addEventListener('click', showRecipeModal);

    var closeModalButtons = document.querySelectorAll(".close");
    for(let i = 0; i < closeModalButtons.length; i++) {
      closeModalButtons[i].addEventListener('click', function() {
        clearRecipeInputs();
        removeIngredientsToAdd();
        hideRecipeModal();
      })
    }

    var acceptButton = document.querySelector(".modal-accept-button");
    acceptButton.addEventListener('click', function() {
      addRecipe();
    });

    //checks for search box input
    var searchBox = document.getElementById('search-input');
    searchBox.addEventListener('input', updateRecipes);

    var addIngredientButton = document.querySelector("#add-button");
    addIngredientButton.addEventListener('click', addIngredientToRecipe);

    document.addEventListener('click', function(event) {
      if(event.target.classList.value == "ingredientToAdd") {
        var container = document.querySelector('.add-ingredients-container');
        container.removeChild(event.target);
      }
      else if(event.target.parentNode.parentNode.classList.value == "recipe") {
        let recipe = event.target.parentNode.parentNode
        let name = recipe.querySelector(".recipe-name");
        let nameContent = name.textContent.trim();
        let url = "http://localhost:3000/results/" + nameContent;
        window.location.href = url;
      }
    });

    var filters = document.getElementById('filter-selection');
    filters.addEventListener('change', filter);
  })
}

var searchButton = document.querySelector("#search-bar-button");
searchButton.addEventListener('click', function() {
  var input = document.getElementById('search-bar-input').value;
  if(!input) {
    alert("You must provide a recipe name before searching!");
  }
  else {
    localStorage.setItem('input', input);
  }
})
