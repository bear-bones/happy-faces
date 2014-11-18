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
