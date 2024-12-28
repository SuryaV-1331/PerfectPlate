import * as model from './model.js';
import recipeView from './Views/recipeView.js';
import searchView from './Views/searchView.js';
import resultsView from './Views/resultsView.js';
import paginationView from './Views/paginationView.js';
import bookmarksView from './Views/bookmarksView.js';
import addRecipeView from './Views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    //Render Spinner
    recipeView.renderSpinner();

    //Update results view
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    //Loading Recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    //Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

controlRecipes();

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //Get search query
    const query = searchView.getQuery();

    if (!query) throw new Error('Please enter a query!');

    //Load Search results
    await model.loadSearchResults(query);

    //Render Search Results
    resultsView.render(model.getSearchResultsPage());

    //Render initial Pagination
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError(err);
  }
};

const controlPagination = function (goToPage) {
  //Render Search Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //Render initial Pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update recipe servings
  model.updateServings(newServings);
  //Update recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //Add or Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.removeBookMark(model.state.recipe.id);

  //Update recipe view
  recipeView.update(model.state.recipe);

  //Render bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Render Spinner
    addRecipeView.renderSpinner();

    //Upload Recipe
    await model.uploadRecipe(newRecipe);

    console.log(model.state.recipe);

    //Render Recipe
    recipeView.render(model.state.recipe);

    //Success Message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    addRecipeView.renderError(err);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPage(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
