function main() {
    co(function* coroutine() {
        // TODO: start logging
        // TODO: start view here

        try {
            yield common.mssql.connect();
            yield common.websql.connect();
        } catch (error) {
            console.error(error);
            if (error instanceof common.mssql.MsSqlError) {
                console.error('Error connecting to ChildCare Manager database');
            } else if (error instanceof common.websql.WebSqlError) {
                console.error('Error connecting to reporting database');
            } else {
                console.error('Error connecting to databases');
            }
            return;
        }


        try {
            yield title_xx.websql.init();
        } catch (error) {
            console.error(error);
            console.log('Error setting up reporting database');
            return;
        }


        try {
            title_xx.config = yield title_xx.websql.config.read();
        } catch (error) {
            console.error(error);
            console.error('Error loading Title XX Reports app configuration');
            return;
        }
        console.log(title_xx.config);


        // TODO: progress screen instead of console.log
        console.log('Loading child information from ChildCare Manager');

        var children, punches;
        try {
            children = yield title_xx.mssql.children.read();
        } catch (error) {
            console.error(error);
            console.error('Error reading child information');
            return;
        }
        console.log('Loaded ' + children.length + ' children.');
        console.log('1st child: ', children[0]);

        console.log('Loading punch information from ChildCare Manager...');
        try {
            punches
                = yield title_xx.mssql.punches.read(title_xx.config.last_load);
        } catch (error) {
            console.error(error);
            console.error('Error reading punch information');
            return;
        }
        console.log('Loaded ' + punches.length + ' punches.');
        console.log('1st punch: ', punches[0]);


        console.log('Saving child information to reporting database...');
        try {
            var fields = children.map(function (child) {return {
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
            console.error('Error saving child information into reporting database');
            return;
        }
        console.log('Child information saved.');


        console.log('Saving punch information to reporting database...');
        try {
            yield title_xx.websql.punches.create_all(
                punches.map(function (value, key) {return {
                    punch_id : value.pkChildTime, child_id : value.fkChild,
                    time_in : value.dtTimeIn, time_out : value.dtTimeOut
                }})
            );
        } catch (error) {
            console.error(error);
            console.error('Error saving punch information into reporting database');
            return;
        }
        console.log('Punch information saved.');
    });
}



function get_age(dob) {
    if (!dob) return null;

    var now = new Date(),
        y1 = now.getFullYear(), y2 = dob.getFullYear(),
        m1 = now.getMonth(), m2 = dob.getMonth(),
        d1 = now.getDay(), d2 = dob.getDay();

    return y1 - y2 - (m1 < m2 || (m1 === m2 && d1 < d2));
}



module.exports = main;
