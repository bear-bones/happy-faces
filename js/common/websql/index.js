var config = (function () {
        var serial = window.localStorage.getItem('websql-config'), config;
        if (serial) {
            config = JSON.parse(serial);
        } else {
            config = {
                name : 'happy-faces',
                version : '1.0',
                desc : 'Happy Faces Title XX storage',
                size : 10 * 1024 * 1024  // 10MB
            };
            window.localStorage
                .setItem('websql-config', JSON.stringify(config));
        }
        return config;
    })();



function connect() {
    module.exports.db = window.openDatabase(
        config.name, config.version, config.desc, config.size
    );
}



module.exports.config = config;
module.exports.db = null;
module.exports.connect = connect;
module.exports.WebSqlError = require('./websqlerror.js');
