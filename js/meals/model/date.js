module.exports = function update(new_date) {
    // new_date comes in like '2014-12-31' for December 31, 2014
    // Note: javascript wants months as 0-11, hence the `new_date[1] - 1`
    new_date = new_date.split('-');
    new_date = new Date(new_date[0], new_date[1] - 1, new_date[2]);

    if (isNaN(new_date.getTime())) {
        meals.view.show_error('Invalid date.');
        return;
    } else if (new_date.getTime() === meals.model.report_date.getTime()) {
        return;
    } else {
        meals.model.report_date = new_date;
    }

    meals.view.status_dialog.open([{
        processing_message : 'Reprocessing punches by child for new date',
        complete_message : 'all punches processed.'
    }, {
        processing_message : 'Building child data table',
        complete_message : 'done!', indeterminate : true
    }]);
    meals.view.status_dialog.next();

    co(meals.model.load.process_data);
};
