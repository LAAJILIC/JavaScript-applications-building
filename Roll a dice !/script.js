'use strict';

// Selecting elements (using DOM)
const player0 = document.querySelector('.player--0');
const player1 = document.querySelector('.player--1');
const score0 = document.querySelector('#score--0');
const score1 = document.getElementById('score--1');
const current0 = document.getElementById('current--0');
const current1 = document.getElementById('current--1');

const dice = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

let scores, currentScore, whoIsPlaying, playing;

// Initialization conditions
const init = function () {
  scores = [0, 0];
  currentScore = 0;
  whoIsPlaying = 0;
  playing = true;

  score0.textContent = 0;
  score1.textContent = 0;
  current0.textContent = 0;
  current1.textContent = 0;

  dice.classList.add('hidden');
  player0.classList.remove('player--winner');
  player1.classList.remove('player--winner');
  player0.classList.add('player--active');
  player1.classList.remove('player--active');
};
init();

const switchPlayer = function () {
  document.getElementById(`current--${whoIsPlaying}`).textContent = 0;
  currentScore = 0;
  whoIsPlaying = whoIsPlaying === 0 ? 1 : 0;
  player0.classList.toggle('player--active');
  player1.classList.toggle('player--active');
};

// push dice to work
btnRoll.addEventListener('click', function () {
  if (playing) {
    // 1. Generating a random dice roll
    const diceValue = Math.trunc(Math.random() * 6) + 1;

    // 2. Display dice
    dice.classList.remove('hidden');
    dice.src = `dice-${diceValue}.png`;

    // 3. Check if the dice number is not 1
    if (diceValue !== 1) {
      currentScore += diceValue;
      document.getElementById(
        `current--${whoIsPlaying}`
      ).textContent = currentScore;
    } else {
      switchPlayer();
    }
  }
});

btnHold.addEventListener('click', function () {
  if (playing) {
    // 1. Add current score to active player's score
    scores[whoIsPlaying] += currentScore;

    document.getElementById(`score--${whoIsPlaying}`).textContent =
      scores[whoIsPlaying];

    // 2. Check if player's score is >= 100
    if (scores[whoIsPlaying] >= 100) {
      // End the game
      playing = false;
      dice.classList.add('hidden');

      document
        .querySelector(`.player--${whoIsPlaying}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${whoIsPlaying}`)
        .classList.remove('player--active');
    } else {
      switchPlayer();
    }
  }
});

btnNew.addEventListener('click', init);
