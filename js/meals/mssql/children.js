function read() {
    return new Promise(function (resolve, reject) {
        var request = new common.mssql.db.Request(), children = [];
        request.stream = true;
        request.query(
            'SELECT children.childkey, children.first, children.last, ' +
                   'children.middle, children.dob, custchild.chfield1, ' +
                   'custchild.chfield2 ' +
                'FROM children ' +
                'INNER JOIN custchild ' +
                    'ON children.childkey = custchild.childkey ' +
                'INNER JOIN statuses ' +
                    'ON children.statuskey = statuses.statuskey ' +
                "WHERE statuses.name = 'Active'"
        );
        request.on('row', function (row) {children.push(row)});
        request.on('done', function () {resolve(children)});
        request.on('error', reject);
    });
}



module.exports.read = read;
