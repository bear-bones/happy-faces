function init() {
    var create = 'CREATE TABLE IF NOT EXISTS punches (punch_id INTEGER PRIMARY KEY, child_id INTEGER REFERENCES children(child_id) ON DELETE CASCADE, time_in INTEGER, time_out INTEGER)',
        index = 'CREATE INDEX IF NOT EXISTS punch_key ON punches (child_id, time_in)';
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
        common.websql.db.transaction(function (t) {
            var count = length;
            if (!count) resolve();
            for (; i < length; ++i) {
                fields = rows[i];
                var keys = Object.keys(fields),
                    values = keys.map(function (key) {return fields[key]}),
                    placeholders = new Array(values.length);
                placeholders.fill('?');
                t.executeSql(
                    'INSERT OR IGNORE INTO punches (' + keys.join(', ') + ') VALUES ('
                        + placeholders.join(', ') + ')',
                    values, function () {if (! --count) resolve()},
                    function (t, error) {reject(error)}
                );
            }
        });
    });
}



function read(child_id, time) {
    var sql = 'SELECT * FROM punches',
        values = [];

    if (child_id !== undefined) {
        sql += ' WHERE child_id = ?';
        values.push(child_id);

        if (time !== undefined) {
            sql += ' AND time_in >= ?';
            values.push(time);
        }
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
module.exports.create_all = create_all;
module.exports.read = read;
