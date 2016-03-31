var XLSX = require('xlsx'),

    cell = common.excel.functions.cell,
    cc = common.excel.functions.cc,
    sc = common.excel.functions.sc,
    getHHMM = common.excel.functions.getHHMM,
    round = common.excel.functions.round,
    dollars = common.excel.functions.dollars,

    worksheet = common.excel.worksheet;



function generate(done) {
   var file_name = meals.excel.file_name,
       children = meals.model.data,
       date = meals.model.report_date;

   log.debug('Running /meals/excel/misc/birthday.js');
   log.debug(' -- date: ' + date);

   var ws = new common.excel.worksheet(3);
   ws['!cols'] = [{wch:40}, {wch:20}, {wch:10}];
   ws['!merges'] = [{s: {c: 0, r: ws.rows}, e: {c: 2, r: ws.rows}}];

   cell(ws, 0, ws.rows,
      'Birthday Report for ' + (date.getMonth() + 1) + '/' + date.getFullYear(),
      common.excel.XF_B10_C
   );
   ws.rows += 2;

   cell(ws, 0, ws.rows, 'Child Name', common.excel.XF_B10_TB_L);
   cell(ws, 1, ws.rows, 'Birthdate', common.excel.XF_B10_TB_L);
   cell(ws, 2, ws.rows, 'Age', common.excel.XF_B10_TB_L);
   ++ws.rows;

   children
      .filter(function (child) {
         return new Date(child.dob).getMonth() === date.getMonth()
      })
      .sort(function (a, b) {return a.dob - b.dob})
      .forEach(function (child) {
         cell(ws, 0, ws.rows, child.name);
         cell(ws, 1, ws.rows, child.display.dob);
         cell(ws, 2, ws.rows,
              date.getFullYear() - new Date(child.dob).getFullYear());
         ++ws.rows;
      });

   cell(ws, 0, ws.rows, '', common.excel.XF_T_L);
   cell(ws, 1, ws.rows, '', common.excel.XF_T_L);
   cell(ws, 2, ws.rows, '', common.excel.XF_T_L);
   ++ws.rows;

   try {
      XLSX.writeFile({
         SheetNames: ['Birthday List'],
         Sheets: {'Birthday List': ws.export()}
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
