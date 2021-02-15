import View from './View.js';
import icons from 'url:../../img/icons.svg';
import dontrepeaturselfView from './dontrepeaturselfView.js';
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'Recipe not found';
  _successmessage = '';

  _generateMarkup() {
    console.log(this._data);

    return this._data
      .map(result => dontrepeaturselfView.render(result, false))
      .join('');
  }
}

export default new ResultsView();
