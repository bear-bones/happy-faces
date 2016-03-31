var XLSX = require('xlsx'),

    ABC = 'ABC',
    ML = ['BR', 'LU', 'AS', 'DI', 'ES'],
    MLS = ['breakfast', 'lunch', 'afternoon', 'dinner', 'evening'],

    cell = common.excel.functions.cell,
    cc = common.excel.functions.cc,
    sc = common.excel.functions.sc,
    getHHMM = common.excel.functions.getHHMM,
    round = common.excel.functions.round,
    dollars = common.excel.functions.dollars,

    worksheet = common.excel.worksheet;


function index(meal) {return index.meals.indexOf(meal) * 4}
index.meals = ['breakfast', 'lunch', 'afternoon', 'dinner', 'evening'];



function generate(done, type) {
   var options = {}, source, date;

   options.SheetNames = ['Saturday'];
   options.Sheets = {};

   function execute(source) {
      try {
         log.debug('Running meals/excel/meals/saturday.js');
         log.debug(' -- type: ', type);
         log.debug(' -- meals.model.report_date: ', meals.model.report_date);
         log.debug(' -- source.report_date: ', source.report_date);
         options.Sheets.Saturday =
            make_sheet(type, source.report_date, source.data);
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
         date.setDate(28); // make sure it's ok when we subtract a month
         date.setMonth(date.getMonth() - 1);
         source =
            {data: meals.model.data, report_date: date, no_punch_out: []};
         co(function* () {
            yield*  meals.model.load.process_data(false, source);
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



function make_sheet(type, report_date, children) {
   var date = report_date.clone(),
       month = date.getMonth(),
       dates = [];

   // build a list of all saturdays in the month
   date.setDate(1);
   date.inc(6 - date.getDay());
   do {
      dates.push(date.clone());
      date.inc(7);
   } while (date.getMonth() === month);

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

   switch (type) {
   case 'complete': case 'blank':
      write_section(type, month, dates, children, ws);
      break;
   default:
      for (var i = 0; i < 8; ++i) write_section(
         meals.config['cat' + (i+1) + '_desc'], month, dates,
         children.filter(function (child) {return child.classroom === i}), ws
      );
   }

   return ws.export();
}



function write_section(type, month, dates, children, ws) {
   var data = {},
       day_totals = dates.map(function (date) {
          return Array(15).fill(date.getMonth() === month ? 0 : '');
       });

   // filter the raw child meal data into a map of child->[a/b/c by day] and
   // his totals
   children
      .filter(function (child) {
         return dates.some(function (date) {
            var _meals = child.meals[date.getMonth()*100 + date.getDate()];
            return _meals && _meals.length;
         });
      })
      .forEach(function (child, index) {
         var name = child.name,
             cx = child.classification || meals.config.default_class;
             offset = ABC.indexOf(cx);
         data[name] = dates.map(function (date) {
            return Array(15).fill(date.getMonth() === month ? 0 : '');
         });
         data[name].cx = cx;
         dates
            .map(function (date) {
               return child.meals[date.getMonth()*100 + date.getDate()];
            })
            .forEach(function (_meals, week) {
               _meals.forEach(function (meal) {
                  var column = MLS.indexOf(meal)*3 + offset;
                  ++data[name][week][column];
                  ++day_totals[week][column];
               });
            });
      });

   // header for this chunk o' data
   ws['!merges'].push({
      s: {c: 0, r: ws.rows}, e: {c: dates.length*15 + 2, r: ws.rows}
   });
   ws['!merges'].push({
      s: {c: 0, r: ws.rows+1}, e: {c: dates.length*15 + 2, r: ws.rows+1}
   });
   cell(ws, 0, ws.rows++, 'Record of Meals and Supplements Served',
        common.excel.XF_8_C);
   cell(ws, 0, ws.rows++,
        'Saturday meals' +
        (type === 'complete' || type === 'blank' ? '' : ' for ' + type) + ' ' +
        dates[0].toLocaleDateString() + '-' +
        dates[dates.length-1].toLocaleDateString(), common.excel.XF_8_C);

   // for each day
   var xf = common.excel;
   for (var i = 0, length = dates.length; i < length; ++i) {
      // for each day's meals
      for (var j = 0, gray = 'GRAY_'; j < 5; ++j) {
         // for each day's meals' classifications
         for (var k = 0; k < 3; ++k) {
            // for each day's meals' classifications' children
            Object.keys(data).sort().forEach(function (name, l) {
               var child = data[name];
               // if child is at top of page, write headers
               if (l === 0 || l === 67 || l === 136 || l === 205 ||
                   l === 274 || l === 373 || l === 412 || l === 481) {
                  if (j === 0 && k === 0) {
                     ws['!merges'].push({
                        s: {c : 3 + i*15, r : r(ws, l-1) + 1},
                        e: {c : 3 + i*15 + 14, r : r(ws, l-1) + 1}
                     });
                     cell(ws, 3 + i*15, r(ws, l-1) + 1,
                          dates[i].toLocaleDateString(), xf.XF_8_LRTB_C);
                  } else cell(ws, 3 + i*15 + j*3 + k, r(ws, l-1) + 1, '',
                              xf.XF_8_LRTB_C);
                  if (k === 0) {
                     ws['!merges'].push({
                        s: {c: 3 + i*15 + j*3, r: r(ws, l-1) + 2},
                        e: {c: 3 + i*15 + j*3 + 2, r: r(ws, l-1)+2}
                     });
                     cell(ws, 3 + i*15 + j*3, r(ws, l-1) + 2, ML[j],
                          xf['XF_8_' + gray + 'LT_C']);
                     cell(ws, 3 + i*15 + j*3 + 1, r(ws, l-1) + 2, '',
                          xf['XF_8_' + gray + 'T_C']);
                     cell(ws, 3 + i*15 + j*3 + 2, r(ws, l-1) + 2, '',
                          xf['XF_8_' + gray + 'RT_C']);
                  }
                  cell(ws, 3 + i*15 + j*3 + k, r(ws, l-1) + 3, ABC[k],
                       xf['XF_8_' + gray + ['L', '', 'R'][k] + 'tB_C']);
               }
               // first time through write the row labels
               if (i === 0 && j === 0 && k === 0) {
                  cell(ws, 0, r(ws, l), l + 1, xf.XF_8_R);
                  cell(ws, 1, r(ws, l), name, xf.XF_8_L);
                  cell(ws, 2, r(ws, l), child.cx, xf.XF_8_C);
               }
               cell(ws, 3 + i*15 + j*3 + k, r(ws, l),
                    type !== 'blank' && child[i][j*3 + k] || '',
                    xf['XF_8_' + gray + ['L', '', 'R'][k] + 'b_C']);
           });
           // totals
           cell(ws, 3 + i*15 + j*3 + k, r(ws, Object.keys(data).length),
                type === 'blank' ? '' : day_totals[i][j*3 + k],
                xf['XF_B8_' + gray + 'LRTB_R']);
         }
         gray = '';
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
   if (row < 67)  return row + ws.rows + 3;
   if (row < 136) return row + ws.rows + 6;
   if (row < 205) return row + ws.rows + 9;
   if (row < 274) return row + ws.rows + 12;
   if (row < 373) return row + ws.rows + 15;
   if (row < 412) return row + ws.rows + 18;
   if (row < 481) return row + ws.rows + 21;
}



module.exports.generate = generate;
