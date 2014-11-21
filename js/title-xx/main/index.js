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

        // TODO: progress screen instead of console.log
        console.log('Loading child information...');

        var children, punches;
        try {
            children = yield title_xx.mssql.children.read();
        } catch (error) {
            console.error(error);
            console.error('Error reading child information');
            return;
        }
        console.log('Loaded ' + children.length + ' children.');

        console.log('Loading punch information (this will take a long time)...');
        try {
            punches = yield title_xx.mssql.punches.read();
        } catch (error) {
            console.error(error);
            console.error('Error reading punch information');
            return;
        }
        console.log('Loaded ' + punches.length + ' punches.');
    });
}



module.exports = main;
