//this class is not going to render anything
// this class would get a query
//this class listenes to the click event on the button

class SearchView {
  _parentEl = document.querySelector('.search');
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    console.log(query);

    this._clearIn();
    return query;
  }
  _clearIn() {
    this._parentEl.querySelector('.search__field').value = '';
  }
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
