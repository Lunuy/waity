import Waitable, { Callback } from "../Waitable";

type Request<T> = [Waitable<T>, Callback<T>];

class Q<T> {
    q: Request<T>[];
    listening: boolean;
    constructor(q : Request<T>[] = []) {
        this.q = q;
        if(q.length) {
            this.listening = true;
            this._listen();
        } else {
            this.listening = false;
        }
    }
    _listen() {
        const request = this.q.splice(0, 1)[0];
        request[0].then(value => {
            request[1](value);
            if(this.q.length) {
                this._listen();
            } else {
                this.listening = false;
            }
        })
    }
    push(waitable : Waitable<T>, callback : Callback<T>) {
        this.q.push([waitable, callback]);
        if(!this.listening) {
            this.listening = true;
            this._listen();
        }

        return this;
    }
}

export default Q;