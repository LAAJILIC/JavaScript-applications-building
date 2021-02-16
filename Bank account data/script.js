'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'cyrine LAAJILI',
  birthYear: 1994,
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'mohanned Majdoub',
  birthYear: 1994,
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const account3 = {
  owner: 'Emna Wolf',
  birthYear: 1991,
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  birthYear: 1980,
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: ['2020-07-26T12:01:20.894Z'],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'blue';
    if (i % 3 === 0) row.style.backgroundColor = 'red';
  });
});
/////////////////////////////////////////////////
//From long username to simple ID
const createId = function (accs) {
  accs.forEach(function (acc) {
    acc.id =
      acc.owner
        .toUpperCase()
        .split(' ')
        .map(user => user[0])
        .join('') + acc.birthYear;
  });
};
createId(accounts);
console.log(accounts);

//Date movement
const styleMovDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
//Calculate my balance
const calcBal = function (acc) {
  const balarrow = acc.movements.reduce((acc, cur) => cur + acc, 0);
  labelBalance.textContent = `${balarrow.toFixed(2)}€`;
  return balarrow;
};

//calculate and display statistics
const calcStatistics = function (acc) {
  const IN = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(IN, acc.locale, acc.currency);
  const OUT = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(OUT), acc.locale, acc.currency);
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(income => (income * acc.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};
// Update interface after movements
const updateAccount = function (acc) {
  dispMovements(acc); // display movements
  calcBal(acc);
  calcStatistics(acc);
};
//Implement automatic LOGOUT
const startLogOutTimer = function () {
  const direct = function () {
    const min = String(Math.trunc(t / 60)).padStart(2, 0);
    const sec = String(t % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (t === 0) {
      clearInterval(timer);
      labelTimer.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    } else t--;
  };
  let t = 100;
  direct();
  const timer = setInterval(direct, 1000);
  return timer;
};
//Implement login
let thisAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // prevent form from submitting
  thisAccount = accounts.find(acc => acc.id === inputLoginUsername.value);
  if (thisAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Hello dear ${thisAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100; // display the movements interface

    //Date setting
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat('en-US', options).format(
      now
    );
    /*
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}${year}, ${hour}:${min}`;*/

    inputLoginUsername.value = inputLoginPin.value = ' '; //clear input fields
    //inputLoginPin.blur();
    startLogOutTimer();
    updateAccount(thisAccount);
  }
});
//Implement logout
btnClose.addEventListener('click', function (c) {
  c.preventDefault();
  if (
    +inputClosePin.value === thisAccount.pin &&
    inputCloseUsername.value === thisAccount.id
  ) {
    const index = accounts.findIndex(acc => acc.id === thisAccount.id);
    console.log(index);

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;

    inputCloseUsername.value = inputClosePin.value = ' ';
  }
});
// make a transfer ( yellow bloc)
let transferToThisAccount;
btnTransfer.addEventListener('click', function (t) {
  t.preventDefault();
  var bal = calcBal(thisAccount);
  const val = +inputTransferAmount.value;
  transferToThisAccount = accounts.find(
    acc => acc.owner === inputTransferTo.value
  );
  if (
    transferToThisAccount?.owner &&
    val > 0 &&
    bal > val &&
    transferToThisAccount?.id !== thisAccount.id
  ) {
    thisAccount.movements.push(-val);
    thisAccount.movementsDates.push(new Date());
    updateAccount(thisAccount);

    transferToThisAccount.movements.push(val);
    //updateAccount(transferToThisAccount);
    // transferToThisAccount.movementsDates.push(new Date());
    // updateAccount(transferToThisAccount);
    inputTransferAmount.value = inputTransferTo.value = ' ';
  }
});
// request a loan
btnLoan.addEventListener('click', function (l) {
  l.preventDefault();
  const requestedLoan = +inputLoanAmount.value;
  if (
    requestedLoan > 0 &&
    thisAccount.movements.some(mov => mov >= requestedLoan * 0.1)
  ) {
    // add event
    thisAccount.movements.push(requestedLoan);
    thisAccount.movementsDates.push(new Date());
    updateAccount(thisAccount);
    inputLoanAmount.value = ' ';
  }
});

//Display movemets on the bank account
const dispMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const exchange = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = styleMovDate(date);
    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = ` <div class="movements__row">
  <div class="movements__type movements__type--${exchange}">${
      i + 1
    } ${exchange}</div>
    <div class="movements__date">${displayDate}</div>
  <div class="movements__value">${formattedMov}</div>
</div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//sort the movements
let state = false;
btnSort.addEventListener('click', function (s) {
  s.preventDefault();
  dispMovements(thisAccount, !state);

  state = !state;
});
/////////////////////////////////////////////////
//maximum deposit
const maxValue = movements.reduce((max, cur) => {
  if (max > cur) return max;
  else return cur;
}, movements[0]);
console.log(maxValue);

//From Euro to USD
const eurToUsd = 1.21;
const DespositsUSD = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => mov * eurToUsd)
  .reduce((acc, cur) => acc + cur, 0);
console.log(DespositsUSD);

//the balance of all accounts ( needed for the bank manager)

const wholeBalance = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(wholeBalance);

////////////////////////////////////////
