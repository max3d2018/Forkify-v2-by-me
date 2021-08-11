import View from './View';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _overlay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-window');
  _btnClose = document.querySelector('.btn--close-modal');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _message = 'Recipe was successfuly uploaded';

  constructor() {
    super();
    this.addHandlerShowForm();
    this.addHandlerCloseForm();
  }

  toggleForm() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  addHandlerShowForm() {
    this._btnOpen.addEventListener('click', this.toggleForm.bind(this));
  }
  addHandlerCloseForm() {
    this._btnClose.addEventListener('click', this.toggleForm.bind(this));
    this._overlay.addEventListener('click', this.toggleForm.bind(this));
  }

  addHandlerSubmit(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();

      const data = [...new FormData(this._parentElement)];
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
