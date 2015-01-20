var XLSX = require('xlsx'),

    cell = common.excel.functions.cell,
    cc = common.excel.functions.cc,
    sc = common.excel.functions.sc,
    getHHMM = common.excel.functions.getHHMM,
    round = common.excel.functions.round,
    dollars = common.excel.functions.dollars,

    worksheet = common.excel.worksheet;



function generate() {
    var file_name = meals.excel.file_name,
        children = meals.model.data,
        config = meals.model.config,
        date = meals.model.report_date;

    var ws = new common.excel.worksheet(2),
        punches = [];
    ws['!cols'] = [{wch:40}, {wch:20}];
    ws['!merges'] = [{s : {c : 0, r : ws.rows}, e : {c : 1, r : ws.rows}}];

    children.forEach(function (child) {
        child.punches.forEach(function (punch) {
            var time_in = punch.time_in && new Date(punch.time_in);
            if (!punch.time_out && time_in &&
                time_in.getMonth() === date.getMonth() &&
                time_in.getFullYear() === date.getFullYear()
            ) punches.push({
                name : child.name, date : time_in.toLocaleDateString()});
        });
    });

    cell(ws, 0, ws.rows,
        'No Clock Out Report for ' +
        (date.getMonth() + 1) + '/' + date.getFullYear(),
        common.excel.XF_B10_C);
    ws.rows += 2;

    cell(ws, 0, ws.rows, 'Name', common.excel.XF_B10_TB_L);
    cell(ws, 1, ws.rows, 'Date', common.excel.XF_B10_TB_L);
    ++ws.rows;

    punches.forEach(function (punch) {
        cell(ws, 0, ws.rows, punch.name);
        cell(ws, 1, ws.rows, punch.date);
        ++ws.rows;
    });

    cell(ws, 0, ws.rows, '', common.excel.XF_T_L);
    cell(ws, 1, ws.rows, '', common.excel.XF_T_L);
    ++ws.rows;

    try {
        XLSX.writeFile({
            SheetNames : ['No Clock Out'],
            Sheets : {'No Clock Out' : ws.export()}
        }, file_name);
    } catch (error) {
        log.error(error);
        log.debug(error.stack);
        throw new Error('Error generating spreadsheet');
    }
    log.debug('Spreadsheet generated.');
}



module.exports.generate = generate;
