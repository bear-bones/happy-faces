/**
 * A function to magically turn any asynchronous function into a promise-
 * yielding function.
 */
function promise(async) {
    return function () {
        var parameters = Array.from(arguments);
        return new Promise(function (resolve, reject) {
            parameters.push(function () {
                var parameters = Array.from(arguments),
                    error = parameters.shift();
                if (error) reject(error);
                else resolve.call(this, parameters);
            });
            async.call(this, parameters);
        });
    }
}



/**
 * A function to run a method as a coroutine, meaning that it can call any
 * asynchronous method that returns a promise as if it were synchronous by
 * prefixing it with `yield`.
 */
function co(generator) {
    generator = generator();
    var result;
     
    (function recurse(error, value) {
        if (error) generator.throw(error);
         
        result = generator.next(value);
        if (result.done) return;
         
        if ('then' in result.value) {
            result.value.then(function (v) {recurse(null, v)}, recurse);
        } else {
            setImmediate(function () {recurse(null, result.value)});
        }
    })();
}
