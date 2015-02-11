window.Date.prototype.clone = function () {return new Date(this.getTime())};
window.Date.prototype.inc
    = function (i) {this.setDate(this.getDate() + (i || 1)); return this};
global.Date.prototype.clone = function () {return new Date(this.getTime())};
global.Date.prototype.inc
    = function (i) {this.setDate(this.getDate() + (i || 1)); return this};
