function init() {
    var create = 'CREATE TABLE IF NOT EXISTS children (child_id INTEGER PRIMARY KEY, name TEXT, age INTEGER, claim_num INTEGER, line_num INTEGER, fee BOOLEAN, auth_unit VARCHAR(8), auth_amount DECIMAL)',
        index = 'CREATE INDEX IF NOT EXISTS child_key ON children (claim_num, line_num)';
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



function exists(rows) {
    return new Promise(function (resolve, reject) {
        common.websql.db.transaction(function (t) {
            if (rows instanceof Array) {
                var result = {}, length = rows.length;
                rows.forEach(function (fields) {
                    var child_id = fields.child_id;
                    t.executeSql(
                        'SELECT COUNT(*) AS count FROM children WHERE child_id = ?',
                        [child_id], function (t, results) {
                            result[child_id] = results.rows.item(0).count === 1;
                            if (! --length) resolve(rows.map(
                                function (r) {return result[r.child_id]}
                            ));
                        }, function(t, error) {reject(error)}
                    );
                });
            } else {
                t.executeSql(
                    'SELECT COUNT(*) FROM children WHERE child_id = ?',
                    [rows.child_id], function (t, results) {
                        resolve(results.rows.item(0).count === 1)
                    }, function(t, error) {reject(error)}
                );
            }
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
                    'INSERT INTO children (' + keys.join(', ') + ') VALUES ('
                        + placeholders.join(', ') + ')',
                    values, function () {if (! --count) resolve()},
                    function (t, error) {reject(error)}
                );
            }
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
                'INSERT INTO children (' + keys.join(', ') + ') VALUES ('
                    + placeholders.join(', ') + ')',
                values, function (t, result) {resolve(result)},
                function (t, error) {reject(error)}
            );
        });
    });
}



function read(child_id) {
    var sql = 'SELECT * FROM children ORDER BY claim_num, line_num',
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
                        var item = results.rows.item(i);
                        children[i] = {};
                        Object.keys(item).forEach(function (key) {
                            children[i][key] = item[key];
                        });
                    }
                    resolve(children);
                } else {
                    resolve(results.rows.length ? results.rows.item(0) : null);
                }
            }, function (t, error) {reject(error)});
        });
    });
}



function update_all(rows) {
    var i = 0, length = rows.length;

    return new Promise(function (resolve, reject) {
        var count = length;
        if (!count) resolve();
        common.websql.db.transaction(function (t) {
            for (; i < length; ++i) {
                var fields = rows[i],
                    keys = Object.keys(fields)
                        .filter(function (key) {return key !== 'child_id'}),
                    values = keys.map(function (key) {return fields[key]});
                values.push(fields.child_id);
                t.executeSql(
                    'UPDATE children SET ' + keys.join(' = ?, ')
                        + ' = ? WHERE child_id = ?',
                    values, function () {if (! --count) resolve()},
                    function (t, error) {reject(error)}
                );
            }
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



function delete_except(rows) {
    return new Promise(function (resolve, reject) {
        common.websql.db.transaction(function(t) {
            // too many `AND`s in a row makes sqlite choke
            var tests = rows.map(function (fields) {
                    return 'child_id != ' + fields.child_id;
                }),
                exprs = [];
            for (var i = 0, length = tests.length; i < length; i += 500)
                exprs.push('(' + tests.slice(i, i + 500).join(' AND ') + ')');
            t.executeSql(
                'DELETE FROM children WHERE ' + exprs.join(' AND '),
                [], function () {resolve()}, function (t, error) {reject(error)}
            );
        });
    });
}



module.exports.init = init;
module.exports.exists = exists;
module.exports.create_all = create_all;
module.exports.create = create;
module.exports.read = read;
module.exports.update_all = update_all;
module.exports.update = update;
module.exports.delete_except = delete_except;
