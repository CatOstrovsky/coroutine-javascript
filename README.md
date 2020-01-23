# CoroutineJS
## Implementing Unity Coroutine for JavaScript

CoroutineJS is a convenient way to control the execution of coroutines and make your code cleaner from Callback and Promise.
CoroutineJS provides a convenient interface for monitoring the execution of generator functions.
The library was prepared as part of the article: [Implementing Coroutine for JavaScript](https://web-panda.ru/post/coroutine-js)

### Key features of CoroutineJS:
I tried to maximally reproduce the main features of Unity Coroutine and added some of my pleasant improvements.
The main and most important method is `StartCoroutine`. This method takes a generator as an argument and automatically executes it until it hits the end of the function.
You can stop coroutine execution by returning `false` to` yield`. Unity uses the similar yield yield break construct to stop Corouine.
The `StartCoroutine` function returns a` Promise`, which is activated after the coroutine completes. This may be useful in some cases.
It is also possible to stop the coroutine using the following methods:
- `WaitForSeconds (<nubmer> seconds)` - stop the coroutine for a certain amount of time. The function accepts one parameter of type `nubmer` - stop time in seconds
- `WaitWhile (<function (bool)> function)` - stop the coroutine until the first parameter - the function returns `false`.
- `WaitPromise (<Promise> function)` - stop the coroutine until the `-Promise` parameter completes.

You can expand the list of stop functions yourself. To do this, they must have a function `activate`, which returns` Promise`. The coroutine will continue after the `Promise` completes.

Usage example:  

    function* TestCoroutineFunction() {
        console.log("Starting a coroutine");

        yield null;
        console.log("[yield null] First coroutine stop completed");

        yield new WaitForSeconds(3);
        console.log("[WaitForSeconds] Coroutine stop for 3 seconds completed");

        let i = 0;
        yield new WaitWhile(() => {
            i++;
            return i < 100
        });

        console.log("[WaitWhile] The coroutine stop by condition is completed. Now i is exactly equal "+i)

        yield new WaitPromise(() => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve()
                }, 1000)
            })        
        })

        console.log("[WaitPromise] The coroutine stop on Promise is completed. Promise is over")
    }

    StartCoroutine(TestCoroutineFunction)
    .then(() => {
        console.log("Coroutine ended!")
    });