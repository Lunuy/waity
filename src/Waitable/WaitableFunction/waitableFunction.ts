
import { Waitable, WaitableValueSymbol, waitableFromWaitableValue } from "../waitable";
import waitableValueFunction from "./waitableValueFunction";

export type WaitableFunction<I,O> = ((...args : Waitable<I>[]) => Waitable<O>);

function waitableFunction<I,O>(f : (...args : I[]) => O) : WaitableFunction<I,O> {
    const valueFunction = waitableValueFunction(f);
    return function(...args) {
        return waitableFromWaitableValue(valueFunction(...args.map(arg => arg[WaitableValueSymbol])));
    };
}

export default waitableFunction;