function init() {
    var create = 'CREATE TABLE IF NOT EXISTS children (child_id INTEGER, name TEXT, age INTEGER, claim_num INTEGER, line_num INTEGER, fee BOOLEAN, auth_unit VARCHAR(8), auth_amount DECIMAL)';
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
            return key === 'child_id' || key === 'name' || key === 'age'
                || key === 'claim_num' || key === 'line_num' || key === 'fee'
                || key === 'auth_unit' || key === 'auth_amount';
        }),
        values = keys.map(function (key) {return fields[key]}),
        placeholders = new Array(values.length);
    placeholders.fill('?');

    if (!('child_id' in keys))
        return new common.websql.WebSqlError('Id field required');

    return new Promise(function (resolve, reject) {
        common.websql.db.transaction(function (t) {
            t.executeSql(
                'INSERT OR REPLACE INTO children (' + keys.join(', ') + ') VALUES ('
                    + placeholders.join(', ') + ')',
                values, function () {resolve()},
                function (t, error) {reject(error)}
            );
        });
    });
}



function read(child_id) {
    var sql = 'SELECT * FROM children',
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
                    children = new Array(length);
                if (child_id === undefined) {
                    for (; i < length; ++i) children[i] = results.rows.item(i);
                    resolve(children);
                } else {
                    resolve(results.rows.length ? results.rows.item(0) : null);
                }
            }, function (t, error) {reject(error)});
        });
    });
}



function update(fields) {
    var keys = Object.keys(fields).filter(function (key) {
            return key === 'name' || key === 'age' || key === 'claim_num'
                || key === 'line_num' || key === 'fee' || key === 'auth_unit'
                || key === 'auth_amount';
        }),
        values = keys.map(function (key) {return fields[key]}),
        statement = keys.join(' = ?,') + (keys.length ? ' = ?' : '');

    if ('child_id' in fields) values.push(fields.child_id);
    else return new common.websql.WebSqlError('Id field required');

    if (!values.length)
        return new common.websql.WebSqlError('No valid fields given');

    return new Promise(function (resolve, reject) {
        common.websql.db.transaction(function (t) {
            t.executeSql(
                'UPDATE children SET ' + statement + ' WHERE child_id = ?',
                values, function () {resolve()},
                function (t, error) {reject(error)}
            );
        });
    });
}



module.exports.init = init;
module.exports.create = create;
module.exports.read = read;
module.exports.update = update;
