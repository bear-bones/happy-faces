function read() {
    return new Promise(function (resolve, reject) {
        var request = new common.mssql.db.Request(), children = [];
        request.stream = true;
        request.query(
            'SELECT children.childkey, first, last, middle, dob ' +
                'FROM children INNER JOIN custchild ' +
                'ON children.childkey = custchild.childkey ' +
                "WHERE custchild.chfield1 = 'TXX'"
        );
        request.on('row', function (row) {children.push(row)});
        request.on('done', function () {resolve(children)});
        request.on('error', reject);
    });
}



module.exports.read = read;
