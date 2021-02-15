import icons from 'url:../../img/icons.svg'; // Parcel

export default class View {
  _data;
  //Js doc format
  /**
   *
   * @param {Object | Object[]} data
   * @param {boolean} [render=true]
   */

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    //only change attributes values after some exchanges and not all the recipe elements
    this._data = data;
    const newMarkup = this._generateMarkup();
    //to convert the string "newMarkup" into real DOM object(like a virtual DOM created only for this object and acts normally like a real DOM)
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newEls = Array.from(newDOM.querySelectorAll('*'));
    const curEls = Array.from(this._parentElement.querySelectorAll('*'));

    newEls.forEach((newEl, i) => {
      const curEl = curEls[i];

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(atr =>
          curEl.setAttribute(atr.name, atr.value)
        ); // replace attributes of the current elements by data coming from the new element
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  //loading images
  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
