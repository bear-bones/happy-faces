function MsSqlError(message) {
   this.name = 'MsSqlError';
   this.message = message;
}

MsSqlError.prototype = new Error();
MsSqlError.prototype.constructor = MsSqlError;

module.exports = MsSqlError;
