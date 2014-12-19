var EventEmitter = require('events').EventEmitter,
    document = window.document;



function View() {
    EventEmitter.call(this);
}
View.prototype = new EventEmitter();



View.prototype.init = function init(enabled, date) {
    this.enabled = enabled;
    this.update_date_button = document.getElementById('update-date-button');
    this.generate_xlsx_button = document.getElementById('generate-xlsx-button');
    this.config_button = document.getElementById('config-button');
    this.grid = document.getElementById('child-grid');
    this.toast = document.getElementById('error-toast');


    if (window.polymer_ready) {
        document.getElementById('report-month-field').value
            = date.getFullYear() + '-' + (date.getMonth() + 1);
        document.getElementById('date-button')
            .addEventListener('click', on_update_date_click);
        document.getElementById('excel-button')
            .addEventListener('click', on_create_excel_click);
        document.getElementById('config-button')
            .addEventListener('click', on_config_click);
        document.body.addEventListener('click', on_edit_click);
    } else {
        window.addEventListener('polymer-ready', function () {
            document.getElementById('report-month-field').value
                = date.getFullYear() + '-' + (date.getMonth() + 1);
            document.getElementById('date-button')
                .addEventListener('click', on_update_date_click);
            document.getElementById('excel-button')
                .addEventListener('click', on_create_excel_click);
            document.getElementById('config-button')
                .addEventListener('click', on_config_click);
            document.body.addEventListener('click', on_edit_click);
        });
    }
};



View.prototype.show_error = function show_error(message) {
    return new Promise(function (resolve) {
        window.alert(message);
        setImmediate(resolve);
    });
}



View.prototype.set_grid = function set_grid(data) {
    window.document.getElementById('child-grid').data = data;
};



View.prototype.sort_grid = function sort_grid() {
    this.difference_column = this.difference_column
        || document.querySelector('#child-grid::shadow .column-diff');
    this.difference_column.click();
};



function on_update_date_click() {
    if (!title_xx.view.enabled) return;
    title_xx.view.emit(
        'click', 'date', document.getElementById('report-month-field').value
    );
}



function on_create_excel_click() {
    if (!title_xx.view.enabled) return;
    title_xx.view.emit('click', 'excel');
}



function on_config_click() {
    if (!title_xx.view.enabled) return;
    title_xx.view.emit('click', 'config');
}



function on_edit_click(event) {
    if (!title_xx.view.enabled) return;

    var node = event && event.path && event.path.length && event.path.item(0);
    if (!node || node.className !== 'edit-button'
        || node.parentNode.nodeName !== 'TD'
    ) return;

    title_xx.view.emit('click', 'edit', node.id);
}



module.exports = new View();
module.exports.status_dialog = require('./statusdialog.js');
module.exports.config_dialog = require('./configdialog.js');
module.exports.edit_dialog = require('./editdialog.js');
