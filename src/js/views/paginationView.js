import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const currPage = +this._data.search.page;
    const numPages = Math.ceil(
      this._data.search.results.length / this._data.search.resultPerPage
    );

    const nextBtn = `
    <button class="btn--inline pagination__btn--next" data-goto=${currPage + 1}>
        <span>Page ${currPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>
    `;

    const previousBtn = `
    <button class="btn--inline pagination__btn--prev" data-goto=${currPage - 1}>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currPage - 1}</span>
    </button>
    `;

    //on page 1 and others
    if (currPage === 1 && numPages > 1) return nextBtn;

    //on last page
    if (currPage === numPages && numPages > 1) return previousBtn;

    //on others
    if (currPage < numPages && currPage > 1) return previousBtn + nextBtn;
    //on page 1 and no other pages
    return ``;
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const clickedParent = e.target.closest('.btn--inline');
      if (!clickedParent) return;
      const goto = +clickedParent.dataset.goto;
      handler(goto);
    });
  }
}

export default new PaginationView();
