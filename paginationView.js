import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener(
      'click',
      function (
        clickEl
      ) /*we can't  put here directly the handler cauze we should fix the button to click*/ {
        const btn = clickEl.target.closest('.btn--inline');
        if (!btn) return;

        const goTOPage = +btn.dataset.goto;

        handler(goTOPage);
      }
    );
  }
  _generateMarkup() {
    const curPage = this._data.page;
    console.log(curPage);

    const nbPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(nbPages);
    //we r in page 1 and there are more other pages
    if (curPage === 1 && nbPages > 1) {
      return ` <button data-goto=${
        curPage + 1
      } class="btn--inline pagination__btn--next">
      <span>Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }

    // we r in the last page
    if (curPage === nbPages && nbPages > 1) {
      return `<button data-goto=${
        curPage - 1
      } class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button> `;
    }

    //Other page
    if (1 < curPage < nbPages) {
      return `<button data-goto=${
        curPage - 1
      } class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
      <button data-goto=${
        curPage + 1
      } class="btn--inline pagination__btn--next">
      <span>Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
      `;
    }
    //we have only one page
    return '';
  }
}
export default new PaginationView();
