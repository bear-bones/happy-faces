function get_report(report) {
    switch (report) {
    // child birthdays
    case 'misc>birthday':
        return {name: 'birthday', generate: function (done) {
            meals.excel.misc.birthday.generate(done);
        }};
    // punches without clockout
    case 'misc>no-clock-out':
        return {name: 'no-clock-out', generate: function (done) {
            meals.excel.misc.no_clock_out.generate(done);
        }};
    // monthly summary report
    case 'meals>summary':
        return {name: 'monthly summary', generate: function (done) {
            meals.excel.meals.summary.generate(done);
        }};
    // monthly state reimbursement report
    case 'meals>state':
        return {name: 'monthly state', generate: function (done) {
            meals.excel.meals.state.generate(done);
        }};
    // blank meals reports
    case 'meals>blank>weekdays':
        return {name: 'weekdays by classroom', generate: function (done) {
            meals.excel.meals.weekdays.generate(done, true);
        }};
    case 'meals>blank>saturdays':
        return {name: 'saturdays by classroom', generate: function (done) {
            meals.excel.meals.saturdays.generate(done, true);
        }};
    case 'meals>blank>saturday':
        return {name: 'blank saturday', generate: function (done) {
            meals.excel.meals.saturday.generate(done, 'blank');
        }};
    case 'meals>blank>breakfast':
        return {name: 'blank breakfast snack', generate: function (done) {
            meals.excel.meals.meal.generate(done, 'blank', 'breakfast');
        }};
    case 'meals>blank>lunch':
        return {name: 'blank lunch', generate: function (done) {
            meals.excel.meals.meal.generate(done, 'blank', 'lunch');
        }};
    case 'meals>blank>afternoon':
        return {name: 'blank afternoon snack', generate: function (done) {
            meals.excel.meals.meal.generate(done, 'blank', 'afternoon');
        }};
    case 'meals>blank>supper':
        return {name: 'blank supper', generate: function (done) {
            meals.excel.meals.meal.generate(done, 'blank', 'supper');
        }};
    case 'meals>blank>evening':
        return {name: 'blank evening snack', generate: function (done) {
            meals.excel.meals.meal.generate(done, 'blank', 'evening');
        }};
    // completed meals reports (single table)
    case 'meals>complete>weekdays':
        return {name: 'weekdays by classroom', generate: function (done) {
            meals.excel.meals.weekdays.generate(done);
        }};
    case 'meals>complete>saturdays':
        return {name: 'saturdays by classroom', generate: function (done) {
            meals.excel.meals.saturdays.generate(done);
        }};
    case 'meals>complete>saturday':
        return {name: 'saturday', generate: function (done) {
            meals.excel.meals.saturday.generate(done, 'complete');
        }};
    case 'meals>complete>breakfast':
        return {name: 'breakfast', generate: function (done) {
            meals.excel.meals.meal.generate(done, 'complete', 'breakfast');
        }};
    case 'meals>complete>lunch':
        return {name: 'lunch', generate: function (done) {
            meals.excel.meals.meal.generate(done, 'complete', 'lunch');
        }};
    case 'meals>complete>afternoon':
        return {name: 'afternoon snack', generate: function (done) {
            meals.excel.meals.meal.generate(done, 'complete', 'afternoon');
        }};
    case 'meals>complete>supper':
        return {name: 'supper', generate: function (done) {
            meals.excel.meals.meal.generate(done, 'complete', 'supper');
        }};
    case 'meals>complete>evening':
        return {name: 'evening snack', generate: function (done) {
            meals.excel.meals.meal.generate(done, 'complete', 'evening');
        }};
    // roll call reports
    case 'roll>classroom':
        return {name: 'hours by classroom', generate: function (done) {
            meals.excel.roll.classroom.generate(done);
        }};
    case 'roll>blank>day':
        return {name: 'blank roll call (day)', generate: function (done) {
            meals.excel.roll.common.generate(done, true, false, 'day');
        }};
    case 'roll>blank>week':
        return {name: 'blank roll call (week)', generate: function (done) {
            meals.excel.roll.common.generate(done, true, false, 'week');
        }};
    case 'roll>blank>month':
        return {name: 'blank roll call (month)', generate: function (done) {
            meals.excel.roll.common.generate(done, true, false, 'month');
        }};
    case 'roll>complete>day':
        return {name: 'roll call (day)', generate: function (done) {
            meals.excel.roll.common.generate(done, false, false, 'day');
        }};
    case 'roll>complete>week':
        return {name: 'roll call (week)', generate: function (done) {
            meals.excel.roll.common.generate(done, false, false, 'week');
        }};
    case 'roll>complete>month':
        return {name: 'roll call (month)', generate: function (done) {
            meals.excel.roll.common.generate(done, false, false, 'month');
        }};
    };
}



function begin(report) {
    meals.view.select_file();
    this.current_report = get_report(report);
}


function create(file) {
    var fs = require('fs'),
        path = require('path')
        head = path.dirname(path.normalize(file)),
        self = this;


    if (!this.current_report) {
        log.error(new Error('Unknown report'));
        return meals.view.show_error('Unknown report.');
    }


    meals.excel.file_name
        = path.join(head, path.basename(file, '.xlsx') + '.xlsx');


    co(function* () {
        var model = meals.model;

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

        meals.view.status_dialog.open([{
            processing_message
                : 'Generating ' + self.current_report.name + ' report',
            complete_message : 'done!', indeterminate : true
        }]);
        meals.view.status_dialog.next();

        try {
            yield new Promise(function (resolve, reject) {
                function done(error) {error ? reject(error) : resolve()}
                setImmediate(function () {try {
                    self.current_report.generate(done);
                } catch (error) {
                    reject(error);
                }});
            });
            require('child_process').exec('explorer ' + head, function () {});
        } catch (error) {
            log.error(error);
            log.debug(error.stack);
            return meals.view.show_error('Error generating excel file.');
        } finally {
            meals.view.status_dialog.close();
        }
    });
}



module.exports.begin = begin;
module.exports.create = create;
