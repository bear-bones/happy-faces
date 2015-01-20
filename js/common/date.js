Date.prototype.clone = function () {return new Date(this.getTime())};
Date.prototype.inc = function (i) {this.setDate(this.getDate() + (i || 1))};
