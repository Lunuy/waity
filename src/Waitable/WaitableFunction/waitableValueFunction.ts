
import WaitableValue from "../WaitableValue";

export type WaitableValueFunction<I,O> = ((...args : WaitableValue<I>[]) => WaitableValue<O>);

function waitableValueFunction<I,O>(f : (...args : I[]) => O) : WaitableValueFunction<I,O> {
    return function(...args) {
        const result = new WaitableValue<O>();
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

        if(!args.length) {
            result.set(f.apply(undefined, valueArgs));
        }

        return result;
    };
}

export default waitableValueFunction;