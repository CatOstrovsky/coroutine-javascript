# CoroutineJS
## Имплементация Unity Coroutine для JavaScript

CoroutineJS - это удобный способ контролировать выполнение сопрограмм и сделать Ваш код более чистым от Callback и Promise.
CoroutineJS предоставляет удобный интерфейс для контроля выполнения функций-генераторов.
Библиотека подготовлена в рамках статьи: [Имплементация Coroutine для JavaScript](https://web-panda.ru/post/coroutine-js)

### Основные возможности CoroutineJS:
Я постарался максимально воспроизвести основные возможности Unity Coroutine и добавил немного своих приятных доработок.   
Основным и самым важным методом является `StartCoroutine`. Этот метод принимает в качестве аргумента генератор и автоматически выполняет его, пока не упрется в конец функции.   
Вы можете остановить выполнение сопрограммы, вернув в `yield` значение `false`. Для остановки Corouine в Unity используется аналогичная конструкция `yield return break`.  
Функция `StartCoroutine` возвращает `Promise`, который активируется после завершения сопрограммы. Это может быть полезно в некоторых случаях.  
Так же есть возможность остановки сопрограммы при помощи следующих методов:  
- `WaitForSeconds(<nubmer> seconds) `- остановка сопрограммы на определенное количество времени. Функция принимает один параметр типа `nubmer` - время остановки в секундах   
- `WaitWhile(<function(bool)> function) `- остановка сопрограммы до тех пор, пока первый параметр - функция не вернет `false`.   
- `WaitPromise(<Promise> function)` - остановка сопрограммы, пока не завершится параметр-`Promise`.  

Вы можете самостоятельно расширять списки стоп-функций. Для этого они обязательно должны иметь функцию `activate`, которая возвращает `Promise`. Сопрограмма продолжится после того как завершится `Promise`.

Пример использования `StartCoroutine` в `JavaScript`:  

    function* TestCoroutineFunction() {
        console.log("Начало работы сопрограммы");

        yield null;
        console.log("[yield null] Первая остановка сопрограммы завершена");

        yield new WaitForSeconds(3);
        console.log("[WaitForSeconds] Остановка сопрограммы на 3 секунды завершена");

        let i = 0;
        yield new WaitWhile(() => {
            i++;
            return i < 100
        });

        console.log("[WaitWhile] Остановка сопрограммы по условию завершена. Теперь i точно равен "+i)

        yield new WaitPromise(() => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve()
                }, 1000)
            })        
        })

        console.log("[WaitPromise] Остановка сопрограммы по Promise завершена. Promise завершился")
    }

    StartCoroutine(TestCoroutineFunction)
    .then(() => {
        console.log("Сопрограмма завершилась!")
    });