title_xx.mssql.punches = {};



title_xx.mssql.punches.read = function (last_load, child_id) {
    var year_ago = new Date();
    year_ago.setFullYear(year_ago.getFullYear() - 1);

    if (last_load === undefined || last_load < year_ago) last_load = year_ago;

    return new Promise(function (resolve, reject) {
        var request = new title_xx.mssql.db.Request()
            punches = [];
        request.stream = true;
        request.input('lastload', title_xx.mssql.db.Int, last_load);
        if (child_id !== undefined) {
            request.input('childid', title_xx.mssql.db.Int, child_id);
            request.query('SELECT pkChildTime, fkChild, dtTimeIn, dtTimeOut FROM tblChildTimeCards WHERE DateCreated >= @lastload AND fkChild = @childid');
        } else {
            request.query('SELECt pkChildTime, fkChild, dtTimeIn, dtTimeOut FROM tblChildTimeCards WHERE DateCreated >= @lastload');
        }
        request.on('row', function (row) {punches.push(row)});
        request.on('done', function () {resolve(punches)});
        request.on('error', reject);
    });
};
