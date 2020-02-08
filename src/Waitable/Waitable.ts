import WaitableValue from "./WaitableValue";
import ValueQForOne from "./Q/ValueQForOne";
import v from "./Util/v";
import waitableFunction from "./WaitableFunction/waitableFunction";

export const WaitableValueSymbol = Symbol("WaitableValue");
export type Waitable<T> = {[WaitableValueSymbol] : WaitableValue<T>};

export function waitableFromWaitableValue<T>(waitableValue : WaitableValue<T>) : Waitable<T> {
    const q = new ValueQForOne<T>(waitableValue);
    return <Waitable<T>>
    new Proxy(<any>(()=>{}), {                                     //Why using function? for construct and apply.
        /*
        상태 변화를 일으키는 메서드의 반환값은 기본적으로 true 입니다.
        즉, 실제로 그것이 변화를 일으켰는지는 알 수 없습니다.
        set이 불가능한 오브젝트와 키 같은 일반적이지 않은 상황에서는 사용하지 않는 것이 좋습니다. (대신 setter와 getter 함수를 만들어 이용)
        단순한 데에는 편리하게 사용할 수 있습니다.

        get 이외의 값을 읽어오는(또는 값과 관련된 무언가를 읽어오는) 함수들은 모두 사용 불가능입니다.
        get만이 이용자가 자신은 Waitable 객체를 가져오는 것이라고 인지할 수 있음.
        */
        get(target, prop) : (WaitableValue<T> | Waitable<any>) {
            if(prop === WaitableValueSymbol) {
                return waitableValue;
            } else {
                const propWaitable = waitable();
                q.push(value => {
                    v(propWaitable).set((<any>value)[prop]);
                });
                return propWaitable;
            }
        },
        set(target, prop, valueToSet) {
            if(prop === WaitableValueSymbol) return false;
            q.push(obj => {
                v(valueToSet).then(value => {
                    (<any>obj)[prop] = value;
                });
            });
            return true;
        },
        apply(target, thisArg, args) : Waitable<any> {
            const propWaitable = waitable();
            q.push(f => {
                const runAndSet = (parentObj : any) => {
                    v(waitableFunction((<any>f).bind(parentObj))(...args)).then(value => {
                        v(propWaitable).set(value);
                    });
                };
                if(thisArg) {
                    const thisObjWaitableValue = v(thisArg);
                    if(thisObjWaitableValue) {                    //Waitable 에서 get했던 놈이라면
                        thisObjWaitableValue.then(parentObj => {
                            runAndSet(parentObj);
                        });
                    } else {                                      //그냥 일반 객체에 쳐박아둔거 였다면
                        runAndSet(thisArg);
                    }
                } else {
                    runAndSet(thisArg);
                }
            });
            return propWaitable;
        },
        construct(target, args) : Waitable<any> {
            const propWaitable = waitable();
            q.push(classObj => {
                v(propWaitable).set(waitableFunction((...args) => {
                    return new (<any>classObj)(...args);
                })(...args));
            });
            return propWaitable;
        },
        defineProperty(target, prop, descriptor) {
            if(prop === WaitableValueSymbol) return false;
            q.push(obj => {
                Object.defineProperty(obj, prop, descriptor);
            });
            return true;
        },
        deleteProperty(target, prop) {
            if(prop === WaitableValueSymbol) return false;
            q.push(obj => {
                delete (<any>obj)[prop];
            });
            return true;
        },
        preventExtensions(target) {
            q.push(obj => {
                Object.preventExtensions(obj);
            });
            return true;
        },
        setPrototypeOf(target, prototype) {
            q.push(obj => {
                Object.setPrototypeOf(obj, prototype);
            });
            return true;
        },
        getOwnPropertyDescriptor() {
            throw `Waitable can't works with Object.getOwnPropertyDescriptor()`;
        },
        getPrototypeOf(target) {
            throw `Waitable can't works with Object.getPrototypeOf()`;
        },
        isExtensible(target) {
            throw `Waitable can't works with Object.isExtensible`;
        },
        has(target, key) {
            throw `Waitable can't works with "in" operator.`; //in을 처리할 방법이 없음. 로드되었을때 객체에서 사용하는것이 올바름.
        },
        ownKeys(target) {
            throw `Waitable can't works with Reflect.ownKeys()`; //키들을 알아낼 방법이 없음. 로드되었을때 객체에서 사용하는것이 올바름.
        }
    });
}

function waitable<T>(value? : T) : Waitable<T> {
    const waitableValue = arguments.length ? new WaitableValue<T>(value) : new WaitableValue<T>();
    return waitableFromWaitableValue(waitableValue);
}


export default waitable;