const { v, waitable, waitableFunction, Q } = require("../dist/index");


const plus = waitableFunction((a, b) => {
    return a + b;
});

const product = waitableFunction((...values) => {
    return values.reduce((prev, value) => prev * value, 1);
});

const difference = waitableFunction((a, b) => {
    return Math.abs(a - b);
});


/* - - NUMBER - - */
console.log(" - - NUMBER - - ");
(() => {
    const a = waitable(3);
    const b = waitable();     //will be 4

    const a_plus_b = plus(a,b); //will be 7
    const c = waitable(3);
    const d = waitable(5);

    const results = [];

    const q = new Q;

    q
    .push(product(a_plus_b, c, d), value => results.push(value)) //will be 105 second, push first
    .push(product(c, d), value => results.push(value))           //will be 15  first , push second
    .push(product(b, d), value => results.push(value))           //will be 20  third , push third

    v(b).set(4);

    //It works 100% SYNC
    console.log(results);
})();



/* - - STRING - - */
console.log(" - - STRING - - ");
(() => {
    const a = waitable("HELLO");  //length 5
    const b = waitable();         //will length 5

    const c = waitable("HAHAHA"); //length 6
    const d = waitable();         //will length 8
    
    v(a).then(value => { console.log(`a setted! : ${value}`); });
    v(b).then(value => { console.log(`b setted! : ${value}`); });
    v(c).then(value => { console.log(`c setted! : ${value}`); });
    v(d).then(value => { console.log(`d setted! : ${value}`); });

    const a_plus_b = plus(a, b);
    const c_plus_d = plus(c, d);

    const a_plus_b_length = a_plus_b.length;
    const c_plus_d_length = c_plus_d.length;

    const length_difference = difference(a_plus_b_length, c_plus_d_length);
    v(b).set("WORLD");
    v(d).set("HOHOHOHO");

    console.log(v(a_plus_b).value);
    console.log(v(c_plus_d).value);
    console.log(v(length_difference).value);
})();



/* - - OBJECT - - */
console.log(" - - OBJECT - - ");
(() => {
    const makeName = waitableFunction((firstName, lastName) => {
        return `${firstName} ${lastName}`;
    });
    const makeOctopus = waitableFunction((age) => {
        return {
            age,
            aboutMe() {
                return `Hello! My name is ${this.name}, I am ${this.age} years old. I have ${this.legs} legs.`;
            }
        };
    });

    const age = waitable();
    const octopus = makeOctopus(age);

    const firstName = waitable("Tako");
    const lastName = waitable("Yaki");
    octopus.name = makeName(firstName, lastName);
    octopus.legs = waitable(80);
    
    const aboutOctopus = octopus.aboutMe();

    v(age).set(17);
    console.log(v(octopus.age).value);
    console.log(v(octopus.name).value);
    console.log(v(aboutOctopus).value);
})();