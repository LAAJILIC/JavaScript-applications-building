'use strict';
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map, mapEvent;
//build class parent (workout) and inherite child classes ( running and cycling)
class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, dist, dura) {
    this.coords = coords;
    this.distance = dist;
    this.duration = dura;
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
  click() {
    this.clicks++;
  }
}

class Run extends Workout {
  type = 'running';
  constructor(coords, dist, dura, cad) {
    super(coords, dist, dura);
    this.cadence = cad;
    this.calcPace();
    this._setDescription();
  }
  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cyc extends Workout {
  type = 'cycling';
  constructor(coords, dist, dura, elev) {
    super(coords, dist, dura);
    this.elevationGain = elev;
    this.calcSpeed();
    this._setDescription();
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
  }
}
const run1 = new Run([29, -10], 5.2, 40, 160);
const cyc1 = new Cyc([29, -10], 20, 88, 520);

//////////////////////////// Build class App
class App {
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];
  constructor() {
    this._getPosition();

    this._getLocalStorage(); // store local data while clearing the page
    form.addEventListener('submit', this._newWorkout.bind(this));

    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
  }
  _getPosition() {
    //Geolocate coordinates
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert(`Position not found`);
        }
      );
  }
  _loadMap(pos) {
    const { latitude } = pos.coords;
    const { longitude } = pos.coords;
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }
  _clearForm() {
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value =
      ' ';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 2000);
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    const valid = (...inputs) => inputs.every(inp => Number.isFinite(inp));
    const positive = (...inputs) => inputs.every(inp => inp > 0);
    e.preventDefault();
    // get input data and check its validity
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;
    //According to workout type : create new object
    if (type === 'running') {
      const cadence = +inputCadence.value;
      if (
        !valid(distance, duration, cadence) ||
        !positive(distance, duration, cadence)
      )
        return alert('Input have to be positive number');
      workout = new Run([lat, lng], distance, duration, cadence);
    }
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (
        !valid(distance, duration, elevation) ||
        !positive(distance, duration)
      )
        return alert('Input have to be positive number');
      workout = new Cyc([lat, lng], distance, duration, elevation);
    }
    //store this object to workut array
    this.#workouts.push(workout);
    //display marker on map
    this._renderWorkoutMarker(workout);
    //display workout on list
    this._renderWorkout(workout);
    //clear input fields
    this._clearForm();
    //set local storage to workouts
    this._setLocalStorage();
  }
  _renderWorkoutMarker(wo) {
    L.marker(wo.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${wo.type}-popup`,
        })
      )
      .setPopupContent(`${wo.type === 'running' ? 'R' : 'C'} ${wo.description}`)
      .openPopup();
  }
  _renderWorkout(wo) {
    let html = ` 
  <li class="workout workout--${wo.type}" data-id=${wo.id}>
    <h2 class="workout__title">${wo.description}</h2>
    <div class="workout__details">
      <span class="workout__icon">${wo.type === 'running' ? '🏃' : '🚴 '}</span>
      <span class="workout__value">${wo.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${wo.duration}</span>
      <span class="workout__unit">min</span>
    </div>`;
    if (wo.type === 'running')
      html += ` <div class="workout__details">
    <span class="workout__icon">⚡️</span>
    <span class="workout__value">${wo.pace.toFixed(1)}</span>
    <span class="workout__unit">min/km</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">🦶🏼</span>
    <span class="workout__value">${wo.cadence}</span>
    <span class="workout__unit">spm</span>
  </div>
</li>`;

    if (wo.type === 'cycling')
      html += `<div class="workout__details">
<span class="workout__icon">⚡️</span>
<span class="workout__value">${wo.speed.toFixed(1)}</span>
<span class="workout__unit">km/h</span>
</div>
<div class="workout__details">
<span class="workout__icon">⛰</span>
<span class="workout__value">${wo.elevationGain}</span>
<span class="workout__unit">m</span>
</div>
</li>`;
    form.insertAdjacentHTML('afterend', html);
  }
  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout');
    if (!workoutEl) return;
    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }
  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    if (!data) return;

    this.#workouts = data;

    this.#workouts.forEach(work => {
      this._renderWorkout(work);
    });
  }
  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();
//app._getPosition(); or do it immediately in the constuctor
