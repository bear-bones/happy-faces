function WebSqlError(message) {
   this.name = 'WebSqlError';
   this.message = message;
}

WebSqlError.prototype = new Error();
WebSqlError.prototype.constructor = WebSqlError;



module.exports = WebSqlError;
