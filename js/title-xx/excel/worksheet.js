var XLSX = require('xlsx');



function Worksheet(cols) {
    this.rows = 0;
    this.cols = cols;
    this['!merges'] = [];
}


Worksheet.prototype.export = function () {
    var result = {};
    Object.keys(this).forEach(function (key) {
        if (key !== 'rows' && key !== 'cols') result[key] = this[key];
    }, this);
    result['!ref'] = XLSX.utils
        .encode_range({s : {c : 0, r : 0}, e : {c : this.cols, r : this.rows}});
    return result;
};



module.exports = Worksheet;
