common.websql = {
    config : (function () {
        var serial = localStorage.getItem('websql-config'), config;
        if (serial) {
            config = serial ? JSON.parse(serial)
        } else {
            config = {
                name : 'happy-faces',
                version : '1.0',
                desc : 'Happy Faces Title XX storage'
                size : 10 * 1024 * 1024  // 10MB
            };
            localStorage.setItem('websql-config', JSON.serialize(config));
        }
        return config;
    })()
};



common.websql.connect = function connect() {
    common.websql.db = openDatabase(
        common.websql.config.name,
        common.websql.config.version,
        common.websql.config.desc,
        common.websql.config.size
    );
};



require('./websqlerror.js');
