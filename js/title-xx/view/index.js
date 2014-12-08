var EventEmitter = require('events').EventEmitter,
    document = window.document;



function View() {
    EventEmitter.call(this);
}
View.prototype = new EventEmitter();



View.prototype.init = function init(enabled) {
    this.enabled = enabled;
    this.update_date_button = document.getElementById('update-date-button');
    this.generate_xlsx_button = document.getElementById('generate-xlsx-button');
    this.config_button = document.getElementById('config-button');
    this.grid = document.getElementById('child-grid');
};



function on_update_date_click() {
    if (!this.enabled) return;
}



function on_generate_xlsx_click() {
    if (!this.enabled) return;
}



function on_config_click() {
    if (!this.enabled) return;
}



function on_edit_click() {
    if (!this.enabled) return;
}



module.exports = new View();
module.exports.status_dialog = require('./statusdialog.js');
module.exports.config_dialog = require('./configdialog.js');
