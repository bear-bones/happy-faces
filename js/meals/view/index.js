var EventEmitter = require('events').EventEmitter,
    document = window.document;



function View() {
    EventEmitter.call(this);
}
View.prototype = new EventEmitter();



View.prototype.init = function init(enabled, date) {
    var self = this;

    require('./menu.js').init();

    this.enabled = enabled;
    this.update_date_button = document.getElementById('update-date-button');
    this.config_button = document.getElementById('config-button');
    this.toast = document.getElementById('error-toast');
    this.file = document.getElementById('file');
    this.file_toast = document.getElementById('file-error-toast');

    this.file.setAttribute('nwsaveas', '');
    this.file.setAttribute('nwworkingdir', process.env.USERPROFILE);


    if (window.polymer_ready) {
        //document.getElementById('report-month-field').value
        //    = date.getFullYear() + '-' + (date.getMonth() + 1);
        document.getElementById('date-button')
            .addEventListener('click', on_update_date_click);
        document.getElementById('config-button')
            .addEventListener('click', on_config_click);
        this.file.addEventListener('change', function () {
            if (self.file.value)
                self.emit('click', 'excel:file', '' + self.file.value);
            self.file.value = '';
        });
    } else {
        window.addEventListener('polymer-ready', function () {
            //document.getElementById('report-month-field').value
            //    = date.getFullYear() + '-' + (date.getMonth() + 1);
            document.getElementById('date-button')
                .addEventListener('click', on_update_date_click);
            document.getElementById('config-button')
                .addEventListener('click', on_config_click);
            this.file.addEventListener('change', function () {
                if (self.file.value)
                    self.emit('click', 'excel:file', '' + self.file.value);
                self.file.value = '';
            });
        });
    }
};



View.prototype.set_grid = function set_grid(data) {
    window.document.getElementById('child-grid').data = data;
};



View.prototype.sort_grid = function sort_grid() {
    this.difference_column = this.difference_column
        || document.querySelector('#child-grid::shadow .column-diff');
    this.difference_column.click();
};



View.prototype.show_error = function show_error(message) {
    this.toast.setAttribute('text', message);
    this.toast.show();
};



View.prototype.select_file = function select_file() {
    this.file.click();
};



function on_update_date_click() {
    if (!meals.view.enabled) return;
    meals.view.emit(
        'click', 'date', document.getElementById('report-month-field').value
    );
}



function on_config_click() {
    if (!meals.view.enabled) return;
    meals.view.emit('click', 'config');
}



module.exports = new View();
module.exports.view_error = require('./viewerror.js');
module.exports.menu = require('./menu.js');
module.exports.status_dialog = require('./statusdialog.js');
module.exports.config_dialog = require('./configdialog.js');
