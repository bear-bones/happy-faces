function ModelError(message) {
    this.name = 'ModelError';
    this.message = message;
}

ModelError.prototype = new Error();
ModelError.prototype.constructor = ModelError;



module.exports = ModelError;
