import View from './View.js';
import DontrepeaturselfView from './dontrepeaturselfView.js';
import icons from 'url:../../img/icons.svg';
import dontrepeaturselfView from './dontrepeaturselfView.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'Bookmark not found';
  _successmessage = '';
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data
      .map(bookmarked => dontrepeaturselfView.render(bookmarked, false))
      .join('');
  }
}

export default new BookmarksView();
