common.websql.WebSqlError = function WebSqlError(message) {
    this.name = 'WebSqlError';
    this.message = message;
};

common.websql.WebSqlError.prototype = new Error();
common.websql.WebSqlError.prototype.constructor = common.websql.WebSqlError;
