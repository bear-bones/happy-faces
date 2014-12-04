function main() {
    co(function* coroutine() {
        var model = title_xx.model,
            view = title_xx.view;


        // TODO: start logging


        // TODO: start view


        try {
            yield* model.init();
            // model.status_screen = view.open_status_screen();
            yield* model.read_ccm();
            yield* model.write_local();
            yield* model.process_data();
            // view.close_status_screen();
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
        title_xx.excel.generate('C:/Users/James/Desktop/test.xlsx');
    });
}



module.exports = main;
