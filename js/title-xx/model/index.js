function get_age(dob) {
    if (!dob) return null;

    var now = new Date(),
        y1 = now.getFullYear(), y2 = dob.getFullYear(),
        m1 = now.getMonth(), m2 = dob.getMonth(),
        d1 = now.getDay(), d2 = dob.getDay();

    return y1 - y2 - (m1 < m2 || (m1 === m2 && d1 < d2));
}



function* init() {
    try {
        yield common.mssql.connect();
        yield common.websql.connect();
    } catch (error) {
        console.error(error);
        if (error instanceof common.mssql.MsSqlError) {
            throw new ModelError('Error connecting to ChildCare Manager database');
        } else if (error instanceof common.websql.WebSqlError) {
            throw new ModelError('Error connecting to reporting database');
        } else {
            throw new ModelError('Error connecting to databases');
        }
    }


    try {
        yield title_xx.websql.init();
    } catch (error) {
        console.error(error);
        throw new ModelError('Error setting up reporting database');
    }


    try {
        title_xx.config = yield title_xx.websql.config.read();
    } catch (error) {
        console.error(error);
        throw new ModelError('Error loading Title XX Reports app configuration');
    }
}



function* read_ccm() {
    var children, punches;


    console.log('Loading child information from ChildCare Manager');
    try {
        children = yield title_xx.mssql.children.read();
    } catch (error) {
        console.error(error);
        throw new title_xx.ModelError('Error reading child information');
    }
    console.log('Loaded ' + children.length + ' children.');
    console.log('1st child: ', children[0]);


    console.log('Loading punch information from ChildCare Manager...');
    try {
        punches
            = yield title_xx.mssql.punches.read(title_xx.config.last_load);
    } catch (error) {
        console.error(error);
        throw new title_xx.ModelError('Error reading punch information');
    }
    console.log('Loaded ' + punches.length + ' punches.');
    console.log('1st punch: ', punches[0]);


    title_xx.model.data = children.map(function (child) {return {
        child_id : child.childkey,
        name : child.last + ', ' + child.first + ' ' + (child.middle || ''),
        age : get_age(child.dob)
    }});
    title_xx.model.punches = punches;
}



function* write_local() {
    console.log('Saving child information to reporting database...');
    try {
        var exists = yield title_xx.websql.children.exists(title_xx.model.data);
        yield title_xx.websql.children.create_all(
            title_xx.model.data.filter(function (_, key) {return !exists[key]})
        );
        yield title_xx.websql.children.update_all(
            title_xx.model.data.filter(function (_, key) {return exists[key]})
        );
        yield title_xx.websql.children.delete_except(title_xx.model.data);
    } catch (error) {
        console.error(error);
        throw new title_xx.model.ModelError('Error saving child information into reporting database');
    }
    console.log('Child information saved.');


    console.log('Saving punch information to reporting database...');
    try {
        yield title_xx.websql.punches.create_all(
            title_xx.model.punches.map(function (value, key) {return {
                punch_id : value.pkChildTime, child_id : value.fkChild,
                time_in : value.dtTimeIn && value.dtTimeIn.getTime(),
                time_out : value.dtTimeOut && value.dtTimeOut.getTime()
            }})
        );
    } catch (error) {
        console.error(error);
        throw new title_xx.model.ModelError('Error saving punch information into reporting database');
    }
    console.log('Punch information saved.');
}



function* process_data(row_id) {
    var data = title_xx.model.data;


    try {
        title_xx.model.config = {};
        var config = yield title_xx.websql.config.read(),
            date = new Date();
        Object.keys(config).forEach(function (key) {
            title_xx.model.config[key] = config[key];
        });
        if (date.getMonth() > title_xx.model.config.title_xx_year_start)
            date.setMonth(title_xx.model.config.title_xx_year_start, 1);
        else
            date.setMonth(12 - title_xx.model.config.title_xx_year_start, 1);
        title_xx.model.config.title_xx_year_start = date.getTime();
    } catch (error) {
        console.error(error);
        throw new title_xx.model.ModelError('Error loading app configuration');
    }


    console.log('Processing child punches...');
    try {
        for (var i = 0, length = data.length; i < length; ++i) {
            var child = data[i];
            child.punches = yield title_xx.websql.punches.read(
                child.child_id, title_xx.model.config.title_xx_year_start
            );
            child.time = new Array(12);
            child.time.fill(0);

            if (child.auth_unit === 'days') {
                time = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
                for (var j = 0, len = child.punches.length; j < len; ++j) {
                    var punch = child.punches[j],
                        date = new Date(punch.time_in),
                        month = date.getMonth(), day = '' + date.getDate();
                    if (!(day in time[month])) {
                        time[month][day] = true;
                        ++child.time[month];
                    }
                }
            } else {
                for (var j = 0, len = child.punches.length; j < len; ++j) {
                    var punch = child.punches[j];
                    child.time[(new Date(punch.time_in)).getMonth()]
                        += (punch.time_out - punch.time_in) / 3600000;
                }
            }
        }
    } catch (error) {
        console.error(error);
        throw new title_xx.model.ModelError('Error loading punch information per child');
    }
    console.log('All children processed.');
    for (var i = 0, length = data.length; i < length; ++i) {
        if (data[i].punches.length > 0) {
            data[i].punches = data[i].punches.map(function (punch) {
                return (new Date(punch.time_in)).toString() + ' '
                    + (new Date(punch.time_out)).toString();
            });
            console.log('1st child with punches: ', data[i]);
            break;
        }
    }


    title_xx.model.data
        = data.filter(function (child) {return child.punches.length});
}



module.exports.init = init;
module.exports.read_ccm = read_ccm;
module.exports.write_local = write_local;
module.exports.process_data = process_data;
module.exports.ModelError = require('./modelerror.js');
