'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
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

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, index) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
          <div class="movements__value">${mov}</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

displayMovements(account1.movements);
//console.log(containerMovements.innerHTML);

const calcDisplayBalance = function (movements) {
  const balance = movements.reduce((accum, value) => accum + value, 0); // 0 is initial value
  labelBalance.textContent = `${balance} EUR`;
};
calcDisplayBalance(account1.movements);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);

console.log(`Max value is ${max}`);

//////////////////////////////////////////////
/////////////--MY SOLUTION--//////////////////
/*
const testData = [5, 2, 4, 1, 15, 8, 3];
const testData2 = [16, 6, 10, 5, 6, 1, 4];

const dogAgeCalculate = testData.map((value, ind) =>
  value <= 2 ? value * 2 : 16 + value * 4
);
console.log(dogAgeCalculate);

function calcDog(arr) {
  const newArr = [];
  const humanAge = arr.map(value =>
    value <= 2 ? newArr.push(value * 2) : newArr.push(16 + value * 4)
  );
  console.log(newArr);
  const excludeArr = [];
  const exclude = newArr.filter(function (mov) {
    if (mov > 18) excludeArr.push(mov);
  });
  console.log(excludeArr);
  const average = excludeArr.reduce((accum, current) => accum + current, 0);
  console.log(`The summa of all dogs adges: ${average}`);
  const balans = average / excludeArr.length;
  console.log(
    `The average human age of all adult dogs is ${Math.trunc(balans)}`
  );
}

calcDog(testData);
console.log(`---------------------------------`);
calcDog(testData2);
*/
///////////////////////////////////////////
/////////////--JONAS SOLUTION--////////////

const testData = [5, 2, 4, 1, 15, 8, 3];
const testData2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = function (ages) {
  const humanAge = ages.map(age => (age <= 2 ? age * 2 : 16 + age * 4));

  const adults = humanAge.filter(age => age >= 18);

  const average =
    adults.reduce((accum, current) => accum + current, 0) / adults.length;

  return average;
};

const avg1 = calcAverageHumanAge(testData);
console.log(avg1);
console.log(`-------------------------`);
const avg2 = calcAverageHumanAge(testData2);
console.log(avg2);

/*
const test = testData.filter(function (val) {
  if (val > 2) {
    console.log(`Age is greather then 2: age is ${val}`);
    console.log(`Human age is ${val * 2}`);
  } else {
    console.log(`Age is less then 2: age is ${val * 4 + 16}`);
  }
});

console.log(test);

function calcAverageHumanAge(arr) {
  const list = arr.filter(function (vall) {
    if (vall <= 2) {
      console.log(`Human age: ${vall * 2}`);
    } else {
      console.log(`Human age: ${vall * 4 + 16}`);
    }
  });
}

const emptyArr = [];
function calcAge(arrArr) {
  const hot = arrArr.filter(function (val) {
    if (val <= 2) {
      emptyArr.push(val * 2);
    } else {
      emptyArr.push(val * 4 + 16);
    }
  });
}

calcAge(testData);

const newArr = [];

function exclude(emArr) {
  const tesst = emArr.filter(function (mov) {
    if (mov > 18) {
      newArr.push(mov);
    }
  });
}

exclude(emptyArr);
console.log(newArr);

console.log(`------------------------------`);
calcAverageHumanAge(testData);
console.log(`-------------------------------`);
calcAverageHumanAge(testData2);

console.log(emptyArr);
*/

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
*/

/////////////////////////////////////////////////
/*
const creatAcc = function (accounn) {
  const userr = accounn.forEach(function (part) {
    part.username = part.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

creatAcc(accounts);
console.log(accounts);

const deposit = movements.filter(function (value) {
  return value > 0;
});

const minus = movements.filter(function (val) {
  return val < 0;
});

console.log(deposit);
console.log(minus);

const depositFor = [];
for (const mov of movements) if (mov > 0) depositFor.push(mov);
console.log(depositFor);

const withdrawals = movements.filter(part => part < 0);
console.log(withdrawals);
*/

//////////////--REDUCE--/////////////////

//accumulator -> SNOWBALL

/*
const balance = movements.reduce(function (accum, current, index, arr) {
  console.log(`Iterration ${index}: sum is ${accum}`);
  return accum + current;
}, 0);
console.log(`Balans is: ${balance}`);

let sum = 0;
for (let mov of movements) sum = sum += mov; //sum = sum + mov;
console.log(sum);

//const ballans = movements.reduce((acc1, curr1) => acc1 + curr1, 0);
*/
