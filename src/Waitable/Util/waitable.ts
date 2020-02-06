
import Waitable from "../Waitable";

export type WaitableFunction<I,O> = ((...args : Waitable<I>[]) => Waitable<O>);

function waitable<I,O>(f : (...args : I[]) => O) : WaitableFunction<I,O> {
    return function(...args) {
        const result = new Waitable<O>();
        let remainArgsCount = args.length;
        const valueArgs : I[] = [];
        args.forEach((arg, index) => {
            arg.then(value => {
                remainArgsCount--;
                valueArgs[index] = value;
                if(!remainArgsCount) {
                    result.set(f.apply(undefined, valueArgs));
                }
            });
        });

        return result;
    };
}

export default waitable;