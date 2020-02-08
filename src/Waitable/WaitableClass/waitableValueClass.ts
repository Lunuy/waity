import { WaitableValue } from "../..";
import waitableValueFunction from "../WaitableFunction/waitableValueFunction";

export type WaitableValueClass<I,O> = ({(...args : WaitableValue<I>[]) : WaitableValue<O>}); //I 입력들을 넣어서 O객체가 나오는겅

function waitableValueClass<I,O>(classObj : {new(...args : I[]) : O}) : WaitableValueClass<I,O> {
    return waitableValueFunction((...args) => {
        return new classObj(...args);
    });
}

export default waitableValueClass;