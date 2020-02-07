import WaitableValue, { Callback } from "../WaitableValue";
import { Waitable, WaitableValueSymbol } from "../waitable";
import ValueQ from "./ValueQ";

type Request<T> = [Waitable<T>, Callback<T>];

class Q<T>  {
    valueQ : ValueQ<T>
    constructor(q : Request<T>[] = []) {
        this.valueQ = new ValueQ<T>(q.map(([waitable, callback]) => [waitable[WaitableValueSymbol], callback]));
    }
    push(waitable : Waitable<T>, callback : Callback<T>) {
        this.valueQ.push(waitable[WaitableValueSymbol], callback);
        return this;
    }
}

export default Q;