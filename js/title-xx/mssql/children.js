function read() {
    return new Promise(function (resolve, reject) {
        var request = new common.mssql.db.Request(), children = [];
        request.stream = true;
        request.query('SELECT childkey, first, last, middle, dob FROM children');
        request.on('row', function (row) {children.push(row)});
        request.on('done', function () {resolve(children)});
        request.on('error', reject);
    });
}



module.exports.read = read;
