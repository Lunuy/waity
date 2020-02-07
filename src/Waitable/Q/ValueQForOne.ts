import WaitableValue, { Callback } from "../WaitableValue";

type Request<T> = Callback<T>;

class ValueQForOne<T> {
    target: WaitableValue<T>;
    q: Request<T>[];
    listening: boolean;
    constructor(target : WaitableValue<T>, q : Request<T>[] = []) {
        this.target = target;
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
        this.target.then(value => {
            request(value);
            if(this.q.length) {
                this._listen();
            } else {
                this.listening = false;
            }
        })
    }
    push(callback : Callback<T>) {
        this.q.push(callback);
        if(!this.listening) {
            this.listening = true;
            this._listen();
        }
        return this;
    }
}

export default ValueQForOne;