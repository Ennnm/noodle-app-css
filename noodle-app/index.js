import express from 'express';
import { add } from './jsonFileStorage.mjs';
import { read } from './jsonFileStorage.mjs';

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
//configure to receive req body dat into req.body
app.use(express.urlencoded({extended : false}));


const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const objWithCategories = (obj)=>{
   const { recipes } = obj;
    const allCategories = [];
    recipes.forEach((recipe) => allCategories.push(recipe.category));
    const objWCat = {
      ...obj,
      categories: new Set(allCategories),
    };
    return objWCat;
}

const indexHandler = (req, res) => {
  read('data.json', (err, content) => {
  
    // const { recipes } = content;
    // const allCategories = [];
    // recipes.forEach((recipe) => allCategories.push(recipe.category));
    // const contentWCat = {
    //   ...content,
    //   categories: new Set(allCategories),
    // };
    res.render('index', objWithCategories(content));
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

const addHandler = (req, res) =>{
  add('data.json', 'recipes', req.body, (err)=>{
    if(err)
    {
      res.status(500).send('DB write error');
      return; 
    }
    // res.send('saved recipe');
    read('data.json', (err, content) => {
    res.render('index', objWithCategories(content));
    });
  });
 
}

app.get('/', indexHandler);
app.get('/recipe/:index', recipeHandler);
app.get('/category/', categoryHandler);
app.post('/input', addHandler);
app.get('/input', indexHandler);
app.listen(3004);
