import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import addOwnRecipeView from './views/addOwnRecipeView.js';

import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

////////////////////
const controlRecipes = async function () {
  try {
    // const id = window.location.hash.slice(1);
    // console.log(id);
    const id = window.location.href.slice(
      window.location.href.lastIndexOf('/') + 1
    );
    if (!id) return;
    recipeView.renderSpinner();
    resultsView.update(model.getSearchResultsPage());

    bookmarksView.update(model.state.bookmarks);
    await model.loadRecipe(id); //( why await? cauz loadRecipe is a async function so it returns a promise)

    recipeView.render(model.state.recipe); // it's like  const recipeView = new recipeView(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage());

    // initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
    //model.loadSearchResults(query);
  }
};

const controlPagination = function (goTOPage) {
  resultsView.render(model.getSearchResultsPage(goTOPage));
  // new pagination
  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe); //update in the DOM with no need to render all the view
};

const controlAddBoo = function () {
  if (!model.state.recipe.bookmars) model.addBookMark(model.state.recipe);
  else model.cancelBookMark(model.state.recipe.id);

  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newR) {
  try {
    await model.uploadRecipe(newR);
    console.log(model.state.recipe);

    recipeView.render(model.state.recipe);
    addOwnRecipeView.renderMessage();
    bookmarksView.render(model.state.bookmarks);
    //change the ID in the URL using the history API
    window.history.pushState(null, '', `${model.state.recipe.id}`);
    // window.history.back();
    setTimeout(function () {
      addOwnRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addOwnRecipeView.renderError('change the form of ingredients');
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);

  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBoo);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addOwnRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
