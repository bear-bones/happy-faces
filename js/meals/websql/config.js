function init() {
    var create = 'CREATE TABLE IF NOT EXISTS config (config_key INTEGER PRIMARY KEY, last_load INT, default_class TEXT, cash_in_lue DECIMAL, report_dir TEXT, cat1_desc TEXT, cat1_min_age INTEGER, cat1_max_age INTEGER, cat1_teacher TEXT, cat2_desc TEXT, cat2_min_age INTEGER, cat2_max_age INTEGER, cat2_teacher TEXT, cat3_desc TEXT, cat3_min_age INTEGER, cat3_max_age INTEGER, cat3_teacher TEXT, cat4_desc TEXT, cat4_min_age INTEGER, cat4_max_age INTEGER, cat4_teacher TEXT, cat5_desc TEXT, cat5_min_age INTEGER, cat5_max_age INTEGER, cat5_teacher TEXT, cat6_desc TEXT, cat6_min_age INTEGER, cat6_max_age INTEGER, cat6_teacher TEXT, cat7_desc TEXT, cat7_min_age INTEGER, cat7_max_age INTEGER, cat7_teacher TEXT, cat8_desc TEXT, cat8_min_age INTEGER, cat8_max_age INTEGER, cat8_teacher TEXT, br_start INTEGER, br_end INTEGER, br_a_rate DECIMAL, br_b_rate DECIMAL, br_c_rate DECIMAL, ms_start INTEGER, ms_end INTEGER, ms_a_rate DECIMAL, ms_b_rate DECIMAL, ms_c_rate DECIMAL, lu_start INTEGER, lu_end INTEGER, lu_a_rate DECIMAL, lu_b_rate DECIMAL, lu_c_rate DECIMAL, as_start INTEGER, as_end INTEGER, as_a_rate DECIMAL, as_b_rate DECIMAL, as_c_rate DECIMAL, di_start INTEGER, di_end INTEGER, di_a_rate DECIMAL, di_b_rate DECIMAL, di_c_rate DECIMAL, es_start INTEGER, es_end INTEGER, es_a_rate DECIMAL, es_b_rate DECIMAL, es_c_rate DECIMAL)',
        insert = "INSERT OR IGNORE INTO config VALUES (1, 0, 'A', 0, '', 'Beginners', 0, 8, 'TERESA SANCHEZ', 'Movers', 9, 17, 'MARTHA MENDEZ', 'Climbers', 18, 24, 'NOHEMI HERNANDEZ', 'Curiosity', 25, 35, 'DIANA GONZALEZ', 'Discovery', 36, 47, 'GLORIA CALDERON', 'Creativity', 48, 59, 'ROSA OLVERA', 'Kinder', 60, 83, 'JOHANA LUGO', 'Enrichment', 84, 216, 'MARIA GARCIA', 450, 540, 1.58, 1.28, 0.28, 660, 660, 0, 0, 0, 660, 780, 2.93, 2.53, 0.28, 870, 990, 0.8, 0.4, 0.07, 1020, 1110, 2.93, 2.53, 0.28, 1170, 1230, 0.80, 0.40, 0.07)";
    return new Promise(function (resolve, reject) {
        common.websql.db.transaction(function (t) {
            t.executeSql(create, [], function (t) {
                t.executeSql(insert, [], function () {
                    resolve();
                }, function (t, error) {reject(error)});
            }, function (t, error) {reject(error)});
        });
    });
}



function read() {
    return new Promise(function (resolve, reject) {
        common.websql.db.transaction(function (t) {
            t.executeSql('SELECT * FROM config', [], function (t, results) {
                resolve(results.rows.item(0));
            }, function (t, error) {reject(error)});
        });
    });
}



function update(fields) {
    var keys = Object.keys(fields).filter(function (key) {
            return key === 'config_key' || key === 'last_load' || key === 'default_class' || key === 'cash_in_lue' || key === 'report_dir' || key === 'cat1_desc' || key === 'cat1_min_age' || key === 'cat1_max_age' || key === 'cat1_teacher' || key === 'cat2_desc' || key === 'cat2_min_age' || key === 'cat2_max_age' || key === 'cat2_teacher' || key === 'cat3_desc' || key === 'cat3_min_age' || key === 'cat3_max_age' || key === 'cat3_teacher' || key === 'cat4_desc' || key === 'cat4_min_age' || key === 'cat4_max_age' || key === 'cat4_teacher' || key === 'cat5_desc' || key === 'cat5_min_age' || key === 'cat5_max_age' || key === 'cat5_teacher' || key === 'cat6_desc' || key === 'cat6_min_age' || key === 'cat6_max_age' || key === 'cat6_teacher' || key === 'cat7_desc' || key === 'cat7_min_age' || key === 'cat7_max_age' || key === 'cat7_teacher' || key === 'cat8_desc' || key === 'cat8_min_age' || key === 'cat8_max_age' || key === 'cat8_teacher' || key === 'br_start' || key === 'br_end' || key === 'br_a_rate' || key === 'br_b_rate' || key === 'br_c_rate' || key === 'ms_start' || key === 'ms_end' || key === 'ms_a_rate' || key === 'ms_b_rate' || key === 'ms_c_rate' || key === 'lu_start' || key === 'lu_end' || key === 'lu_a_rate' || key === 'lu_b_rate' || key === 'lu_c_rate' || key === 'as_start' || key === 'as_end' || key === 'as_a_rate' || key === 'as_b_rate' || key === 'as_c_rate' || key === 'di_start' || key === 'di_end' || key === 'di_a_rate' || key === 'di_b_rate' || key === 'di_c_rate' || key === 'es_start' || key === 'es_end' || key === 'es_a_rate' || key === 'es_b_rate' || key === 'es_c_rate';
        }),
        values = keys.map(function (key) {
            return fields[key] === undefined ? null : fields[key];
        }),
        statement = keys.join(' = ?,') + (keys.length ? ' = ?' : '');

    if (!keys.length)
        return new common.websql.WebSqlError('No valid fields given');

    return new Promise(function (resolve, reject) {
        common.websql.db.transaction(function (t) {
            t.executeSql(
                'UPDATE config SET ' + statement, values,
                function () {resolve()}, function (t, error) {reject(error)}
            );
        });
    });
}



module.exports.init = init;
module.exports.read = read;
module.exports.update = update;
