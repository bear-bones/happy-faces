function* init(report_date) {
    var date = new Date();

    this.report_date = report_date;

    try {
        yield common.mssql.connect();
        yield common.websql.connect();
    } catch (error) {
        log.error(error);
        if (error instanceof common.mssql.MsSqlError) {
            throw new model_error('Error connecting to ChildCare Manager database');
        } else if (error instanceof common.websql.WebSqlError) {
            throw new model_error('Error connecting to reporting database');
        } else {
            throw new model_error('Error connecting to databases');
        }
    }

    try {
        yield title_xx.websql.init();
    } catch (error) {
        log.error(error);
        throw new model_error('Error setting up reporting database');
    }

    try {
        title_xx.config = {};
        var config = yield title_xx.websql.config.read();
        Object.keys(config)
            .forEach(function (key) {title_xx.config[key] = config[key]});
    } catch (error) {
        log.error(error);
        throw new title_xx.model.model_error('Error loading app configuration');
    }
}



module.exports.init = init;
module.exports.load = require('./load.js');
module.exports.date = require('./date.js');
module.exports.excel = require('./excel.js');
module.exports.config = require('./config.js');
module.exports.edit = require('./edit.js');
module.exports.model_error = require('./modelerror.js');
