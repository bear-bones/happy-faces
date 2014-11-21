try {
    require('./async');
    exports.mssql = require('./mssql');
    exports.websql = require('./websql');
} catch (error) {
    console.error(error);
}
