function ViewError(message) {
   this.name = 'ViewError';
   this.message = message;
}

ViewError.prototype = new Error();
ViewError.prototype.constructor = ViewError;



module.exports = ViewError;
