common.mssql.MsSqlError = function MsSqlError(message) {
    this.name = 'MsSqlError';
    this.message = message;
};

common.mssql.MsSqlError.prototype = new Error();
common.mssql.MsSqlError.prototype.constructor = common.mssql.MsSqlError;
