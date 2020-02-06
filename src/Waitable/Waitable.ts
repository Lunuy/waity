
import EventEmitter from "wolfy87-eventemitter";

export type Callback<T> = ((value : T) => void);

class Waitable<T> {
    callbacks: Callback<T>[];
    value: T;
    inited: boolean;
    constructor(value? : T) {
        this.callbacks = [];
        if(arguments.length) {
            this.value = value;
            this.inited = true;
        } else {
            this.inited = false;
        }
    }
    set(value : T) {
        this.value = value;
        this.inited = true;
        this.callbacks.forEach(callback => {
            callback(value);
        });
        this.callbacks = [];
    }
    then(callback : Callback<T>) {
        if(this.inited) {
            callback(this.value);
            return () => {};
        } else {
            this.callbacks.push(callback);
            return () => {
                this.callbacks.splice(this.callbacks.indexOf(callback), 1);
            };
        }
    }
}

export default Waitable;