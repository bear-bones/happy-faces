module.exports = function update(new_date) {
    // new_date comes in like '2014-12' for December 2014. we want the date to
    // wind up being 12/31/2014, so:
    //  (1) we leave the month as is, even though js uses months 0-11, because we
    //      want the *next* month, because...
    //  (2) we set the day to 0, which js corrects to be the last day of the
    //      previous month (our correct month)
    new_date = new_date.split('-');
    new_date = new Date(new_date[0], new_date[1], 0);

    if (new_date.getTime() === meals.model.report_date.getTime()) return;
    else meals.model.report_date = new_date;

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
