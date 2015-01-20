function main() {
    co(function* coroutine() {
        var model = meals.model,
            view = meals.view,
            date = new Date(),

            fs = require('fs'),
            path = require('path'),
            Log = require('log'), log,
    
            skip_mssql = false;

        date = new Date(date.getFullYear(), date.getMonth(), 0);


        try {
            window.log = global.log = log = new Log(
                'debug', fs.createWriteStream(
                    path.join(process.env.APPDATA, 'meals.log')
                )
            );
            view.init(false, date);
            yield* model.init(date);
        } catch (error) {
            if (error instanceof view.view_error) {
                log.error(error);
                log.debug(error.stack);
                //return setTimeout(function () {app.quit()}, 2000);
            } else if (error instanceof model.model_error) {
                view.show_error('Could not connect to Childcare Manager. Data may be out of date.');
                skip_mssql = true;
            } else {
                log.error(error);
                log.debug(error.stack);
                view.show_error('Error initializing Meals reporting app');
                //return setTimeout(function () {app.quit()}, 2000);
            }
        }


         try {
            yield* model.load(skip_mssql);
        } catch (error) {
            if (error instanceof model.model_error) {
                view.show_error(error);
            } else {
                log.error(error);
                log.debug(error.stack);
                view.show_error('Error retrieving and processing information from Childcare Manager');
            }
            //return setTimeout(function () {app.quit()}, 2000);
        }


        view.on('click', function (type, parameter) {
            log.debug('type: ', type);
            parameter && log.debug('parameter: ', parameter);

            switch (type) {
            // udpate report date. recalculates punches and redraws grid
            case 'date':
                model.date(parameter);
                break;

            // generate excel report. prompts for output file, then generates
            case 'excel':
                model.excel.begin(parameter);
                break;
            case 'excel:file':
                model.excel.create(parameter);
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
            }
        });
        view.enabled = true;
    });
}



module.exports = main;
