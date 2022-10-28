var http = require('http');
var express = require('express');
var exphbs = require('express-handlebars');
var fs = require('fs');

var app = express();
var port = process.env.PORT || 3000;

var recipeData = require('./data/Recipes.json');
var ingredientData = require('./data/Ingredients.json');

function get_output(ingredients, recipes) {
  let output = [];
  console.log("==Recipes:", recipes.length);
  for (let i = 0; i < recipes.length; i++) {
    let count = 0;
    console.log("==Recipe Name:", recipes[i].name);
    for (let j = 0; j < ingredients.length; j++) {
      //as of now, only check to see if it contains ingredient
      //add in a quantity check later
      // console.log("==Current Ingredient:", ingredients[j].name);
      // console.log("==Ingredients in Current Recipe:", recipes[i].ingredients); //test functions
      if (recipes[i].ingredients.includes(ingredients[j].name.toLowerCase())) {
        count++;
      }
    }
    console.log("==Ingredient Match:", Math.round(count / recipes[i].ingredients.length * 10000) / 100 + "%\n");
    //adds recipe to output if it is only missing 2 or less ingredients
    if (count / recipes[i].ingredients.length >= 0.75) {
      output.push(recipes[i]);
    }
  }
  return output;
}

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.json());

app.use(express.static('public'));

//used to update ingredients data when user adds an ingredient
app.post('/ingredients/add', function (req, res, next) {
  if (req.body && req.body.name && req.body.category && req.body.amount && req.body.measurement) {
    //add ingredient to its array
    var bool = false;
    var index = -1;
    for (let i = 0; i < ingredientData.length; i++) {
      if (ingredientData[i].name.toLowerCase() === req.body.name.toLowerCase() && ingredientData[i].category === req.body.category && ingredientData[i].measurement === req.body.measurement) {
        bool = true;
        index = i;
      }
    }
    if (bool) {
      var operation = Number(ingredientData[index].amount) + Number(req.body.amount);
      ingredientData[index].amount = operation.toString();
    } else {
      ingredientData.push({
        name: req.body.name,
        category: req.body.category,
        amount: req.body.amount,
        measurement: req.body.measurement
      });
    }
    //write new ingredient to ingredients data file
    fs.writeFile(
      './data/Ingredients.json',
      JSON.stringify(ingredientData, null, 2),
      function (err) {
        if (!err) {
          if (bool) {
            res.status(201).send(index.toString());
          } else {
            res.status(200).send("Ingredient successfully added");
          }
        } else {
          res.status(500).send("Error saving new ingredient");
        }
      }
    );
  } else {
    res.status(400).send("Error: request body needs a name, tag, amount, and measurement");
  }
  res.status(200);
});

//sends back ingredient data for recipes NOT DONE
app.get('/results/:recipe', function (req, res, next) {
  var recipe = req.params.recipe.toLowerCase();
  for (let i = 0; i < recipeData.length; i++) {
    if (recipeData[i].name.toLowerCase() === recipe) {
      var needed_owned = {
        needed: [],
        owned: [],
        yes: [],
        no: []
      };

      var owned = []
      for (let j = 0; j < ingredientData.length; j++) {
        var obj = {
          name: ingredientData[j].name
        }
        owned.push(obj);
      }

      var needed = [];
      for (let j = 0; j < recipeData[i].ingredients.length; j++) {
        var obj = {
          name: recipeData[i].ingredients[j]
        };
        needed.push(obj);
      }

      var holder = [];
      for (let j = 0; j < ingredientData.length; j++) {
        if (recipeData[i].ingredients.includes(ingredientData[j].name.toLowerCase())) {
          holder.push(ingredientData[j].name.toLowerCase());
        }
      }

      var no = [];
      for (let j = 0; j < recipeData[i].ingredients.length; j++) {
        if (!(holder.includes(recipeData[i].ingredients[j].toLowerCase()))) {
          var obj = {
            name: recipeData[i].ingredients[j]
          }
          no.push(obj);
        }
      }

      var yes = [];
      for (let j = 0; j < holder.length; j++) {
        var obj = {
          name: holder[j]
        }
        yes.push(obj);
      }
      needed_owned["owned"] = owned;
      needed_owned["needed"] = needed;
      needed_owned["yes"] = yes;
      needed_owned["no"] = no;
      res.status(200).render('ingredients_in_recipe_modal', needed_owned);
      break;
    }
  }
});

//updates recipes when a recipe is added
app.post('/search/add', function (req, res, next) {
  if (req.body && req.body.url && req.body.name && req.body.servings && req.body.tags && req.body.ingredients) {
    //add ingredient to its array
    recipeData.push({
      url: req.body.url,
      name: req.body.name,
      servings: req.body.servings,
      tags: req.body.tags,
      ingredients: req.body.ingredients
    });
    //write new ingredient to ingredients data file
    fs.writeFile(
      './data/Recipes.json',
      JSON.stringify(recipeData, null, 2),
      function (err) {
        if (!err) {
          res.status(200).send("Ingredient successfully added")
        } else {
          res.status(500).send("Error saving new ingredient")
        }
      }
    );
  } else {
    res.status(400).send("Error: request body needs a name, tag, amount, and measurement");
  }
});

app.get('/', function (req, res, next) {
  res.status(200).render('input', {
    owned: ingredientData
  });
});

app.get('/results', function (req, res) {
  let output = get_output(ingredientData, recipeData);
  res.status(200).render('results', {
    recipes: output,
    ingredients: ingredientData
  });
});

app.get('/ingredients', function (req, res, next) {
  res.status(200).render('input', {
    owned: ingredientData
  });
});

app.get('/search', function (req, res, next) {
  res.status(200).render('search', {
    recipes: recipeData
  });
});

app.get('/about', function(req, res, next){
    res.status(200).render('about',{

    });
});

app.get('*', function (req, res) {
  res.status(404).render('404');
});

app.listen(port, function () {
  console.log("==Server is listening on port", port);
});
