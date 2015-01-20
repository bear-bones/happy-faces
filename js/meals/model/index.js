function* init(report_date) {
    var date = new Date(),
        model_error = this.model_error,
        mssql_error = false;

    this.report_date = report_date;

    try {
        yield common.mssql.connect();
    } catch (error) {
        log.error(error);
        log.debug(error.stack);
        mssql_error = true;
    }

    try {
        yield common.websql.connect();
    } catch (error) {
        log.error(error);
        log.debug(error.stack);
        throw new model_error('Error connecting to reporting database');
    }

    try {
        yield meals.websql.init();
    } catch (error) {
        log.error(error);
        log.debug(error.stack);
        throw new model_error('Error setting up reporting database');
    }

    try {
        meals.config = {};
        var config = yield meals.websql.config.read();
        Object.keys(config)
            .forEach(function (key) {meals.config[key] = config[key]});
    } catch (error) {
        log.error(error);
        log.debug(error.stack);
        throw new model_error('Error loading app configuration');
    }

    if (mssql_error) throw new model_error('Error connecting to ChildCare Manager database');
}



module.exports.init = init;
module.exports.load = require('./load.js');
module.exports.date = require('./date.js');
module.exports.excel = require('./excel.js');
module.exports.config = require('./config.js');
module.exports.model_error = require('./modelerror.js');
