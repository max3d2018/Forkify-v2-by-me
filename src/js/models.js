//Business Logic + State + HTTP Calls
import * as config from './config';
import { AJAX } from './helpers';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultPerPage: config.RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeFormat = rec => {
  return {
    publisher: rec.publisher,
    ingredients: rec.ingredients,
    sourceUrl: rec.source_url,
    imageUrl: rec.image_url,
    title: rec.title,
    servings: rec.servings,
    cookingTime: rec.cooking_time,
    id: rec.id,
    bookmarked:
      state.bookmarks.some(b => b.id === rec.id) || rec.key ? true : false,
    ...(rec.key && { key: rec.key }),
  };
};

export const loadRecipe = async id => {
  try {
    const data = await AJAX(`${config.API_URL}/${id}?key=${config.API_KEY}`);
    console.log(data);
    const { recipe } = data.data;
    state.recipe = createRecipeFormat(recipe);
    return state.recipe;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async query => {
  try {
    const data = await AJAX(
      `${config.API_URL}?search=${query}&key=${config.API_KEY}`
    );
    const results = data.data.recipes.map(rec => {
      return {
        publisher: rec.publisher,
        imageUrl: rec.image_url,
        title: rec.title,
        id: rec.id,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.query = query;
    state.search.results = results;
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = (page = state.search.page) => {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = newServings => {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity * newServings) / state.recipe.servings)
  );

  state.recipe.servings = newServings;
};

const persist = () => {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const takeDataStorage = () => {
  return JSON.parse(localStorage.getItem('bookmarks'));
};

export const addBookmark = async id => {
  const recipe =
    state.search.results.find(rec => rec.id === id) || (await loadRecipe(id));
  recipe.bookmarked = true;
  state.bookmarks.push(recipe);
  if (state.recipe.id === id) state.recipe.bookmarked = true;
  persist();
};

export const deleteBookmark = id => {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  if (index === -1) return;
  state.bookmarks.splice(index, 1);
  state.recipe.bookmarked = false;
  persist();
};

export const initLocalStorage = () => {
  state.bookmarks = takeDataStorage();
};

export const uploadData = async data => {
  try {
    const ingredients = Object.entries(data)
      .filter(el => el[0].startsWith('ingredient') && el[1])
      .map(ing => {
        const [quantity, unit, description] = ing[1]
          .split(',')
          .map(el => el.trim());

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    if (ingredients.length !== 3)
      throw new Error('Please fill the inputs correctly');

    const dataToUpload = {
      title: data.title,
      source_url: data.sourceUrl,
      image_url: data.image,
      servings: +data.servings,
      cooking_time: +data.cookingTime,
      publisher: data.publisher,
      bookmarked: true,
      ingredients,
    };

    const res = await AJAX(
      `${config.API_URL}?key=${config.API_KEY}`,
      dataToUpload
    );
    const recipe = createRecipeFormat(res.data.recipe);
    state.recipe = recipe;
    await addBookmark(recipe.id);
  } catch (err) {
    throw err;
  }
};
