var XLSX = require('xlsx'),

    cell = common.excel.functions.cell,
    cc = common.excel.functions.cc,
    sc = common.excel.functions.sc,
    getHHMM = common.excel.functions.getHHMM,
    round = common.excel.functions.round,
    dollars = common.excel.functions.dollars,

    worksheet = common.excel.worksheet;


function index(meal) { return index.meals.indexOf(meal) * 4 }
index.meals = ['breakfast', 'lunch', 'afternoon', 'dinner', 'evening'];



function generate(blank) {
    var file_name = meals.excel.file_name,
        date = meals.model.report_date.clone(),
        month = date.getMonth(),
        dates = [];

    // build a list of all saturdays in the month
    date.setDate(1);
    date.inc(6 - date.getDay());
    do {
        dates.push(date.clone());
        date.inc(7);
    } while (date.getMonth() === month);

    try {
        XLSX.writeFile({
            SheetNames : ['Saturday'],
            Sheets : {Saturday: make_sheet(dates)}
        }, file_name);
    } catch (error) {
        log.error(error);
        log.debug(error.stack);
        throw new Error('Error generating spreadsheet');
    }
    log.debug('Spreadsheet generated.');
}



function make_sheet(dates) {
    var children = meals.model.data,
        month = meals.model.report_date.getMonth(),
        abc = 'ABC', ML = ['BR', 'LU', 'AS', 'DI', 'ES'],
        mls = ['breakfast', 'lunch', 'afternoon', 'dinner', 'evening'],
        data = {};
        day_totals = dates.map(function (date) {
            return Array(15).fill(date.getMonth() === month ? 0 : '');
        });


    // filter the raw child meal data into a map of child->[a/b/c by day] and
    // his totals
    children.forEach(function (child, index) {
        var name = child.name,
            cx = child.classification || meals.config.default_class;
            offset = abc.indexOf(cx);
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
                    var column = mls.indexOf(meal)*3 + offset;
                    ++data[name][week][column];
                    ++day_totals[week][column];
                });
            });
    });


    var ws = new common.excel.worksheet(78);
    ws['!page'] = {
        margins : {left : 0.4, right : 0.4, top : 0.4, bottom : 0.4},
        landscape : true
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
    ws['!merges'] = [{s : {c : 0, r : ws.rows},
                      e : {c : dates.length*15 + 2, r : ws.rows}},
                     {s : {c : 0, r : ws.rows+1},
                      e : {c : dates.length*15 + 2, r : ws.rows+1}}];


    cell(ws, 0, ws.rows++, 'Record of Meals and Supplements Served',
         common.excel.XF_8_C);
    cell(ws, 0, ws.rows++,
         'Saturday meals ' + dates[0].toLocaleDateString() + '-' +
         dates[dates.length-1].toLocaleDateString(), common.excel.XF_8_C);


    // for each day
    for (var i = 0, length = dates.length; i < length; ++i) {
        // header
        ws['!merges'].push(
            {s: {c : 3 + i*15, r : ws.rows},
             e: {c : 3 + i*15 + 14, r : ws.rows}});
        cell(ws, 3 + i*15, ws.rows, dates[i].toLocaleDateString(),
             common.excel.XF_8_LRTB_C);
        for (var x = 1; x < 15; ++x)
            cell(ws, 3 + i*15 + x, ws.rows, '', common.excel.XF_8_LRTB_C);

        // for each day's meals
        for (var j = 0; j < 5; ++j) {
            // header
            ws['!merges'].push(
                {s : {c : 3 + i*15 + j*3, r : ws.rows+1},
                 e : {c : 3 + i*15 + j*3 + 2, r : ws.rows+1}});
            cell(ws, 3 + i*15 + j*3, ws.rows+1, ML[j],
                 common.excel.XF_8_LT_C);
            cell(ws, 3 + i*15 + j*3 + 1, ws.rows+1, '', common.excel.XF_8_T_C);
            cell(ws, 3 + i*15 + j*3 + 2, ws.rows+1, '', common.excel.XF_8_RT_C);

            // for each day's meals' classifications
            for (var k = 0; k < 3; ++k) {
                // header
                cell(ws, 3 + i*15 + j*3 + k, ws.rows+2, 'ABC'[k],
                     common.excel['XF_8_' + ['LB', 'B', 'RB'][k] + '_C']);

                // for each day's meals' classifications' children
                Object.keys(data).forEach(function (name, l) {
                    var child = data[name];
                    // first time through write the row labels
                    if (i == 0 && j == 0 && k == 0) {
                        cell(ws, 0, ws.rows+3+l, l + 1, common.excel.XF_8_R);
                        cell(ws, 1, ws.rows+3+l, name, common.excel.XF_8_L);
                        cell(ws, 2, ws.rows+3+l, child.cx, common.excel.XF_8_C);
                    }
                    cell(ws, 3 + i*15 + j*3 + k, ws.rows+3+l, child[i][j*3 + k],
                         common.excel['XF_8' + ['_L', '', '_R'][k] + '_R']);
                });

                // totals
                cell(ws, 3 + i*15 + j*3 + k, Object.keys(data).length + 5,
                     day_totals[i][j*3 + k], common.excel.XF_B8_LRTB_R);
            }
        }
    }
    
    ws.rows += Object.keys(data).length + 3;
    cell(ws, 1, ws.rows, 'Total', common.excel.XF_B8_R);


    return ws.export();
}



module.exports.generate = generate;
