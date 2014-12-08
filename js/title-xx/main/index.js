function main() {
    co(function* coroutine() {
        var model = title_xx.model,
            view = title_xx.view;


        // TODO: start logging


        view.init(false);
        view.status_dialog.open([{
            processing_message : 'Loading children from CCM database',
            complete_message : 'done!', indeterminate : true
        }, {
            processing_message : 'Loading punches from CCM database',
            complete_message : 'done!', indeterminate : true
        }, {
            processing_message : 'Updating children in reporting database',
            complete_message : 'done!', indeterminate : true
        }, {
            processing_message : 'Saving new punches into database',
            complete_message : 'done!', indeterminate : true
        }, {
            processing_message : 'Processing punches by child',
            complete_message : 'done!'
        }, {
            processing_message : 'Building table of children',
            complete_message : 'done!', indeterminate : true
        }]);



        try {
            yield* model.init(view);
            view.status_dialog.next();
            yield* model.read_ccm();
            yield* model.write_local();
            yield* model.process_data();
        } catch (error) {
            if (error instanceof model.ModelError) {
                // view.show_error(error);
            } else {
                console.error(error);
                // view.show_error('Error retrieving and processing information from Chilcare Manager');
            }
            return;
        }


        // TODO: listen for events
        //title_xx.excel.generate('C:/Users/James/Desktop/test.xlsx');
    });
}



module.exports = main;
