title_xx.websql.children = {};



title_xx.websql.children.init = function () {
    var create = 'CREATE TABLE children  (child_id INTEGER, name TEXT, age INTEGER, claim_num INTEGER, line_num INTEGER, fee BOOLEAN, auth_unit VARCHAR(8), auth_amount DECIMAL)';
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



title_xx.websql.children.create = function (fields) {
    var keys = Object.keys(fields).filter(function (key) {
            return key === 'child_id' || key === 'name' || key === 'age'
                || key === 'claim_num' || key === 'line_num' || key === 'fee'
                || key === 'auth_unit' || key === 'auth_amount';
        }),
        values = keys.map(function (key) {return fields[key]}),
        placeholders = new Array(length);
    placeholders.fill('?');

    return new Promise(function (resolve, reject) {
        if (!('child_id' in keys)) {
            return reject(new common.websql.WebSqlError('Id field required'));
        }

        title_xx.websql.db.transaction(function (t) {
            t.executeSql(
                'INSERT INTO children (' + keys.join(', ') + ') VALUES ('
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



title_xx.websql.children.read = function () {
    return new Promise(function (resolve, reject) {
        title_xx.websql.db.transaction(function (t) {
            t.executeSql('SELECT * FROM children', [], function (t, results) {
                var i = 0,
                    length = results.rows.length,
                    children = new Array(length);
                for (; i < length; ++i) children[i] = results.rows.item(i);
                resolve(children);
            }, function (t, error) {
                reject(error);
            });
        });
    });
};



title_xx.websql.children.update = function (fields) {
    var keys = Object.keys(fields).filter(function (key) {
            return key === 'name' || key === 'age' || key === 'claim_num'
                || key === 'line_num' || key === 'fee' || key === 'auth_unit'
                || key === 'auth_amount';
        }),
        values = keys.map(function (key) {return fields[key]}),
        statement = keys.join(' = ?,') + (keys.length ? ' = ?' : '');

    return new Promise(function (resolve, reject) {
        if ('child_id' in fields) values.push(fields.child_id);
        else return reject(
            new common.websql.WebSqlError('Id field required')
        );

        if (!values.length) reject(
            new common.websql.WebSqlError('No valid fields given')
        );

        title_xx.websql.db.transaction(function (t) {
            t.executeSql(
                'UPDATE children SET ' + statement + ' WHERE child_id = ?',
                values, function () {
                    resolve();
                }, function (t, error) {
                    reject(error);
                }
            );
        });
    });
};
