import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as models from './models';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import * as config from './config';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const recipeController = async () => {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    await models.loadRecipe(id);
    resultsView.update(models.getSearchResultsPage());
    recipeView.render(models.state.recipe);
  } catch (err) {
    recipeView.renderError(err.message);
  }
};

const searchController = async () => {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    await models.loadSearchResults(query);
    resultsView.render(models.getSearchResultsPage());
    paginationView.render(models.state);
  } catch (err) {
    resultsView.renderError();
  }
};

const paginationController = goto => {
  resultsView.render(models.getSearchResultsPage(goto));
  paginationView.render(models.state);
};

const servingsController = goto => {
  models.updateServings(goto);
  recipeView.update(models.state.recipe);
};

const addBookmarkController = async id => {
  if (!models.state.recipe.bookmarked) {
    await models.addBookmark(id);
  } else {
    models.deleteBookmark(id);
  }
  recipeView.update(models.state.recipe);
  bookmarksView.render(models.state.bookmarks);
};

const localStorageBookmarkController = () => {
  models.initLocalStorage();
  bookmarksView.render(models.state.bookmarks);
};

const uploadControl = async dataArr => {
  try {
    const data = Object.fromEntries(dataArr);
    addRecipeView.renderSpinner();
    await models.uploadData(data);
    addRecipeView.renderMessage();
    window.history.pushState(null, '', `#${models.state.recipe.id}`);
    recipeView.update(models.state.recipe);
    bookmarksView.render(models.state.bookmarks);
    setTimeout(() => {
      addRecipeView.toggleForm();
    }, config.CLOSE_MODAL_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
    setTimeout(() => {
      addRecipeView.toggleForm();
    }, config.CLOSE_MODAL_SEC * 1000);
  }
};

const init = () => {
  recipeView.addHandlerRender(recipeController);
  recipeView.addHandlerUpdateServings(servingsController);
  recipeView.addHandlerAddBookmark(addBookmarkController);
  searchView.addHandlerRender(searchController);
  paginationView.addHandlerClick(paginationController);
  bookmarksView.addHandlerLocalStorageBookmarks(localStorageBookmarkController);
  addRecipeView.addHandlerSubmit(uploadControl);
};

init();
