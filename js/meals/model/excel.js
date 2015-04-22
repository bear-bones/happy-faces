function get_report(report) {
    switch (report) {
    // child birthdays
    case 'misc>birthday': return {
        name : 'birthday',
        generate : meals.excel.misc.birthday.generate};
    // punches without clockout (TODO)
    case 'misc>no-clock-out': return {
        name : 'no-clock-out',
        generate : meals.excel.misc.no_clock_out.generate};
    // monthly summary report
    case 'meals>summary': return {
        name : 'monthly summary',
        generate : meals.excel.meals.summary.generate};
    // monthly state reimbursement report
    case 'meals>state': return {
        name : 'monthly state',
        generate : meals.excel.meals.state.generate};
    // blank meals reports
    case 'meals>blank>saturday': return {
        name : 'blank saturday',
        generate : function () {meals.excel.meals.saturday.generate('blank')}};
    case 'meals>blank>breakfast': return {
        name : 'blank breakfast snack by week',
        generate : function () {
            meals.excel.meals.meal.generate('blank', 'breakfast')}};
    case 'meals>blank>lunch': return {
        name : 'blank lunch by week',
        generate :
            function () {meals.excel.meals.meal.generate('blank', 'lunch')}};
    case 'meals>blank>afternoon': return {
        name : 'blank afternoon snack by week',
        generate : function () {
            meals.excel.meals.meal.generate('blank', 'afternoon')}};
    case 'meals>blank>supper': return {
        name : 'blank supper by week',
        generate :
            function () {meals.excel.meals.meal.generate('blank', 'supper')}};
    case 'meals>blank>evening': return {
        name : 'blank evening snack by week',
        generate :
            function () {meals.excel.meals.meal.generate('blank', 'evening')}};
    // completed meals reports (single table)
    case 'meals>complete>saturday': return {
        name : 'saturday',
        generate :
            function () {meals.excel.meals.saturday.generate('complete')}};
    case 'meals>complete>breakfast': return {
        name : 'breakfast by week',
        generate : function () {
            meals.excel.meals.meal.generate('complete', 'breakfast')}};
    case 'meals>complete>lunch': return {
        name : 'lunch by week',
        generate : function () {
            meals.excel.meals.meal.generate('complete', 'lunch')}};
    case 'meals>complete>afternoon': return {
        name : 'afternoon snack by week',
        generate : function () {
            meals.excel.meals.meal.generate('complete', 'afternoon')}};
    case 'meals>complete>supper': return {
        name : 'supper by week',
        generate : function () {
            meals.excel.meals.meal.generate('complete', 'supper')}};
    case 'meals>complete>evening': return {
        name : 'evening snack by week',
        generate : function () {
            meals.excel.meals.meal.generate('complete', 'evening')}};
    // completed meals reports (tables by classroom)
    case 'meals>classroom>saturday': return {
        name : 'saturday',
        generate :
            function () {meals.excel.meals.saturday.generate('classroom')}};
    case 'meals>classroom>breakfast': return {
        name : 'breakfast by week',
        generate : function () {
            meals.excel.meals.meal.generate('classroom', 'breakfast')}};
    case 'meals>classroom>lunch': return {
        name : 'lunch by week',
        generate : function () {
            meals.excel.meals.meal.generate('classroom', 'lunch')}};
    case 'meals>classroom>afternoon': return {
        name : 'afternoon snack by week',
        generate : function () {
            meals.excel.meals.meal.generate('classroom', 'afternoon')}};
    case 'meals>classroom>supper': return {
        name : 'supper by week',
        generate : function () {
            meals.excel.meals.meal.generate('classroom', 'supper')}};
    case 'meals>classroom>evening': return {
        name : 'evening snack by week',
        generate : function () {
            meals.excel.meals.meal.generate('classroom', 'evening')}};
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
