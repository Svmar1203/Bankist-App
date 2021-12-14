'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2021-06-18T21:31:17.178Z',
    '2021-07-23T07:42:02.383Z',
    '2021-08-28T09:15:04.904Z',
    '2021-09-01T10:17:24.185Z',
    '2021-10-08T14:11:59.604Z',
    '2021-10-27T17:01:17.194Z',
    '2021-11-11T23:36:17.929Z',
    '2021-12-07T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
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
  currency: 'EUR',
  locale: 'en-US',
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

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (data1, data2) =>
    Math.round(Math.abs(data2 - data1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);
  /*
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  */

  //const date = new Date(acc.movementsDates[i]);
  //const day = `${date.getDate()}`.padStart(2, 0);
  //const month = `${date.getMonth() + 1}`.padStart(2, 0);
  //const year = date.getFullYear();
  //return `${day}/${month}/${year}`;

  //const calcDaysPassed = (data1, data2) =>
  //Math.abs(data2 - data1) / (1000 * 60 * 60 * 24); // sec*min*hours*days
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    /*const formattedMov = new Intl.NumberFormat(acc.locale, {
      style: 'currency',
      currency: acc.currency,
    }).format(mov);
    */
    /*const date = new Date(acc.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;

    const calcDaysPassed = (data1, data2) =>
  Math.abs(data2 - data1) / (1000 * 60 * 60 * 24); // sec*min*hours*days
  */

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 second, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--; //same as time -1
  };
  // Set time to 5 min
  let time = 120;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// Experementing API
/*
const now = new Date();
const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'long', //'numeric',
  year: 'numeric',
  weekday: 'long',
};

//const locale = navigator.language;
//console.log(locale);

labelDate.textContent = new Intl.DateTimeFormat(
  currentAccount.locale,
  options
).format(now); //en-US, en-GB(Uk), ar-SY(Syria), iso language code table
*/

//FAKE ALWAYS LOGGED IN
/*
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;
*/
/*
const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = now.getHours();
const min = now.getMinutes();

labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
*/

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Create current date and time
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);

    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//console.log(Number('23'));
//console.log(+'23');

// Parsing
/*
console.log(Number.parseInt('30px', 10));
console.log(Number.parseFloat('2.5rem'));
console.log(Number.parseInt('2.5rem'));
console.log(Number.isNaN(20));
console.log(Number.isNaN(+'20X'));
console.log(Number.isNaN(23 / 0)); // Infinity

console.log(Number.isFinite('20'));
console.log(Number.isFinite(20));

console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
console.log(8 ** (1 / 3));
console.log(Math.max(5, 7, 87, 99, 43));
console.log(Math.max(8, '98', 65, 4));
console.log(Math.min(9, 6, 1, '87'));
console.log(Math.PI * Number.parseFloat('10px') ** 2); // circel
console.log(Math.trunc(Math.random() * 6) + 1);
*/
//const randomInt = (min, max) =>
//Math.floor(Math.random() * (max - min) + 1) + min;
//console.log(randomInt(-10, 20)); // floor work better with negative numbers!

//console.log(Math.trunc(23.311));// cut the decimal part of number
//console.log(Math.round(23.3));
//console.log(Math.round(23.9));
//console.log(Math.ceil(23.3));
//console.log(Math.ceil(23.9));
//console.log(Math.floor(23.3));// cut the decimal part of number, positiv int!!
/*
console.log(Math.floor(-23.3)); // with negativ numbers floor is around of number
console.log(Math.trunc(-23.3)); // with negative number trunc  just cut the decimal part of number

console.log((2.7).toFixed(0)); // toFixed return string! NOT a NUMBER
console.log((2.7).toFixed(3));
console.log(+(3.456).toFixed(2)); // if we wont return a Number, we need to add +, this convert string to a a number
console.log(8 % 3);
console.log(5 / 2);
console.log((8 / 3).toFixed(2));
console.log(6 % 2); // if remainder is 0 => odd number
console.log(7 % 2); // if remainder is 1 => even number
const isEven = n => n % 2 === 0;
console.log(isEven(5));
console.log(isEven(6));
*/
labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'orange';
    if (i % 3 === 0) row.style.backgroundColor = 'lightblue';
  });
});
/*
const diameter = 284_520_654_000;
console.log(diameter);

const priceCent = 345_00;
const PI = 3.14_54;
console.log(PI);

console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(11111111111111115555555555555555555444444444444465555555555444444n);
console.log(BigInt(11111115555557777777));
console.log(10000n + 10000n);
console.log(
  222222222222222222222222222222222n * 2222222222222222222222222222222222n
);
const huge = 55555555555555555555555555555555555n;
const num = 23;
console.log(huge * BigInt(num));
console.log(20n > 15);
console.log(typeof 20n);
console.log(20n == 20);

console.log(huge + ' is REALLY big');
console.log(12n / 3n);
console.log(10 / 3);
*/

// Create the date
/*
const now = new Date();
console.log(now);
console.log(new Date('Dec 03 2021 21:33:01'));
console.log(new Date('December 04, 2009'));
console.log(new Date(account1.movementsDates[0]));
console.log(new Date(2037, 10, 19, 15, 23, 5)); // '10' is November (becase  month is based on 0)
console.log(new Date(2022, 10, 31)); // 31 November is not exist, log 01 December

console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000)); // 3days => 24hours => 60min => 60sec => 1000millisec
*/
////////////////////////////////////
/*
const now = new Date();
const future = new Date(2022, 10, 19, 15, 23);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate()); // day(19)
console.log(future.getDay()); // day of the week
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString());
console.log(future.getTime()); // since 1970,January 1
console.log(new Date(1668864180000));
console.log(Date.now());
future.setFullYear(2021);
console.log(future);
*/

const future = new Date(2021, 10, 19, 15, 23);
console.log(+future);

console.log(future.getFullYear());
console.log(future.getHours());
console.log(future.getMonth());
console.log(future.getDay());

const calcDaysPassed = (data1, data2) =>
  Math.abs(data2 - data1) / (1000 * 60 * 60 * 24); // sec*min*hours*days
const days1 = calcDaysPassed(new Date(2021, 3, 14), new Date(2021, 3, 3));
console.log(days1);

const num = 388845.23;

const option = {
  style: 'currency',
  unit: 'celsius',
  currency: 'EUR',
};

console.log('US: ', new Intl.NumberFormat('en-US', option).format(num));
console.log('Germany: ', new Intl.NumberFormat('de-DE', option).format(num));
console.log('Syria: ', new Intl.NumberFormat('ar-SY', option).format(num));

const ingredients = ['olives', 'spinach'];
const pizzaTimer = setTimeout(
  (ingr1, ingr2) =>
    console.log(`Here is your pizza 🍕 with ${ingr1} and ${ingr2}`),
  3000,
  ...ingredients
);
console.log('Waiting...');

//if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

/*setInterval(function () {
  const now = new Date();
  console.log(now);
}, 3000);
*/
