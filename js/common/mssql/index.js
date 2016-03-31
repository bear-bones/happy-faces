var config = {
       user : 'CCM-ADMIN',
       password : 'c#99jKlw,llAS',
       server : 'LOCALHOST\\CCMSERVER',
       database : 'HAPPY FACES',
       options : {
          connectTimeout : 30000,
          requestTimeout : 1000000
       }
   },
   db = require('mssql');



function connect() {
   return new Promise(function (resolve, reject) {
      db.connect(config, function (error) {error ? reject(error) : resolve()});
   });
};



module.exports.config = config;
module.exports.db = db;
module.exports.connect = connect;
module.exports.MsSqlError = require('./mssqlerror');
