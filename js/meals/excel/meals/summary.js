var XLSX = require('xlsx'),

    cell = common.excel.functions.cell,
    cc = common.excel.functions.cc,
    sc = common.excel.functions.sc,
    round = common.excel.functions.round,
    dollars = common.excel.functions.dollars,

    worksheet = common.excel.worksheet,
    
    titles = [ 'Breakfast', 'Lunch', 'PM Snack', 'Supper', 'EV Snack'];


function index(meal) { return index.meals.indexOf(meal) * 4 }
index.meals = ['breakfast', 'lunch', 'afternoon', 'dinner', 'evening'];

function weekday(date) { return weekday.weekdays[date.getDay()] }
weekday.weekdays = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

function mealrate(column) {
    var remainder = column % 4, quotient = (column - remainder) / 4;
    return meals.config
        [mealrate.meals[quotient] + '_' + 'abc'[remainder-1] + '_rate'];

}
mealrate.meals = ['br', 'lu', 'as', 'di', 'es'];



function generate(done) {
    var file_name = meals.excel.file_name;

    try {
        XLSX.writeFile({
            SheetNames : ['Calendar', 'Totals'],
            Sheets :
                {Calendar : make_calendar_sheet(), Totals : make_totals_sheet()}
        }, file_name);
    } catch (error) {
        log.error(error);
        log.debug(error.stack);
        throw new Error('Error generating spreadsheet');
    }
    log.debug('Spreadsheet generated.');
    done();
}



function make_calendar_sheet() {
    var date = meals.model.report_date,
        ws = new worksheet(98),

        monday = date.clone(), saturday,
        month = date.getMonth(), weekday, i = 1;

    ws['!page'] = {
        margins : {left : 0.3, right : 0.3, top : 0.4, bottom : 0.4},
        landscape : true
    };
    ws['!cols'] = [
        {wch:8}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
        {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
        {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
        {wch:0.5}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
        {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
        {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
        {wch:0.5}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
        {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
        {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
        {wch:0.5}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
        {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
        {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
        {wch:0.5}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
        {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
        {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
        {wch:0.5}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
        {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
        {wch:1.75}, {wch:1.75}, {wch:1.75}, {wch:1.75},
        {wch: 6}];
    ws['!merges'] = [];

    // adjust things so that our range is the workweek containing the 1st
    monday.setDate(1);
    weekday = monday.getDay();
    monday.setDate(2 + (!(weekday % 6) ? !!weekday : -weekday));
    saturday = monday.clone();
    saturday.inc(5);

    // build sheets for each workweek that has at least one day in the month
    while (monday.getMonth() === month || saturday.getMonth() === month) {
        make_week(ws, monday, saturday);
        monday.inc(7), saturday.inc(7);
    }

    return ws.export();
}



function make_week(ws, monday, saturday) {
    var children = meals.model.data,
        month = meals.model.report_date.getMonth(),
        abc = 'ABC', ML = ['BR', 'LU', 'AS', 'DI', 'ES'],
        mls = ['breakfast', 'lunch', 'afternoon', 'dinner', 'evening'],
        dates = Array(6).fill(null).map(function (_, index) {
            if (index === 0) return monday;
            if (index === 5) return saturday;
            return monday.clone().inc(index);
        }),
        data = Array(8).fill(null).map(function () {
            return dates.map(function (date) {
                return Array(15).fill(date.getMonth() === month ? 0 : '');
            });
        }),
        room_totals = Array(8).fill(0),
        day_totals = dates.map(function (date) {
            return Array(15).fill(date.getMonth() === month ? 0 : '');
        });


    // filter the raw child meal data into a map of room->[a/b/c by day] and
    // its totals
    children.forEach(function (child, index) {
        var cx = child.classification || meals.config.default_class;
            offset = abc.indexOf(cx);
        dates
            .map(function (date) {
                if (date.getMonth() !== month) return [];
                return child.meals[date.getMonth()*100 + date.getDate()];
            })
            .forEach(function (_meals, weekday) {
                _meals.forEach(function (meal) {
                    var column = mls.indexOf(meal)*3 + offset;
                    ++data[child.classroom][weekday][column];
                    ++room_totals[child.classroom];
                    ++day_totals[weekday][column];
                });
            });
    });


    // for each day
    for (var i = 0; i < 6; ++i) {
        // header
        ws['!merges'].push(
            {s: {c : i*16 + 1, r : ws.rows}, e: {c : i*16 + 15, r : ws.rows}});
        if (dates[i].getMonth() === month)
            cell(ws, i*16 + 1, ws.rows, dates[i].toLocaleDateString(),
                 common.excel.XF_8_C);

        // for each day's meals
        for (var j = 0; j < 5; ++j) {
            // header
            ws['!merges'].push(
                {s : {c : i*16 + j*3 + 1, r : ws.rows+1},
                 e : {c : i*16 + j*3 + 3, r : ws.rows+1}});
            cell(ws, i*16 + j*3 + 1, ws.rows+1, ML[j], common.excel.XF_8_LT_C);
            cell(ws, i*16 + j*3 + 2, ws.rows+1, '', common.excel.XF_8_T_C);
            cell(ws, i*16 + j*3 + 3, ws.rows+1, '', common.excel.XF_8_RT_C);

            // for each day's meals' classifications
            for (var k = 0; k < 3; ++k) {
                // header
                cell(ws, i*16 + j*3 + 1 + k, ws.rows+2, 'ABC'[k],
                     common.excel['XF_8_' + ['LB', 'B', 'RB'][k] + '_C']);

                // for each day's meals' classifications' rooms
                for (var l = 0; l < 8; ++l)
                    cell(ws, i*16 + j*3 + 1 + k, ws.rows+3+l,
                         data[l][i][j*3 + k],
                         common.excel['XF_8' + ['_L', '', '_R'][k] + '_R']);

                // totals
                cell(ws, i*16 + j*3 + 1 + k, ws.rows+11, day_totals[i][j*3 + k],
                     common.excel.XF_B8_LRTB_R);
            }
        }
    }
    
    ws.rows += 3;

    // for each room
    for (var i = 0; i < 8; ++i) {
        cell(ws, 0, ws.rows, meals.config['cat' + (i+1) + '_desc'],
             common.excel.XF_8_R);
        cell(ws, 96, ws.rows++, room_totals[i], common.excel.XF_8_R);
    }

    cell(ws, 0, ws.rows, 'Total', common.excel.XF_B8_R);
    cell(ws, 96, ws.rows++, room_totals.reduce(function (a, b) {return a + b}),
         common.excel.XF_B8_R);

    ws.rows += 3;
}



function make_totals_sheet() {
    var date = meals.model.report_date.clone(),
        children = meals.model.data,
        data = Array(22).fill(0), mtotals = Array(5).fill(0), totals,
        ws = new worksheet(24);
    date.setMonth(date.getMonth() + 1, 0);  // last day of month

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
            if (_meals && _meals.length) ++data[data.length - 2][day];
            _meals.forEach(function (meal) {
                ++data[index(meal) + offset][day];
                ++data[index(meal) + 3][day];
                ++data[data.length - 1][day];
            });
        }
    });
    totals = data.map(function (column) {
        return column.reduce(function (a, b) {return a + b});
    });


    ws['!page'] = {
        margins : {left : 0.3, right : 0.3, top : 0.4, bottom : 0.4},
        landscape : true
    };
    ws['!cols'] = [{wch:9}, {wch:6}, {wch:6}, {wch:6}, {wch:6}, {wch:4},
        {wch:6}, {wch:6}, {wch:6}, {wch:4}, {wch:6}, {wch:6}, {wch:6}, {wch:4},
        {wch:6}, {wch:6}, {wch:6}, {wch:4}, {wch:6}, {wch:6}, {wch:6}, {wch:4},
        {wch:7}, {wch:7}];
    ws['!merges'] = [
        {s : {c : 2, r : ws.rows}, e : {c : 5, r : ws.rows}},
        {s : {c : 6, r : ws.rows}, e : {c : 9, r : ws.rows}},
        {s : {c : 10, r : ws.rows}, e : {c : 13, r : ws.rows}},
        {s : {c : 14, r : ws.rows}, e : {c : 17, r : ws.rows}},
        {s : {c : 18, r : ws.rows}, e : {c : 21, r : ws.rows}},
        {s : {c : 0, r : ws.rows+1}, e : {c : 1, r : ws.rows+1}}];

    for (var i = 0; i < 5; ++i) {
        cell(ws, 4*i + 2, ws.rows, titles[i],
             i ? common.excel.XF_8_lTB_C : common.excel.XF_8_LTB_C);
        cell(ws, 4*i + 3, ws.rows, '', common.excel.XF_8_TB_L);
        cell(ws, 4*i + 4, ws.rows, '', common.excel.XF_8_TB_L);
        cell(ws, 4*i + 5, ws.rows, '', common.excel.XF_8_rTB_L);
    }
    cell(ws, 22, ws.rows, 'Daily', common.excel.XF_8_LrT_C);
    cell(ws, 23, ws.rows, 'Daily', common.excel.XF_8_lrT_C);
    cell(ws, 24, ws.rows++, 'Labor', common.excel.XF_8_lRT_C);

    cell(ws, 0, ws.rows, 'Date', common.excel.XF_8_LTB_C);
    cell(ws, 1, ws.rows, '', common.excel.XF_8_RTB_C);
    for (var i = 2; i < 22; ++i)
        cell(ws, i, ws.rows, "P FR"[i%4],
             common.excel['XF_8_' + (i%4 === 1 ? 'GRAY_' : '') + 'lrTB_C']);
    cell(ws, 22, ws.rows, 'Att', common.excel.XF_8_LrB_C);
    cell(ws, 23, ws.rows, 'Meals', common.excel.XF_8_lrB_C);
    cell(ws, 24, ws.rows++, 'Days', common.excel.XF_8_lRB_C);

    var i = 0, l = 0, d = date.clone(); d.setDate(1);
    for (; i < date.getDate(); ++i, ++ws.rows, d.inc()) {
        cell(ws, 0, ws.rows, weekday(d), common.excel.XF_8_L_L);
        cell(ws, 1, ws.rows, d.getDate(), common.excel.XF_8_R_R);
        if (d.getDay()) {
            for (var j = 2; j < 22; ++j)
                cell(ws, j, ws.rows, data[j-2][i],
                     common.excel['XF_8_' + (j%4===1 ? 'GRAY_' : '') + 'lr_R']);
            cell(ws, 22, ws.rows, data[20][i], common.excel.XF_8_Lr_R);
            cell(ws, 23, ws.rows, data[21][i], common.excel.XF_8_lr_R);
            cell(ws, 24, ws.rows, ++l, common.excel.XF_8_lR_R);
        } else {
            for (var j = 2; j < 22; ++j)
                cell(ws, j, ws.rows, '',
                     common.excel['XF_8_' + (j%4===1 ? 'GRAY_' : '') + 'lr_R']);
            cell(ws, 22, ws.rows, '', common.excel.XF_8_Lr_R);
            cell(ws, 23, ws.rows, '', common.excel.XF_8_lr_R);
            cell(ws, 24, ws.rows, '', common.excel.XF_8_lR_R);
        }
    }

    ws['!merges'].push({s: {c: 0, r: ws.rows}, e: {c: 1, r: ws.rows}});
    ws['!merges'].push({s: {c: 0, r: ws.rows+1}, e: {c: 1, r: ws.rows+1}});
    ws['!merges'].push({s: {c: 0, r: ws.rows+2}, e: {c: 1, r: ws.rows+2}});
    cell(ws, 0, ws.rows, 'Total', common.excel.XF_8_LTB_R);
    cell(ws, 0, ws.rows+1, 'Price/Meal', common.excel.XF_8_LTB_R);
    cell(ws, 0, ws.rows+2, 'Amount', common.excel.XF_8_LTB_R);
    cell(ws, 1, ws.rows, '', common.excel.XF_8_RTB_R);
    cell(ws, 1, ws.rows+1, '', common.excel.XF_8_RTB_R);
    cell(ws, 1, ws.rows+2, '', common.excel.XF_8_RTB_R);
    for (var i = 2, total, rate, grand = 0; i < 22; ++i) {
        total = totals[i - 2]; rate = mealrate(i - 1);
        cell(ws, i, ws.rows, total, common.excel.XF_8_lrTB_R);
        if (i % 4 === 1) cell(ws, i, ws.rows+1, '', common.excel.XF_8_lrTB_R);
        else cell(ws, i, ws.rows+1, dollars(rate), common.excel.XF_8_lrTB_R);
        if (i % 4 === 1) cell(ws, i, ws.rows+2, '', common.excel.XF_8_lrTB_R);
        else cell(ws, i, ws.rows+2, dollars(total * rate),
                  common.excel.XF_8_lrTB_R);
        if (i % 4 !== 1) grand += total * rate;
    }
    cell(ws, 22, ws.rows, totals[20], common.excel.XF_8_LrTB_R);
    cell(ws, 23, ws.rows, totals[21], common.excel.XF_8_lrTB_R);
    cell(ws, 24, ws.rows++, l, common.excel.XF_8_lRTB_R);
    cell(ws, 22, ws.rows, '', common.excel.XF_8_LrTB_C);
    cell(ws, 23, ws.rows, '', common.excel.XF_8_lrTB_C);
    cell(ws, 24, ws.rows++, '', common.excel.XF_8_lRTB_C);
    cell(ws, 22, ws.rows, dollars(grand), common.excel.XF_8_LrTB_R);
    cell(ws, 23, ws.rows, '', common.excel.XF_8_lrTB_C);
    cell(ws, 24, ws.rows++, '', common.excel.XF_8_lRTB_C);

    ++ws.rows;

    ws['!merges'].push({s : {c : 21, r : ws.rows}, e : {c : 23, r : ws.rows}})
    cell(ws, 21, ws.rows, 'Total', common.excel.XF_B8_R);
    cell(ws, 24, ws.rows++, dollars(grand), common.excel.XF_8_R);
    ws['!merges'].push({s : {c : 20, r : ws.rows}, e : {c : 23, r : ws.rows}})
    cell(ws, 20, ws.rows, 'Average Daily Attendance', common.excel.XF_B8_R);
    cell(ws, 24, ws.rows++, dollars(totals[totals.length - 2] / l),
         common.excel.XF_8_R);
    ws['!merges'].push({s : {c : 20, r : ws.rows}, e : {c : 23, r : ws.rows}})
    cell(ws, 20, ws.rows, 'Average Daily Meals', common.excel.XF_B8_R);
    cell(ws, 24, ws.rows++, dollars(totals[totals.length - 1] / l),
         common.excel.XF_8_R);


    return ws.export();
}




module.exports.generate = generate;
