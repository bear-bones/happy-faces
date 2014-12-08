function main() {
    co(function* coroutine() {
        var model = title_xx.model,
            view = title_xx.view,
            date = new Date();
        date = new Date(date.getFullYear(), date.getMonth(), 0);


        try {
            // TODO: start logging
            view.init(false, date);
            yield* model.init(date);
        } catch (error) {
            if (error instanceof view.view_error) {
                console.error(error);
            } else if (error instanceof model.model_error) {
                yield view.show_error(error);
            } else {
                console.error(error);
                yield view.show_error('Error initializing Title XX reporting app');
            }
            // app.quit();
            return;
        }


        try {
            yield* model.load();
        } catch (error) {
            if (error instanceof model.model_error) {
                yield view.show_error(error);
            } else {
                console.error(error);
                yield view.show_error('Error retrieving and processing information from Chilcare Manager');
            }
            // app.quit();
            return;
        }


        view.on('click', function (type, parameter) {
            console.log(type);
            parameter && console.log(parameter);

            switch (type) {
            // udpate report date. recalculates punches and redraws grid
            case 'date':
                model.date(parameter);
                break;

            // generate excel report. prompts for output file, then generates
            case 'excel':
                model.excel.begin();
                break;
            case 'excel:file':
                model.excel.create(parameter);
                break;
            case 'excel:cancel':
                model.excel.cancel();
                break;

            // update configuration. pops up config edit screen and saves new
            // config values when done
            case 'config':
                model.config.begin();
                break;
            case 'config:save':
                model.config.save(parameter);
                break;
            case 'config:cancel':
                model.config.cancel();
                break;

            // update 
            case 'edit':
                model.edit.begin(parameter);
                break;
            case 'edit:save':
                model.edit.save(parameter);
                break;
            case 'edit:cancel':
                model.edit.cancel();
                break;
            }
        });
        view.enabled = true;

        //title_xx.excel.generate('C:/Users/James/Desktop/test.xlsx');
    });
}



module.exports = main;
