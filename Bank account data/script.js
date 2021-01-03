'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'cyrine LAAJILI',
  birthYear: 1994,
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'mohanned Majdoub',
  birthYear: 1994,
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Emna Wolf',
  birthYear: 1991,

  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  birthYear: 1980,

  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

/////////////////////////////////////////////////
/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
*/

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

//Display movemets on the bank account
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const dispMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const exchange = mov > 0 ? 'deposit' : 'withdrawal';
    const html = ` <div class="movements__row">
  <div class="movements__type movements__type--${exchange}">${
      i + 1
    } ${exchange}</div>
  <div class="movements__value">${mov}</div>
</div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//Calculate my balance
const calcBal = function (movements) {
  const balarrow = movements.reduce((acc, cur) => cur + acc, 0);
  labelBalance.textContent = `${balarrow} €`;
  return balarrow;
};

//calculate and display statistics
const calcStatistics = function (acc) {
  const IN = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${IN}€`;
  const OUT = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(OUT)}€`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(income => (income * acc.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = `${interest}€`;
};
// Update interface after movements
const updateAccount = function (acc) {
  dispMovements(acc.movements); // display movements
  calcBal(acc.movements);
  calcStatistics(acc);
};
//Implement login
let thisAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // prevent form from submitting
  thisAccount = accounts.find(acc => acc.id === inputLoginUsername.value);
  if (thisAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back ${
      thisAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100; // display the movements interface
    inputLoginUsername.value = inputLoginPin.value = ' '; //clear input fields
    //inputLoginPin.blur();
    updateAccount(thisAccount);
  }
});
//Implement logout
btnClose.addEventListener('click', function (c) {
  c.preventDefault();
  if (
    Number(inputClosePin.value) === thisAccount.pin &&
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
  var bal = calcBal(thisAccount.movements);
  const val = Number(inputTransferAmount.value);
  transferToThisAccount = accounts.find(
    acc => acc.owner === inputTransferTo.value
  );
  if (
    transferToThisAccount?.owner &&
    val > 0 &&
    bal > val &&
    transferToThisAccount?.id !== thisAccount.id
  ) {
    transferToThisAccount.movements.push(val);
    thisAccount.movements.push(-val);
    updateAccount(thisAccount);
    // updateAccount(transferToThisAccount);
    inputTransferAmount.value = inputTransferTo.value = ' ';
  }
});
// request a loan
btnLoan.addEventListener('click', function (l) {
  l.preventDefault();
  const requestedLoan = Number(inputLoanAmount.value);
  if (
    requestedLoan > 0 &&
    thisAccount.movements.some(mov => mov >= requestedLoan * 0.1)
  ) {
    // add event
    thisAccount.movements.push(requestedLoan);
    updateAccount(thisAccount);
    inputLoanAmount.value = ' ';
  }
});

//sort the movements
let state = false;
btnSort.addEventListener('click', function (s) {
  s.preventDefault();
  dispMovements(thisAccount.movements, !state);

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

/////////////////////////////////////////////////
