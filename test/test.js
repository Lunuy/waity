const { Waitable, waitable, Q } = require("../dist/index");

const plus = waitable((a, b) => {
    return a + b;
});
const product = waitable((...values) => {
    return values.reduce((prev, value) => prev * value, 1);
});

const a = new Waitable(3);
const b = new Waitable;     //will be 4

const a_plus_b = plus(a,b); //will be 7
const c = new Waitable(3);
const d = new Waitable(5);

const results = [];

const q = new Q;

q
.push(product(a_plus_b, c, d), value => results.push(value)) //will be 105 second, push first
.push(product(c, d), value => results.push(value))           //will be 15  first , push second
.push(product(b, d), value => results.push(value))           //will be 20  third , push third

b.set(4);

//It works 100% SYNC
console.log(results);