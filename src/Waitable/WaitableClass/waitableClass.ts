
import { Waitable, WaitableValueSymbol, waitableFromWaitableValue } from "../waitable";
import waitableValueClass from "./waitableValueClass";

export type WaitableClass<I,O> = ({(...args : Waitable<I>[]) : Waitable<O>});

function waitableClass<I,O>(f : {new(...args : I[]) : O}) : WaitableClass<I,O> {
    const valueClass = waitableValueClass(f);
    return function(...args) {
        return waitableFromWaitableValue(valueClass(...args.map(arg => arg[WaitableValueSymbol])));
    };
}

export default waitableClass;