import express from 'express';
import { read } from './jsonFileStorage.mjs';

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const indexHandler = (req, res) => {
  read('data.json', (err, content) => {
    const { recipes } = content;
    const allCategories = [];
    recipes.forEach((recipe) => allCategories.push(recipe.category));
    const contentWCat = {
      ...content,
      categories: new Set(allCategories),
    };
    res.render('index', contentWCat);
  });
};
const recipeHandler = (req, res) => {
  read('data.json', (err, content) => {
    const { recipes } = content;
    const recipe = {
      ...recipes[req.params.index],
    };
    res.render('recipe', recipe);
  });
};

const categoryHandler = (req, res) => {
  read('data.json', (err, content) => {
    const { recipes } = content;
    const { category } = req.query;

    recipes.forEach((recipe, i) => {
      recipe.index = i;
    });

    const catRecipes = recipes.filter((recipe) => recipe.category === category);
    const catObj = {
      recipes: catRecipes,
      category: capitalizeFirstLetter(category),
    };

    res.render('recipe-category', catObj);
  });
};
app.get('/', indexHandler);
app.get('/recipe/:index', recipeHandler);
app.get('/category/', categoryHandler);

app.listen(3004);
