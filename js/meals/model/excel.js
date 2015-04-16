function get_report(report) {
    switch (report) {
    case 'misc>birthday': return {
        name : 'birthday',
        generate : meals.excel.misc.birthday.generate};
    case 'misc>no-clock-out': return {
        name : 'no-clock-out',
        generate : meals.excel.misc.no_clock_out.generate};
    case 'meals>summary': return { //TODO
        name : 'monthly summary',
        generate : meals.excel.meals.summary.generate};
    case 'meals>state': return { //TODO
        name : 'monthly state',
        generate : meals.excel.meals.state.generate};
    //case 'meals>blank>roll': return {
    //    name : 'blank roll call by room',
    //    generate : function () {meals.excel.meals.roll.generate(1)}};
    case 'meals>blank>saturday': return {
        name : 'blank saturday',
        generate : function () {meals.excel.meals.saturday.generate(1)}};
    case 'meals>blank>breakfast': return {
        name : 'blank breakfast snack by week',
        generate
            : function () {meals.excel.meals.meal.generate(1, 'breakfast')}};
    case 'meals>blank>lunch': return {
        name : 'blank lunch by week',
        generate : function () {meals.excel.meals.meal.generate(1, 'lunch')}};
    case 'meals>blank>afternoon': return {
        name : 'blank afternoon snack by week',
        generate
            : function () {meals.excel.meals.meal.generate(1, 'afternoon')}};
    case 'meals>blank>supper': return {
        name : 'blank supper by week',
        generate : function () {meals.excel.meals.meal.generate(1, 'supper')}};
    case 'meals>blank>evening': return {
        name : 'blank evening snack by week',
        generate : function () {meals.excel.meals.meal.generate(1, 'evening')}};
    //case 'meals>complete>roll': return {
    //    name : 'roll call by room',
    //    generate : meals.excel.meals.roll.generate};
    case 'meals>complete>saturday': return {
        name : 'saturday',
        generate : meals.excel.meals.saturday.generate};
    case 'meals>complete>breakfast': return {
        name : 'breakfast by week',
        generate
            : function () {meals.excel.meals.meal.generate(0, 'breakfast')}};
    case 'meals>complete>lunch': return {
        name : 'lunch by week',
        generate : function () {meals.excel.meals.meal.generate(0, 'lunch')}};
    case 'meals>complete>afternoon': return {
        name : 'afternoon snack by week',
        generate
            : function () {meals.excel.meals.meal.generate(0, 'afternoon')}};
    case 'meals>complete>supper': return {
        name : 'supper by week',
        generate : function () {meals.excel.meals.meal.generate(0, 'supper')}};
    case 'meals>complete>evening': return {
        name : 'evening snack by week',
        generate : function () {meals.excel.meals.meal.generate(0, 'evening')}};
    case 'roll>blank>day': return {
        name : 'blank roll call (day)',
        generate : function () {meals.excel.roll.generate(1, 0, 'day')}};
    case 'roll>blank>week': return {
        name : 'blank roll call (week)',
        generate : function () {meals.excel.roll.generate(1, 0, 'week')}};
    case 'roll>blank>month': return {
        name : 'blank roll call (month)',
        generate : function () {meals.excel.roll.generate(1, 0, 'month')}};
    case 'roll>complete>day': return {
        name : 'roll call (day)',
        generate : function () {meals.excel.roll.generate(0, 0, 'day')}};
    case 'roll>complete>week': return {
        name : 'roll call (week)',
        generate : function () {meals.excel.roll.generate(0, 0, 'week')}};
    case 'roll>complete>month': return {
        name : 'roll call (month)',
        generate : function () {meals.excel.roll.generate(0, 0, 'month')}};
    //case 'roll>supper>day': return {
    //    name : 'supper roll call (day)',
    //    generate : function () {meals.excel.roll.generate(0, 1, 'day')}};
    //case 'roll>supper>week': return {
    //    name : 'supper roll call (week)',
    //    generate : function () {meals.excel.roll.generate(0, 1, 'week')}};
    //case 'roll>supper>month': return {
    //    name : 'supper roll call (month)',
    //    generate : function () {meals.excel.roll.generate(0, 1, 'month')}};
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
        return view.show_error('Unknown report.');
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
                setImmediate(function () {try {
                    resolve(self.current_report.generate());
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
