var XLSX = require('xlsx'),

    cell = common.excel.functions.cell,
    cc = common.excel.functions.cc,
    sc = common.excel.functions.sc,
    getHHMM = common.excel.functions.getHHMM,
    round = common.excel.functions.round,
    dollars = common.excel.functions.dollars,

    worksheet = common.excel.worksheet;


function generate(blank) {
    var file_name = meals.excel.file_name,
        date = meals.model.report_date,

        names = [], sheets = {},
        monday = date.clone(), friday,
        month = date.getMonth(), weekday, i = 1;

    // adjust things so that our range is the workweek containing the 1st
    monday.setDate(1);
    weekday = monday.getDay();
    monday.setDate(2 + (!(weekday % 6) ? !!weekday : -weekday));
    friday = monday.clone();
    friday.inc(4);

    // build sheets for each classroom
    for (var i = 1, name, ws; i <= 8; ++i) {
        names.push(meals.config[name = 'cat' + i + '_desc']);
        sheets[meals.config[name]] = make_sheet(month, monday, friday);
    }

    try {
        XLSX.writeFile({SheetNames : names, Sheets : sheets}, file_name);
    } catch (error) {
        log.error(error);
        log.debug(error.stack);
        throw new Error('Error generating spreadsheet');
    }
    log.debug('Spreadsheet generated.');
}



function make_template() {
    var ws = new common.excel.worksheet(16);

    ws['!page'] = {
        margins : {left : 0.3, right : 0.3, top : 0.4, bottom : 0.4},
        landscape : true
    };
    ws['!cols'] = [{wch:25}, {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:4.5},
        {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:4.5},
        {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:12}, {wch:29}];
    ws['!merges'] = [
        {s : {c : 0, r : ws.rows}, e : {c : 15, r : ws.rows}},
        {s : {c : 0, r : ws.rows + 53}, e : {c : 15, r : ws.rows + 53}}
    ];
    cell(ws, 0, ws.rows++, 'Happy Faces Child Development Center',
         common.excel.XF_B10_C);
    ++ws.rows;
    cell(ws, 0, ws.rows, 'Name', common.excel.XF_B10_lrtb_L);
    cell(ws, 1, ws.rows, '6:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 2, ws.rows, '7:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 3, ws.rows, '8:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 4, ws.rows, '9:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 5, ws.rows, '10:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 6, ws.rows, '11:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 7, ws.rows, '12:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 8, ws.rows, '1:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 9, ws.rows, '2:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 10, ws.rows, '3:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 11, ws.rows, '4:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 12, ws.rows, '5:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 13, ws.rows, '6:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 14, ws.rows, 'Pick-up Time', common.excel.XF_B10_lrtb_L);
    cell(ws, 15, ws.rows, 'Parent Signature',
         common.excel.XF_B10_lrtb_L);
    ++ws.rows;
    for (var j = 0; j < 38; ++j, ++ws.rows)
        for (var k = 0; k < 16; ++k )
            cell(ws, k, ws.rows, '', common.excel.XF_lrtb_C);
    cell(ws, 0, ws.rows, 'Staff Initials', common.excel.XF_L);
    for (var j = 1; j < 14; ++j )
        cell(ws, j, ws.rows, '', common.excel.XF_lrtb_C);
    ++ws.rows;
    ++ws.rows;
    cell(ws, 0, ws.rows, 'X - Not Scheduled    A - Absent    NS - No Show    CL - Classroom    F - Field Trip    PG - Playground    TR - Transportation    V - Vacation    S - School',
         common.excel.XF_L);
    ++ws.rows;

    return ws.export();
}



function make_sheet(month, monday, friday) {
    var ws = new common.excel.worksheet(16);
    monday = monday.clone();
    friday = friday.clone();

    ws['!page'] = {
        margins : {left : 0.3, right : 0.3, top : 0.4, bottom : 0.4},
        landscape : true
    };
    ws['!cols'] = [{wch:25}, {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:4.5},
        {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:4.5},
        {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:12}, {wch:29}];
    ws['!merges'] = [];
    // build a page for each workweek that has at one+ days in the month
    while (monday.getMonth() === month || friday.getMonth() === month) {
        ws['!merges'].push(
            {s : {c : 0, r : ws.rows}, e : {c : 15, r : ws.rows}},
            {s : {c : 0, r : ws.rows + 53}, e : {c : 15, r : ws.rows + 53}}
        );
        cell(ws, 0, ws.rows++, 'Happy Faces Child Development Center',
             common.excel.XF_B10_C);
        ++ws.rows;
        cell(ws, 0, ws.rows, 'Name', common.excel.XF_B10_lrtb_L);
        cell(ws, 1, ws.rows, '6:00', common.excel.XF_B10_lrtb_R);
        cell(ws, 2, ws.rows, '7:00', common.excel.XF_B10_lrtb_R);
        cell(ws, 3, ws.rows, '8:00', common.excel.XF_B10_lrtb_R);
        cell(ws, 4, ws.rows, '9:00', common.excel.XF_B10_lrtb_R);
        cell(ws, 5, ws.rows, '10:00', common.excel.XF_B10_lrtb_R);
        cell(ws, 6, ws.rows, '11:00', common.excel.XF_B10_lrtb_R);
        cell(ws, 7, ws.rows, '12:00', common.excel.XF_B10_lrtb_R);
        cell(ws, 8, ws.rows, '1:00', common.excel.XF_B10_lrtb_R);
        cell(ws, 9, ws.rows, '2:00', common.excel.XF_B10_lrtb_R);
        cell(ws, 10, ws.rows, '3:00', common.excel.XF_B10_lrtb_R);
        cell(ws, 11, ws.rows, '4:00', common.excel.XF_B10_lrtb_R);
        cell(ws, 12, ws.rows, '5:00', common.excel.XF_B10_lrtb_R);
        cell(ws, 13, ws.rows, '6:00', common.excel.XF_B10_lrtb_R);
        cell(ws, 14, ws.rows, 'Pick-up Time', common.excel.XF_B10_lrtb_L);
        cell(ws, 15, ws.rows, 'Parent Signature',
             common.excel.XF_B10_lrtb_L);
        ++ws.rows;
        for (var j = 0; j < 38; ++j, ++ws.rows)
            for (var k = 0; k < 16; ++k )
                cell(ws, k, ws.rows, '', common.excel.XF_lrtb_C);
        cell(ws, 0, ws.rows, 'Staff Initials', common.excel.XF_L);
        for (var j = 1; j < 14; ++j )
            cell(ws, j, ws.rows, '', common.excel.XF_lrtb_C);
        ++ws.rows;
        ++ws.rows;
        cell(ws, 0, ws.rows, 'X - Not Scheduled    A - Absent    NS - No Show    CL - Classroom    F - Field Trip    PG - Playground    TR - Transportation    V - Vacation    S - School',
             common.excel.XF_L);
        ++ws.rows;
        monday.inc(7), friday.inc(7);
    }

    return ws.export();
}



module.exports.generate = generate;
