title_xx.websql.punches = {};



title_xx.websql.punches.init = function () {
    var create = 'CREATE TABLE punches  (punch_id INTEGER, child_id INTEGER, time_in, TIMESTAMP, time_out TIMESTAMP)';
    return new Promise(function (resolve, reject) {
        title_xx.websql.db.transaction(function (t) {
            t.executeSql(create, [], function (t) {
                resolve();
            }, function (t, error) {
                reject(error);
            });
        });
    });
};



title_xx.websql.punches.create = function (fields) {
    var keys = Object.keys(fields).filter(function (key) {
            return key === 'punch_id' || key === 'child_id' || key === 'time_in'
                || key === 'time_out';
        }),
        values = keys.map(function (key) {return fields[key]}),
        placeholders = new Array(length);
    placeholders.fill('?');

    return new Promise(function (resolve, reject) {
        if (!('punch_id' in keys && 'child_id' in keys)) {
            return reject(new common.websql.WebSqlError('Id fields required'));
        }

        title_xx.websql.db.transaction(function (t) {
            t.executeSql(
                'INSERT INTO punches (' + keys.join(', ') + ') VALUES ('
                    + placeholders.join(', ') + ')',
                values, function () {
                    resolve();
                }, function (t, error) {
                    reject(error);
                }
            );
        });
    });
};



title_xx.websql.punches.read = function (child_id) {
    return new Promise(function (resolve, reject) {
        title_xx.websql.db.transaction(function (t) {
            var sql = 'SELECT * FROM punches',
                values = [];
            if (child_id !== undefined) {
                sql += ' WHERE child_id = ?';
                values.push(child_id);
            }
            t.executeSql(sql, values, function (t, results) {
                var i = 0,
                    length = results.rows.length,
                    punches = new Array(length);
                for (; i < length; ++i) punches[i] = results.rows.item(i);
                resolve(punches);
            }, function (t, error) {
                reject(error);
            });
        });
    });
};
