window.Date.prototype.clone = function () {return new Date(this.getTime())};
window.Date.prototype.inc = function (i) {
    if (i === undefined || i === null) i = 1;
    return this.setDate(this.getDate() + i), this;
};
global.Date.prototype.clone = function () {return new Date(this.getTime())};
global.Date.prototype.inc = function (i) {
    if (i === undefined || i === null) i = 1;
    return this.setDate(this.getDate() + i), this;
};
