function begin() {
    title_xx.view.select_file();
}


function create(file) {
    var fs = require('fs'),
        path = require('path')
        head = path.dirname(path.normalize(file)),
        self = this;
    file = path.join(head, path.basename(file, '.xlsx') + '.xlsx');

    co(function* () {
        var model = title_xx.model;

        title_xx.view.status_dialog.open([{
            processing_message : 'Generating Excel spreadsheet',
            complete_message : 'done!', indeterminate : true
        }]);
        title_xx.view.status_dialog.next();

        try {
            var exists = yield new Promise(function (resolve, reject) {
                fs.exists(head, resolve);
            });
            if (!exists) yield promise(fs.mkdir)(head);
        } catch (error) {
            log.error(error);
            log.debug(error.stack);
            return view.show_error('Error accessing destination directory.');
        }

        try {
            yield new Promise(function (resolve, reject) {
                setImmediate(function () { try {
                    title_xx.excel.generate(
                        file, model.data, title_xx.config, model.report_date
                    );
                    resolve();
                } catch (error) {
                    reject(error);
                }});
            });
            require('child_process').exec('explorer ' + head, function () {});
            title_xx.view.status_dialog.close();
        } catch (error) {
            title_xx.view.status_dialog.close();
            log.error(error);
            log.debug(error.stack);
            return title_xx.view.show_error('Error generating excel file.');
        }
    });
}



module.exports.begin = begin;
module.exports.create = create;
