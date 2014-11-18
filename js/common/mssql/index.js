common.mssql = {
    config : {
        user : 'CCM-ADMIN',
        password : 'c#99jKlw,llAS',
        server : 'LOCALHOST\\CCMSERVER',
        database : 'HappyFaces',
        options : {
            requestTimeout : 1000000
        }
    },
    db : require('mssql')
};



common.mssql.connect = function connect() {
    return new Promise(function (resolve, reject) {
        common.mssql.db.connect(common.mssql.config, function (error) {
            if (error) reject(error);
            else resolve();
        });
    });
};



require('./mssqlerror');
