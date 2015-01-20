function init() {
    var create = 'CREATE TABLE IF NOT EXISTS children (child_id INTEGER PRIMARY KEY, name TEXT, age INTEGER, classification CHAR(1), classroom TEXT)',
        index = 'CREATE INDEX IF NOT EXISTS child_key ON children (name)';
    return new Promise(function (resolve, reject) {
        common.websql.db.transaction(function (t) {
            t.executeSql(
                create, [], function (t) {t.executeSql(
                    index, [], function (t) {resolve()},
                    function (t, error) {reject(error)}
                )}, function (t, error) {reject(error)}
            );
        });
    });
}



function create_all(rows) {
    var i = 0, length = rows.length;
    return new Promise(function (resolve, reject) {
        var count = length;
        if (!count) resolve();
        common.websql.db.transaction(function (t) {
            for (; i < length; ++i) {
                fields = rows[i];
                var keys = Object.keys(fields),
                    values = keys.map(function (key) {return fields[key]}),
                    placeholders = new Array(values.length);
                placeholders.fill('?');
                t.executeSql(
                    'INSERT OR REPLACE INTO children (' + keys.join(', ') + ') '
                        + 'VALUES (' + placeholders.join(', ') + ')',
                    values, function () {if (! --count) resolve()},
                    function (t, error) {reject(error)}
                );
            }
        });
    });
}



function read(child_id) {
    var sql = 'SELECT * FROM children ORDER BY name',
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
                    for (; i < length; ++i) {
                        var item = results.rows.item(i); children[i] = {};
                        Object.keys(item)
                            .forEach(function (k) {children[i][k] = item[k]});
                    }
                    resolve(children);
                } else {
                    resolve(results.rows.length ? results.rows.item(0) : null);
                }
            }, function (t, error) {reject(error)});
        });
    });
}



function delete_all() {
    return new Promise(function (resolve, reject) {
        common.websql.db.transaction(function(t) {
            t.executeSql(
                'DELETE FROM children', [],
                function () {resolve()}, function (t, error) {reject(error)}
            );
        });
    });
}



module.exports.init = init;
module.exports.create_all = create_all;
module.exports.read = read;
module.exports.delete_all = delete_all;
