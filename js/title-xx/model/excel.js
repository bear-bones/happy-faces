function begin() {
    title_xx.view.file_dialog.open();
}


function create(file) {
    var fs = require('fs'),
        path = require('path')
        head = path.dirname(path.normalize(file)),
        self = this;
    file = path.join(head, path.basename(file, '.xlsx') + '.xlsx');

    co(function* () {
        try {
            yield promise(fs.mkdir)(head);
        } catch (error) {
            console.error(error);
            return // view.show_error('Error accessing destination directory');
        }

        title_xx.view.status_dialog.open([{
            processing_message : 'Generating Excel spreadsheet',
            complete_message : 'done!', indefinite : true
        }]);
        title_xx.view.status_dialog.next();

        try {
            yield title_xx.excel.generate(file, this.data, this.config);
        } catch (error) {
            console.error(error);
            return // title_xx.view.show_error('Error accessing destination directory');
        } finally {
            title_xx.view.status_dialog.close();
        }
    });
}


function cancel() {
    title_xx.view.file_dialog.close();
}



module.exports.begin = begin;
module.exports.create = create;
module.exports.cancel = cancel;
