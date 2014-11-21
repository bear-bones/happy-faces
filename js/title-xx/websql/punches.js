function init() {
    var create = 'CREATE TABLE IF NOT EXISTS punches (punch_id INTEGER, child_id INTEGER, time_in, TIMESTAMP, time_out TIMESTAMP)';
    return new Promise(function (resolve, reject) {
        common.websql.db.transaction(function (t) {
            t.executeSql(
                create, [], function (t) {resolve()},
                function (t, error) {reject(error)}
            );
        });
    });
}



function create(fields) {
    var keys = Object.keys(fields).filter(function (key) {
            return key === 'punch_id' || key === 'child_id' || key === 'time_in'
                || key === 'time_out';
        }),
        values = keys.map(function (key) {return fields[key]}),
        placeholders = new Array(length);
    placeholders.fill('?');

    if (!('punch_id' in keys && 'child_id' in keys))
        return new common.websql.WebSqlError('Id fields required');

    return new Promise(function (resolve, reject) {
        common.websql.db.transaction(function (t) {
            t.executeSql(
                'INSERT INTO punches (' + keys.join(', ') + ') VALUES ('
                    + placeholders.join(', ') + ')',
                values, function () {resolve()},
                function (t, error) {reject(error)}
            );
        });
    });
}



function read(child_id) {
    var sql = 'SELECT * FROM punches',
        values = [];

    if (child_id !== undefined) {
        sql += ' WHERE child_id = ?';
        values.push(child_id);
    }

    return new Promise(function (resolve, reject) {
        common.websql.db.transaction(function (t) {
            t.executeSql(sql, values, function (t, results) {
                var i = 0,
                    length = results.rows.length,
                    punches = new Array(length);
                for (; i < length; ++i) punches[i] = results.rows.item(i);
                resolve(punches);
            }, function (t, error) {reject(error)});
        });
    });
}



module.exports.init = init;
module.exports.create = create;
module.exports.read = read;
