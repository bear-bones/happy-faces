var XLSX = require('xlsx'),

    ABC = 'ABC',

    cell = common.excel.functions.cell,
    cc = common.excel.functions.cc,
    sc = common.excel.functions.sc,
    getHHMM = common.excel.functions.getHHMM,
    round = common.excel.functions.round,
    dollars = common.excel.functions.dollars,

    worksheet = common.excel.worksheet;



function pretty_meal(meal) {
   if (meal === 'breakfast') return 'Breakfast';
   if (meal === 'lunch')     return 'Lunch';
   if (meal === 'afternoon') return 'Afternoon Snack';
   if (meal === 'supper')    return 'Dinner';
   if (meal === 'evening')   return 'Evening Snack';
}



function generate(done, type, meal) {
   var options = {}, source, date;
   
   options.SheetNames = [pretty_meal(meal)];
   options.Sheets = {};

   function execute(source) {
      try {
         log.debug('Running meals/excel/meals/meal.js');
         log.debug(' -- type: ', type);
         log.debug(' -- meal: ', meal);
         log.debug(' -- meals.model.report_date: ', meals.model.report_date);
         log.debug(' -- source.report_date: ', source.report_date);
         options.Sheets[pretty_meal(meal)] =
            make_sheet(type, meal, source.data);
         XLSX.writeFile(options, meals.excel.file_name);
         log.debug('Spreadsheet generated.');
         done();
      } catch (e) {
         done(e);
      }
   }

   try {
      if (type === 'blank') {
         date = meals.model.report_date.clone();
         date.setMonth(date.getMonth() - 1);
         source = {data: meals.model.data, report_date: date, no_punch_out: []};
         co(function* () {
            yield* meals.model.load.process_data(false, source);
            execute(source);
         });
      } else {
         execute(meals.model);
      }
   } catch (error) {
      log.error(error);
      log.debug(error.stack);
      throw new Error('Error generating spreadsheet');
   }
}



function make_sheet(type, meal, data) {
   var month = meals.model.report_date.getMonth(),
       monday = meals.model.report_date.clone(), friday, weekday,
       dates = [];

   // get the monday and friday of the workweek containing the first
   monday.setDate(1);
   weekday = monday.getDay();
   monday.setDate(2 + (!(weekday%6) ? !!weekday : -weekday));
   friday = monday.clone();
   friday.inc(4);

   // build a list of dates of each day in each workweek in the month
   while (monday.getMonth() === month || friday.getMonth() === month) {
      for (var i = 0; i < 5; ++i) dates.push(monday.clone().inc(i));
      monday.inc(7), friday.inc(7);
   }

   // initialize worksheet
   var ws = new common.excel.worksheet(78);
   ws['!page'] = {
      margins: {left: 0.4, right: 0.4, top: 0.4, bottom: 0.4}, landscape: true
   };
   ws['!cols'] = [
      {wch:2}, {wch:20}, {wch:3},
      {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
      {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
      {wch:1.75}, {wch:1.75}, {wch:1.75},
      {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
      {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
      {wch:1.75}, {wch:1.75}, {wch:1.75},
      {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
      {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
      {wch:1.75}, {wch:1.75}, {wch:1.75},
      {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
      {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
      {wch:1.75}, {wch:1.75}, {wch:1.75},
      {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
      {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
      {wch:1.75}, {wch:1.75}, {wch:1.75}];
   ws['!merges'] = [];

   write_section(type, meal, month, dates, data, ws);

   return ws.export();
}



var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
              'August', 'September', 'October', 'November', 'December'];
function write_section(type, meal, month, dates, children, ws) {
   var data = {}, day_totals = Array(75).fill(0);

   // filter the raw child meal data into a map of child->[a/b/c by day] and
   // his totals
   children
      .filter(function (child) {
         return dates.some(function (date) {
            var _meals = child.meals,
                key = date.getMonth()*100 + date.getDate();
            return key in _meals && _meals[key].indexOf(meal) >= 0;
         });
      })
      .forEach(function (child, index) {
         var name = child.name,
             cx = child.classification || meals.config.default_class;
             offset = ABC.indexOf(cx);
         data[name] = Array(75).fill(0);
         data[name].cx = cx;
         dates.forEach(function (date, i) {
            var key = date.getMonth()*100 + date.getDate();
            if (key in child.meals && child.meals[key].indexOf(meal) >= 0) {
               ++data[name][i*3 + offset];
               ++day_totals[i*3 + offset];
            }
         });
      });

   // header for this chunk o' data
   ws['!merges'].push({s: {c: 0, r: ws.rows},
                       e: {c: dates.length*3 + 2, r: ws.rows}});
   ws['!merges'].push({s: {c: 0, r: ws.rows+1},
                       e: {c: dates.length*3 + 2, r: ws.rows+1}});
   cell(ws, 0, ws.rows++, 'Record of Meals and Supplements Served',
        common.excel.XF_8_C);
   cell(ws, 0, ws.rows++,
        pretty_meal(meal) +
        (type === 'complete' || type === 'blank' ? '' : ' for ' + type) +
        ' for ' + months[month] + ' ' + dates[7].getFullYear(),
        common.excel.XF_8_C);

   // for each day
   var xf = common.excel;
   for (var i = 0, length = dates.length; i < length; ++i) {
      gray = i % 5 ? '' : 'GRAY_';
      // for each day's meals' classifications
      for (var j = 0; j < 3; ++j) {
         // for each day's meals' classifications' children
         Object.keys(data).sort().forEach(function (name, k) {
            var child = data[name];
            // if child is at top of page, write headers
            if (k === 0 || k === 68 || k === 138 || k === 208 ||
                k === 278 || k === 378 || k === 418 || k === 488) {
               if (j === 0) {
                  ws['!merges'].push(
                     {s: {c: 3 + i*3, r: r(ws, k-1) + 1},
                      e: {c: 3 + i*3 + 2, r: r(ws, k-1)+1}}
                  );
                  cell(ws, 3 + i*3, r(ws, k-1) + 1, 
                       (dates[i].getMonth()+1) + '/' + dates[i].getDate(),
                       xf['XF_8_' + gray + 'LT_C']);
                  cell(ws, 3 + i*3 + 1, r(ws, k-1) + 1, '',
                       xf['XF_8_' + gray + 'T_C']);
                  cell(ws, 3 + i*3 + 2, r(ws, k-1) + 1, '',
                       xf['XF_8_' + gray + 'RT_C']);
               }
               cell(ws, 3 + i*3 + j, r(ws, k-1) + 2, ABC[j],
                    xf['XF_8_' + gray + ['L', '', 'R'][j] + 'tB_C']);
            }
            // first time through write the row labels
            if (i === 0 && j === 0) {
               cell(ws, 0, r(ws, k), k + 1, xf.XF_8_R);
               cell(ws, 1, r(ws, k), name, xf.XF_8_L);
               cell(ws, 2, r(ws, k), child.cx, xf.XF_8_C);
            }
            cell(ws, 3 + i*3 + j, r(ws, k),
                 type !== 'blank' && child[i*3 + j] || '',
                 xf['XF_8_' + gray + ['L', '', 'R'][j] + 'b_C']);
         });
         // totals
         cell(ws, 3 + i*3 + j, r(ws, Object.keys(data).length),
              type === 'blank' ? '' : day_totals[i*3 + j],
              xf['XF_B8_' + gray + 'LRTB_R']);
      }
   }
   
   ws.rows = r(ws, Object.keys(data).length);
   cell(ws, 1, ws.rows, 'Total', common.excel.XF_B8_R);

   // pad out to end of page in case we have another section
   for (i = 0, length = 72 - (ws.rows%72); i < length; ++i, ++ws.rows)
      for (j = 0; j < 78; ++j)
         cell(ws, j, ws.rows + 1, '', xf.XF_8_C);
}



function r(ws, row) {
   if (row < 0)   return row + ws.rows;
   if (row < 68)  return row + ws.rows + 2;
   if (row < 138) return row + ws.rows + 4;
   if (row < 208) return row + ws.rows + 6;
   if (row < 278) return row + ws.rows + 8;
   if (row < 378) return row + ws.rows + 10;
   if (row < 418) return row + ws.rows + 12;
   if (row < 488) return row + ws.rows + 14;
}



module.exports.generate = generate;
