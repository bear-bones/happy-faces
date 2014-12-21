var EventEmitter = require('events').EventEmitter,
    document = window.document;



function View() {
    EventEmitter.call(this);
}
View.prototype = new EventEmitter();



View.prototype.init = function init(enabled, date) {
    var self = this;

    this.enabled = enabled;
    this.update_date_button = document.getElementById('update-date-button');
    this.generate_xlsx_button = document.getElementById('generate-xlsx-button');
    this.config_button = document.getElementById('config-button');
    this.grid = document.getElementById('child-grid');
    this.toast = document.getElementById('error-toast');
    this.file = document.getElementById('file');
    this.file_toast = document.getElementById('file-error-toast');

    this.file.setAttribute('nwsaveas', '');
    this.file.setAttribute('nwworkingdir', process.env.USERPROFILE);


    if (window.polymer_ready) {
        document.getElementById('report-month-field').value
            = date.getFullYear() + '-' + (date.getMonth() + 1);
        document.getElementById('date-button')
            .addEventListener('click', on_update_date_click);
        document.getElementById('excel-button')
            .addEventListener('click', on_create_excel_click);
        document.getElementById('config-button')
            .addEventListener('click', on_config_click);
        this.file.addEventListener('change', function () {
            if (self.file.value)
                self.emit('click', 'excel:file', self.file.value);
            /* Unneeded, because the OS file chooser already handles this
            fs.exists(this.file.value, function (exists) {
                if (exists) this.file_toast.show();
                else self.emit('click', 'excel:file', self.file.value);
            }); */
        });
        //document.getElementById('toast-overwrite')
        //    .addEventListener('click', function () {
        //        self.emit('click', 'excel:file', self.file.value);
        //        self.file_toast.dismiss();
        //    });
        //document.getElementById('toast-cancel')
        //    .addEventListener('click', function () {
        //        self.file_toast.dismiss();
        //    });
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
            this.file.addEventListener('change', function () {
                if (self.file.value)
                    self.emit('click', 'excel:file', self.file.value);
                /* Unneeded, because the OS file chooser already handles this
                require('fs').exists(self.file.value, function (exists) {
                    if (exists) self.file_toast.show();
                    else self.emit('click', 'excel:file', self.file.value);
                }); */
            });
            //document.getElementById('toast-overwrite')
            //    .addEventListener('click', function () {
            //        self.emit('click', 'excel:file', self.file.value);
            //        self.file_toast.dismiss();
            //    });
            //document.getElementById('toast-cancel')
            //    .addEventListener('click', function () {
            //        self.file_toast.dismiss();
            //    });
            document.body.addEventListener('click', on_edit_click);
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
module.exports.view_error = require('./viewerror.js');
module.exports.status_dialog = require('./statusdialog.js');
module.exports.config_dialog = require('./configdialog.js');
module.exports.edit_dialog = require('./editdialog.js');