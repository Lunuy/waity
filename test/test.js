const { V, waitable, waitableFunction, waitableClass, Q } = require("../dist/index");


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

    b[V].set(4);

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
    
    a[V].then(value => { console.log(`a setted! : ${value}`); });
    b[V].then(value => { console.log(`b setted! : ${value}`); });
    c[V].then(value => { console.log(`c setted! : ${value}`); });
    d[V].then(value => { console.log(`d setted! : ${value}`); });

    const a_plus_b = plus(a, b);
    const c_plus_d = plus(c, d);

    const a_plus_b_length = a_plus_b.length;
    const c_plus_d_length = c_plus_d.length;

    const length_difference = difference(a_plus_b_length, c_plus_d_length);
    b[V].set("WORLD");
    d[V].set("HOHOHOHO");

    console.log(a_plus_b[V].value);
    console.log(c_plus_d[V].value);
    console.log(length_difference[V].value);
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

    age[V].set(17);
    console.log(octopus.age[V].value);
    console.log(octopus.name[V].value);
    console.log(aboutOctopus[V].value);
})();



/* - - CLASS CONSTRUCT - - */
console.log(" - - CLASS CONSTRUCT - - ");
(() => {
    const Phone = waitableClass(class Phone {
        constructor(display, camera) {
            this.display = display;
            this.camera = camera;
        }
        viewCamera() {
            return this.display.view(this.camera.picture());
        }
    });
    const Display = waitableClass(class Display {
        view(data) {
            return data.join("\n");
        }
    });
    const Camera = waitableClass(class Camera {
        constructor(resolution) {
            this.resolution = resolution;
        }
        picture() {
            let lines = [];
            for(let i = 0; i < this.resolution; i++) {
                let line = "";
                for(let j = 0; j < this.resolution; j++) {
                    line += (i & j) ? "□" : "■";
                }
                lines.push(line);
            }
            return lines;
        }
    });

    const cameraResolution = waitable();
    const display = Display();
    const camera = Camera(cameraResolution);
    const phone = Phone(display, camera);

    const displayingPhoto = phone.viewCamera();
    const displayingMyData = phone.display.view(waitable(["MY","DISPLAY","DATA"]));

    cameraResolution[V].set(40);
    console.log("displayingPhoto -");
    console.log(displayingPhoto[V].value);
    console.log("displayingMyData -");
    console.log(displayingMyData[V].value);
})();