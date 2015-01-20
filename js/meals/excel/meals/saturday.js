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
            SheetNames : ['Breakfast', 'Morning Snack', 'Lunch',
                          'Afternoon Snack', 'Supper', 'Evening Snack'],
            Sheets : {
                'Breakfast' : make_meal(dates, 'breakfast', blank),
                'Morning Snack' : make_meal(dates, 'morning', blank),
                'Lunch' : make_meal(dates, 'lunch', blank),
                'Afternoon Snack' : make_meal(dates, 'afternoon', blank),
                'Supper' : make_meal(dates, 'supper', blank),
                'Evening Snack' : make_meal(dates, 'evening', blank)
            }
        }, file_name);
    } catch (error) {
        log.error(error);
        log.debug(error.stack);
        throw new Error('Error generating spreadsheet');
    }
    log.debug('Spreadsheet generated.');
}



function make_meal(dates, meal, blank) {
    var children = meals.model.data,
        abc = ['A', 'B', 'C'],
        map = {}, totals = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    if (meal === 'supper') meal = 'dinner';

    // filter the raw child meal data into a map of child->[a/b/c by day] and
    // its totals
    children.forEach(function (child, index) {
        var name = child.name,
            cx = child.classification || meals.config.default_class;
            offset = abc.indexOf(cx);
        map[name] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; map[name].cx = cx;
        if (!blank) dates.forEach(function (date, col) {
            var meals = child.meals[date.getDate()-1];
            if (meals && meals.indexOf(meal) >= 0)
                totals[col*3 + offset] += (map[name][col*3 + offset] = 1);
        });
    });


    meal =
        meal === 'breakfast' ? 'Breakfast' :
        meal === 'morning'   ? 'Morning Snack' :
        meal === 'lunch'     ? 'Lunch' :
        meal === 'afternoon' ? 'Afternoon Snack' :
        meal === 'dinner'    ? 'Supper' :
        meal === 'evening'   ? 'Evening Snack' : '';


    var ws = new common.excel.worksheet(22);
    ws['!page'] = {
        margins : {left : 0.4, right : 0.4, top : 0.4, bottom : 0.4},
        landscape : true
    };
    ws['!cols'] = [{wch:3}, {wch:30}, {wch:5}, {wch:4.5}, {wch:4.5}, {wch:4.5},
        {wch:3}, {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:3}, {wch:4.5}, {wch:4.5},
        {wch:4.5}, {wch:3}, {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:3}, {wch:4.5},
        {wch:4.5}, {wch:4.5}];
    ws['!merges'] = [{s : {c : 0, r : ws.rows}, e : {c : 21, r : ws.rows}},
        {s : {c : 0, r : ws.rows+1}, e : {c : 21, r : ws.rows+1}},
        {s : {c : 3, r : ws.rows+2}, e : {c : 5, r : ws.rows+2}},
        {s : {c : 7, r : ws.rows+2}, e : {c : 9, r : ws.rows+2}},
        {s : {c : 11, r : ws.rows+2}, e : {c : 13, r : ws.rows+2}},
        {s : {c : 15, r : ws.rows+2}, e : {c : 17, r : ws.rows+2}},
        {s : {c : 19, r : ws.rows+2}, e : {c : 21, r : ws.rows+2}},
        {s : {c : 3, r : ws.rows+3}, e : {c : 5, r : ws.rows+3}},
        {s : {c : 7, r : ws.rows+3}, e : {c : 9, r : ws.rows+3}},
        {s : {c : 11, r : ws.rows+3}, e : {c : 13, r : ws.rows+3}},
        {s : {c : 15, r : ws.rows+3}, e : {c : 17, r : ws.rows+3}},
        {s : {c : 19, r : ws.rows+3}, e : {c : 21, r : ws.rows+3}}];

    cell(ws, 0, ws.rows++, 'Record of Meals and Supplements Served',
         common.excel.XF_C);
    cell(ws, 0, ws.rows++,
         'Saturday ' + meal + ' ' + dates[0].toLocaleDateString() + '-' +
         dates[dates.length-1].toLocaleDateString(), common.excel.XF_C);
    
    // sometimes last date won't be present so make (overwritable) cells now
    cell(ws, 19, ws.rows, '', common.excel.XF_ltb_C);
    cell(ws, 20, ws.rows, '', common.excel.XF_tb_C);
    cell(ws, 21, ws.rows, '', common.excel.XF_rtb_C);
    cell(ws, 19, ws.rows+1, '', common.excel.XF_ltb_C);
    cell(ws, 20, ws.rows+1, '', common.excel.XF_tb_C);
    cell(ws, 21, ws.rows+1, '', common.excel.XF_rtb_C);
    dates.forEach(function (date, col) {
        col = col*4 + 3;
        cell(ws, col, ws.rows, date.toLocaleDateString(),
             common.excel.XF_ltb_C);
        cell(ws, col+1, ws.rows, '', common.excel.XF_tb_C);
        cell(ws, col+2, ws.rows, '', common.excel.XF_rtb_C);
        cell(ws, col, ws.rows+1, meal, common.excel.XF_ltb_C);
        cell(ws, col+1, ws.rows+1, '', common.excel.XF_tb_C);
        cell(ws, col+2, ws.rows+1, '', common.excel.XF_rtb_C);
    });
    ws.rows +=2;

    cell(ws, 1, ws.rows, 'Last, First', common.excel.XF_lrtb_L);
    cell(ws, 2, ws.rows, 'Code', common.excel.XF_lrtb_C);
    cell(ws, 3, ws.rows, 'A', common.excel.XF_lrtb_C);
    cell(ws, 4, ws.rows, 'B', common.excel.XF_lrtb_C);
    cell(ws, 5, ws.rows, 'C', common.excel.XF_lrtb_C);
    cell(ws, 7, ws.rows, 'A', common.excel.XF_lrtb_C);
    cell(ws, 8, ws.rows, 'B', common.excel.XF_lrtb_C);
    cell(ws, 9, ws.rows, 'C', common.excel.XF_lrtb_C);
    cell(ws, 11, ws.rows, 'A', common.excel.XF_lrtb_C);
    cell(ws, 12, ws.rows, 'B', common.excel.XF_lrtb_C);
    cell(ws, 13, ws.rows, 'C', common.excel.XF_lrtb_C);
    cell(ws, 15, ws.rows, 'A', common.excel.XF_lrtb_C);
    cell(ws, 16, ws.rows, 'B', common.excel.XF_lrtb_C);
    cell(ws, 17, ws.rows, 'C', common.excel.XF_lrtb_C);
    cell(ws, 19, ws.rows, 'A', common.excel.XF_lrtb_C);
    cell(ws, 20, ws.rows, 'B', common.excel.XF_lrtb_C);
    cell(ws, 21, ws.rows, 'C', common.excel.XF_lrtb_C);
    ++ws.rows;

    Object.keys(map).sort().forEach(function (name, i) {
        child = map[name];
        cell(ws, 0, ws.rows, i + 1, common.excel.XF_C);
        cell(ws, 1, ws.rows, name, common.excel.XF_lrtb_L);
        cell(ws, 2, ws.rows, child.cx || meals.config.default_class,
             common.excel.XF_lrtb_C);
        for (var j = 1, k = 0; j <= 15; ++j, ++k) {
            cell(ws, 3 + k, ws.rows, child[j-1] || '', common.excel.XF_lrtb_C);
            if (j % 3 === 0 && j < 15)
                cell(ws, 3 + ++k, ws.rows, i + 1, common.excel.XF_C);
        }
        ++ws.rows;
    });

    ++ws.rows;
    cell(ws, 3, ws.rows, 'A', common.excel.XF_lrtb_C);
    cell(ws, 4, ws.rows, 'B', common.excel.XF_lrtb_C);
    cell(ws, 5, ws.rows, 'C', common.excel.XF_lrtb_C);
    cell(ws, 7, ws.rows, 'A', common.excel.XF_lrtb_C);
    cell(ws, 8, ws.rows, 'B', common.excel.XF_lrtb_C);
    cell(ws, 9, ws.rows, 'C', common.excel.XF_lrtb_C);
    cell(ws, 11, ws.rows, 'A', common.excel.XF_lrtb_C);
    cell(ws, 12, ws.rows, 'B', common.excel.XF_lrtb_C);
    cell(ws, 13, ws.rows, 'C', common.excel.XF_lrtb_C);
    cell(ws, 15, ws.rows, 'A', common.excel.XF_lrtb_C);
    cell(ws, 16, ws.rows, 'B', common.excel.XF_lrtb_C);
    cell(ws, 17, ws.rows, 'C', common.excel.XF_lrtb_C);
    cell(ws, 19, ws.rows, 'A', common.excel.XF_lrtb_C);
    cell(ws, 20, ws.rows, 'B', common.excel.XF_lrtb_C);
    cell(ws, 21, ws.rows, 'C', common.excel.XF_lrtb_C);

    ++ws.rows;
    cell(ws, 1, ws.rows, 'Total', common.excel.XF_lrtb_L);
    cell(ws, 2, ws.rows, '', common.excel.XF_lrtb_C);
    for (var j = 1, k = 0; j <= 15; ++j, ++k) {
        cell(ws, 3 + k, ws.rows, totals[j-1] || '', common.excel.XF_lrtb_C);
        if (j % 3 === 0) ++k;
    }


    return ws.export();
}



module.exports.generate = generate;
