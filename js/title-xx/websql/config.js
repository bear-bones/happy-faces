function init() {
   var create = 'CREATE TABLE IF NOT EXISTS config (config_key INTEGER PRIMARY KEY, fee_amount DECIMAL, include_private BOOLEAN, include_txx BOOLEAN, prepared_by TEXT, rate1_min_age INTEGER, rate1_max_age INTEGER, rate1_hourly_rate DECIMAL, rate1_daily_rate DECIMAL, rate2_min_age INTEGER, rate2_max_age INTEGER, rate2_hourly_rate DECIMAL, rate2_daily_rate DECIMAL, rate3_min_age INTEGER, rate3_max_age INTEGER, rate3_hourly_rate DECIMAL, rate3_daily_rate DECIMAL, rate4_min_age INTEGER, rate4_max_age INTEGER, rate4_hourly_rate DECIMAL, rate4_daily_rate DECIMAL, day_start_time INTEGER, day_end_time INTEGER, title_xx_year_start INTEGER, last_load INTEGER)',
       insert = "INSERT OR IGNORE INTO config VALUES (1, 25.00, 0, 1, 'Samuel Mejia', 0, 18, 5.0, 37.5, 19, 54, 4.5, 34, 55, 84, 4.5, 31, 85, 240, 4.5, 31, 270, 1410, 0, 0)";
   return new Promise(function (resolve, reject) {
      common.websql.db.transaction(function (t) {
         t.executeSql(create, [], function (t) {
            t.executeSql(
               insert, [], function () {resolve();},
               function (t, error) {reject(error)});
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
          return key === 'fee_amount' || key === 'include_private'
             || key === 'include_txx' || key === 'prepared_by'
             || key === 'rate1_min_age' || key === 'rate1_max_age'
             || key === 'rate1_hourly_rate' || key === 'rate1_daily_rate'
             || key === 'rate2_min_age' || key === 'rate2_max_age'
             || key === 'rate2_hourly_rate' || key === 'rate2_daily_rate'
             || key === 'rate3_min_age' || key === 'rate3_max_age'
             || key === 'rate3_hourly_rate' || key === 'rate3_daily_rate'
             || key === 'rate4_min_age' || key === 'rate4_max_age'
             || key === 'rate4_hourly_rate' || key === 'rate4_daily_rate'
             || key === 'day_start_time' || key === 'day_end_time'
             || key === 'last_load';
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
            function () {resolve()}, function (t, error) {reject(error)});
      });
   });
}



module.exports.init = init;
module.exports.read = read;
module.exports.update = update;
