import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddOwnRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was succesfully uploaded';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  constructor() {
    super();
    this._addHandelNewWindow();
    this._addHandelHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  _addHandelNewWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandelHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  //handle the form for submission(upload the data to the API)
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
  _generateMarkup() {}
}
export default new AddOwnRecipeView();
