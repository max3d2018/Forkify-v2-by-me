class SearchView {
  _parentElement = document.querySelector('.search');

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearField();
    return query;
  }

  addHandlerRender(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }

  _clearField() {
    this._parentElement.querySelector('.search__field').value = '';
  }
}

export default new SearchView();
