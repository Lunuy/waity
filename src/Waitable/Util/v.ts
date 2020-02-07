import { Waitable, WaitableValueSymbol } from "../waitable";

function v<T>(waitable : Waitable<T>) {
    return waitable[WaitableValueSymbol];
}

export default v;