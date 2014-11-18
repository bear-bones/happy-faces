title_xx.mssql.children = {};



title_xx.mssql.children.read = function (child_id) {
    return new Promise(function (resolve, reject) {
        var request = new title_xx.mssql.db.Request()
            children = [];
        request.stream = true;
        request.query('SELECT childkey, first, last, middle, dob FROM children');
        request.on('row', function (row) {children.push(row)});
        request.on('done', function () {resolve(children)});
        request.on('error', reject);
    });
};
