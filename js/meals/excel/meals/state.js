var XLSX = require('xlsx'),

    cell = common.excel.functions.cell,
    cc = common.excel.functions.cc,
    sc = common.excel.functions.sc,
    round = common.excel.functions.round,

    worksheet = common.excel.worksheet,
    
    titles = ['Breakfast','Lunch','PM Snack','Supper','EV Snack'];


function index(meal) {return index.meals.indexOf(meal) * 3}
index.meals = ['breakfast','lunch','afternoon','dinner','evening'];

function generate(done) {
   var file_name = meals.excel.file_name,
       date = meals.model.report_date.clone(),
       children = meals.model.data, data = Array(19).fill(0), totals,
       ws = new worksheet(20);
   date.setMonth(date.getMonth() + 1, 0); // last day of month

   log.debug('Running meals/excel/meals/saturdays.js');
   log.debug(' -- meals.model.report_date: ', meals.model.report_date);
   log.debug(' -- date: ', date);

   // data is a 2d array [meal][day]
   data = data.map(function () {return Array(date.getDate()).fill(0)});

   // sum the child meal data into the data matrix
   children.forEach(function (child) {
      var offset =
          'ABC'.indexOf(child.classification || meals.config.default_class);
      for (var day in child.meals) {
         if (Math.trunc(day/100) !== date.getMonth()) continue;
         var _meals = child.meals[day];
         day = day%100 - 1;
         if (_meals.length) ++data[data.length - 1][day];
         _meals.forEach(function (meal) {++data[index(meal) + offset][day]});
      }
   });
   totals = data.map(function (column) {
      return column.reduce(function (a, b) {return a + b});
   });


   ws['!page'] = {
      margins: {left: 0.3, right: 0.3, top: 0.4, bottom: 0.4}, landscape: true
   };
   ws['!cols'] = [{wch:5}, {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:4.5},
      {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:4.5},
      {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:4.5},
      {wch:4.5}, {wch:4.5}, {wch:11.5}];
   ws['!merges'] = [
      {s: {c: 0, r: ws.rows}, e: {c: 7, r: ws.rows}},
      {s: {c: 8, r: ws.rows}, e: {c: 13, r: ws.rows}},
      {s: {c: 14, r: ws.rows}, e: {c: 19, r: ws.rows}},
      {s: {c: 1, r: ws.rows+2}, e: {c: 18, r: ws.rows+2}},
      {s: {c: 1, r: ws.rows+3}, e: {c: 3, r: ws.rows+3}},
      {s: {c: 4, r: ws.rows+3}, e: {c: 6, r: ws.rows+3}},
      {s: {c: 7, r: ws.rows+3}, e: {c: 9, r: ws.rows+3}},
      {s: {c: 10, r: ws.rows+3}, e: {c: 12, r: ws.rows+3}},
      {s: {c: 13, r: ws.rows+3}, e: {c: 15, r: ws.rows+3}},
      {s: {c: 16, r: ws.rows+3}, e: {c: 18, r: ws.rows+3}}];

   for (var i = 1; i < 19; ++i) cell(ws, i, ws.rows, '', common.excel.XF_TB_L);
   cell(ws, 0, ws.rows, 'CENTER: HAPPY FACES', common.excel.XF_LTB_L);
   cell(ws, 7, ws.rows, '', common.excel.XF_RTB_L);
   cell(ws, 8, ws.rows, 'AGREEMENT NUMBER: 28-1203', common.excel.XF_LTB_L);
   cell(ws, 13, ws.rows, '', common.excel.XF_RTB_L);
   cell(ws, 14, ws.rows,
        'MONTH, YEAR: ' + (date.getMonth()+1) + '/' + date.getFullYear(),
        common.excel.XF_LTB_L);
   cell(ws, 19, ws.rows++, '', common.excel.XF_RTB_L);

   ++ws.rows;
   
   for (var i = 2; i < 18; ++i) cell(ws, i, ws.rows, '', common.excel.XF_TB_L);
   cell(ws, 1, ws.rows, 'NUMBER OF MEALS SERVED', common.excel.XF_LTB_C);
   cell(ws, 18, ws.rows++, '', common.excel.XF_RTB_L);

   for (var i = 0; i < 6; ++i) {
      cell(ws, 3*i + 1, ws.rows, titles[i], common.excel.XF_LTB_C);
      cell(ws, 3*i + 2, ws.rows, '', common.excel.XF_TB_L);
      cell(ws, 3*i + 3, ws.rows, '', common.excel.XF_RTB_L);
   }
   cell(ws, 19, ws.rows++, 'Daily', common.excel.XF_LRT_C);

   cell(ws, 0, ws.rows, 'Date', common.excel.XF_LRTB_C);
   for (var i = 1; i < 19; ++i)
      cell(ws, i, ws.rows, "PFR"[i%3], common.excel.XF_LRTB_C);
   cell(ws, 19, ws.rows++, 'Attendance', common.excel.XF_LRB_C);

   for (var i = 0; i < date.getDate(); ++i, ++ws.rows) {
      cell(ws, 0, ws.rows, i + 1, common.excel.XF_lrb_C);
      for (var j = 1; j < 20; ++j)
         cell(ws, j, ws.rows, data[j-1][i], common.excel.XF_lrb_C);
   }

   cell(ws, 0, ws.rows, 'Total', common.excel.XF_lrb_C);
   for (var i = 1; i < 20; ++i)
      cell(ws, i, ws.rows, totals[i-1], common.excel.XF_lrb_C);
   ++ws.rows;

   cell(ws, 0, ws.rows, 'ADA');
   cell(ws, 1, ws.rows++, round(totals[totals.length - 1] / date.getDate()),
        common.excel.XF_R);


   try {
      XLSX.writeFile({
         SheetNames: ['Sheet1'], Sheets: {Sheet1: ws.export()}
      }, file_name);
   } catch (error) {
      log.error(error);
      log.debug(error.stack);
      throw new Error('Error generating spreadsheet');
   }
   log.debug('Spreadsheet generated.');
   done();
}



module.exports.generate = generate;
