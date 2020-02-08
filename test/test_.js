const { v, waitable, waitableFunction, Q } = require("../dist/index");

const plus = waitableFunction((a, b) => {
    return a + b;
});

const a = waitable(4);
const b = waitable();

const c = plus(a, b);
v(c).then(value => {
    console.log("결과 : " + value);
});

v(b).set(5);