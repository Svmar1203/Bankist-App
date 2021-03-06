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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements; // slice() => take copy of array, not mutate origin one
  movs.forEach(function (mov, index) {
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

//displayMovements(account1.movements);
//console.log(containerMovements.innerHTML);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0); // 0 is initial value

  labelBalance.textContent = `${acc.balance} EUR`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}EUR`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}EUR`; // without minus

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, curr) => acc + curr, 0);
  labelSumInterest.textContent = `${interest}EUR`;
};

//calcDisplaySummary(account1.movements);

const creatUsernames = function (accoun) {
  accoun.forEach(function (part) {
    part.username = part.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
creatUsernames(accounts);

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);
  //Display balance
  calcDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

//Event handler
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('LOGIN');

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('LOGIN');

    //Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
    console.log(amount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movements
    currentAccount.movements.push(amount);

    // Update UI

    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('DELETE');

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    //Delete account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      //cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);

const convertTitleCase = function (title) {
  const exeption = ['a', 'is', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word =>
      exeption.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(' ');
  //console.log(titleCase);
  return titleCase;
};

const convert = function (title) {
  const ex = ['an', 'is', 'the', 'a', 'and'];

  const wrd = title
    .toLowerCase()
    .split(' ')
    .map(word =>
      ex.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(' ');
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));

/////////////////////////
/*
const bankDepositSum = accounts.map(acc => acc.movements).flat(); // all element from other arrays in one
console.log(bankDepositSum); // all values

const posit = accounts.flatMap(acc => acc.movements).filter(val => val > 0);
console.log(posit); // positive values

const min = accounts.flatMap(acc => acc.movements).filter(move => move < 0);
console.log(min); // negative values

const summa = accounts
  .flatMap(acc => acc.movements)
  .filter(val => val > 0)
  .reduce((curre, el) => curre + el, 0);
console.log(summa); // summa of all values
*/

const bankDeposit1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000).length; // 6 elements is more then 1000
console.log(bankDeposit1000);

const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
console.log(numDeposits1000);

/////////////////////////////////////
/*
const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 5, 5, 5));

const x = new Array(5);
console.log(x);

x.fill(1, 3);
console.log(x);

arr.fill(23, 4, 6);
console.log(arr);

//Array.from()

const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (curr, i) => i + 2);
console.log(z);

//const movementsUI = Array.from(document.querySelectorAll('.movements__value'));
//console.log(movementsUI);
*/
/////////////////////////////////////////////////////////
/*
labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('', ' '))
  );
  console.log(movementsUI);
});
*/
///////////////////////////////////////
/*
const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);
const allMovements = accountMovements.flat();
console.log(allMovements);
//console.log(accountMovements.flat());
//const overalBallance = allMovements.reduce((accum, val) => accum + val, 0);
console.log(overalBallance);
*/
////////////////////////////////////
/*
//map + flat + reduce
const overalBallance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((accum, val) => accum + val, 0);
console.log(overalBallance);

// flatMap
const overalBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((accum, val) => accum + val, 0);
console.log(overalBalance2);
*/

///////////////////////////

/*
//Sorting Array
//Strings

const owners = ['Jonas', 'Zack', 'Adam', 'Martha'];
console.log(owners.sort());
console.log(owners);

//Numbers
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);
console.log(movements.sort());
console.log(movements);
*/
//return < 0 A, B descending order
//return > 0, B, A ascending order
//ascending order:
/*
movements.sort((a, b) => {
  if (a > b) return 1;
  if (a < b) return -1;
});
console.log(movements);
*/
/*
movements.sort((a, b) => a - b);
console.log(movements);
*/
//descending order:
/*
movements.sort((a, b) => {
  if (a > b) return -1; //return -1
  if (a < b) return 1; // return 1
});
console.log(movements);
*/

//movements.sort((a, b) => b - a);
//console.log(movements);

/////////////////////////////////////////
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);
//EQUALITY
console.log(movements.includes(200));

//SOME: CONDITION

console.log(movements.some(mov => mov === 1000)); //condition true OR false

const anyDeposits = movements.some(mov => mov > 1000);
console.log(anyDeposits);

// EVERY

console.log(account4.movements.every(mov => mov > 0));

const deposit = mov => mov > 0;
const withdrawal1 = mov => mov < 0;

console.log(movements.some(deposit));
console.log(account4.movements.every(deposit));
console.log(movements.filter(deposit));
console.log(account2.movements.filter(deposit));
console.log(account2.movements.filter(withdrawal1));
console.log(account2.movements);

const arr = [[1, 2, 3], [3, 5, 4], 8, 8];
console.log(arr.flat());

const arrDeep = [
  [[1, 2], 3],
  [2, 8],
  [[9, 9], 7],
];
console.log(arrDeep.flat(2));//flat(=>2) means, deep level
*/
////////////////////////////////

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/*
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);

console.log(`Max value is ${max}`);
*/

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
/*
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
*/
/////////////////////////////////

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
  accounn.forEach(function (part) {
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

/////PIPELINE
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


const eurToUsd = 1.1;
const totalDepositsToUsd = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  .reduce((accum, current) => accum + current, 0);
console.log(totalDepositsToUsd);
*/
///////////////////////////////////////
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);

const eurToUsd = 1.1;
const totalDepositsToUsd = movements
  .filter(mov => mov > 0)
  .map((value, index, array) => {
    console.log(array);
    return value * eurToUsd;
  })
  //.map(mov => mov * eurToUsd)
  .reduce((accum, current) => accum + current, 0);
console.log(totalDepositsToUsd);
*/

////////////////////////////////////////////

/*
const testData = [5, 2, 4, 1, 15, 8, 3];
const testData2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = ages =>
  ages
    .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((accu, cur, i, arr) => accu + cur / arr.length, 0); // average

const avg1 = calcAverageHumanAge(testData);
const avg2 = calcAverageHumanAge(testData2);
console.log(avg1);
console.log(avg2);

/////////--FIND METHOD--/////////////
//loop the array and return the first element, that satisfies the condition

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const withdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(withdrawal);

console.log(accounts);

const account = accounts.find(accoun => accoun.owner === 'Jessica Davis');
console.log(account);
*/

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) ????
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them ????
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK ????
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.
dogs.forEach(dog => (dog.recomFood = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs);

const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);
console.log(
  `Sarah dog is eating too ${
    dogSarah.recomFood < dogSarah.curFood ? 'much' : 'little'
  }`
);
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recomFood) // condition => return new array
  .flatMap(dog => dog.owners);
//.map(dog => dog.owners)// return value
//.flat();// split 2 arrays in one
console.log(ownersEatTooMuch);
