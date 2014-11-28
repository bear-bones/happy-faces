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


    title_xx.model.children = children;
    title_xx.model.punches = punches;
}



function* write_local() {
    console.log('Saving child information to reporting database...');
    try {
        var fields = title_xx.model.children.map(function (child) {return {
                child_id : child.childkey,
                name : child.last + ', ' + child.first + ' ' + child.middle,
                age : get_age(child.dob)
            }}),
            exists = yield title_xx.websql.children.exists(fields);
        yield title_xx.websql.children.create_all(
            fields.filter(function (_, key) {return !exists[key]})
        );
        yield title_xx.websql.children.update_all(
            fields.filter(function (_, key) {return exists[key]})
        );
        yield title_xx.websql.children.delete_except(fields);
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
                time_in : value.dtTimeIn, time_out : value.dtTimeOut
            }})
        );
    } catch (error) {
        console.error(error);
        throw new title_xx.model.ModelError('Error saving punch information into reporting database');
    }
    console.log('Punch information saved.');
}



function* process_data(row_id) {
}



module.exports.init = init;
module.exports.read_ccm = read_ccm;
module.exports.write_local = write_local;
module.exports.process_data = process_data;
module.exports.ModelError = require('./modelerror.js');
