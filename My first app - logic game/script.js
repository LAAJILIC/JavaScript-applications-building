'use strict';
/*
document.querySelector('.string').textContent = 'So?';
document.querySelector('.score').textContent = 13;
*/
//we can use two classes for the same element : look at html file//
let secretMe = 'cyr'; //secret before the me hide the value that we search !!!!!
//if the value was a number
//const number = Math.trunc(Math.random()*10)+1; // number would be between 1 and 10
let highScore = 0;
const alph = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
];
let finScore = document.querySelector('.score').textContent;
const displayMessage = function (msg) {
  document.querySelector('.message').textContent = msg;
};
//console.log(finScore);
document.querySelector('.check').addEventListener('click', function () {
  const x = document.querySelector('.guess').value;
  // in general the type of input data given by the user is string so in some cases we should use other functions such as Number
  //console.log(x, typeof x);
  // Here I will start building the game logic:
  //Verify first if there is an input value entereed by user
  if (!x) {
    // document.querySelector('.message').textContent = 'Please start';
    displayMessage('Please start');
    // when the player wins
  } else if (x === secretMe) {
    displayMessage('Correct answer');
    document.querySelector('.string').textContent = secretMe;
    // manipulate css style backgroung after winning
    document.querySelector('body').style.backgroundColor = '#806523';
    document.querySelector('.string').style.width = '30rem';
    //Implement highscores
    if (finScore > highScore) {
      highScore = finScore;
      finScore = 20;
    }
    document.querySelector('.highscore').textContent = highScore;
  } else if (x.length !== 3) {
    if (finScore > 1) {
      displayMessage('It contains only 3 lettres, try again');
      finScore -= 1;
    } else {
      displayMessage('You lose the game');
      finScore = 0;
    }
  } else if (x.substr(0) !== 'c' && x.substr(2) !== 'r') {
    if (finScore > 1) {
      displayMessage('Pay attention to the consignes avove');
      finScore -= 1;
    } else {
      displayMessage('You lose the game');
      finScore = 0;
    }
  }
  // alph.indexOf(x.substr(1, 1))
  /* else if (alph.includes(x.substr(1, 1))) {
    if (finScore > 1) {
      document.querySelector('.message').textContent =
        'The 2 letter is alphabitilcally after the one you typed';
      finScore--;
    } else {
      document.querySelector('.message').textContent = 'You lose the game';
      finScore = 0;
    }
  } else if (!alph.includes(x.substr(1, 1))) {
    if (finScore > 1) {
      document.querySelector('.message').textContent =
        'The 2 letter is alphabitically before the one you typed';
      finScore--;
    } else {
      document.querySelector('.message').textContent = 'You lose the game';
      finScore = 0;
    }
  }*/
  //Avoid duplicate code and don't repaeat my self
  else if (x.substr(0, 1) === 'c' && x.substr(2, 1) === 'r') {
    if (finScore > 1) {
      displayMessage(
        x.substr(1, 1) < secretMe.substr(1, 1)
          ? '2nd letter is after the one you typed'
          : '2nd letter is before the one you typed'
      );
      finScore--;
    } else {
      displayMessage('You lose the game');
      finScore = 0;
    }
  }
  console.log(x.substr(1, 1));
  console.log(finScore);
  document.querySelector('.score').textContent = finScore;
});
//Implement the again functionality and trigger this button
document.querySelector('.again').addEventListener('click', function () {
  secretMe = 'cbr'; // the new value of secretme should be defined into this handler function,otherwise, the wrowser will take the 2 nd input as the first one
  document.querySelector('.score').textContent = 20;
  document.querySelector('.string').textContent = '?';
  displayMessage('Start guessing..');
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.string').style.width = '15rem';
});
