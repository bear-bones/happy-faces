var XLSX = require('xlsx'),

    excel = common.excel,

    cell = excel.functions.cell,
    cc = excel.functions.cc,
    sc = excel.functions.sc,
    getHHMM = excel.functions.getHHMM,
    getHHMMam = excel.functions.getHHMMam,
    round = excel.functions.round,

    worksheet = excel.worksheet;



function generate(done, blank) {
    var date = meals.model.report_date.clone(),
        month = date.getMonth(),
        dates = [],
        filter_dates = [],
        options = {},
        source;

    // build a list of the monday-friday containing the report date
    date.setDate(date.getDate() + 1 - date.getDay());
    for (var i = 0; i < 5; ++i, date.inc())
        dates.push(date.clone());

    options.SheetNames = ['Roll Call'];
    options.Sheets = {};

    function execute(data, filter_dates) {
        try {
            options.Sheets['Roll Call'] =
                make_sheet(data, dates, filter_dates, blank);
            XLSX.writeFile(options, meals.excel.file_name);
            log.debug('Spreadsheet generated.');
            done();
        } catch (e) {
            done(e);
        }
    }

    try {
        if (blank) {
            filter_dates = dates.map(function (d) {return d.clone().inc(-7)});
            source = {
                data: meals.model.data, report_date: date.inc(-7),
                no_punch_out: []
            };
            co(function* () {
                yield* meals.model.load.process_data(false, source);
                execute(source.data, filter_dates);
            });
        } else {
            execute(meals.model.data, dates);
        }
    } catch (error) {
        log.error(error);
        log.debug(error.stack);
        throw new Error('Error generating spreadsheet');
    }
}



var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
              'August', 'September', 'October', 'November', 'December'];
function make_sheet(data, dates, filter_dates, blank) {
    var ws = new excel.worksheet(32),
        totals = {
            A : (new Array(dates.length*5 + 5)).fill(0),
            B : (new Array(dates.length*5 + 5)).fill(0),
            C : (new Array(dates.length*5 + 5)).fill(0)
        };

    ws['!page'] = {
        margins : {left : 0.3, right : 0.3, top : 0.4, bottom : 0.4},
        landscape : true
    };
    ws['!cols'] = [
        {wch:27.5},
        {wch:2.75}, {wch:2.75}, {wch:2.75}, {wch:2.75}, {wch:2.75}, {wch:2.75},
        {wch:2.75}, {wch:2.75}, {wch:2.75}, {wch:2.75}, {wch:2.75}, {wch:2.75},
        {wch:2.75}, {wch:2.75}, {wch:2.75}, {wch:2.75}, {wch:2.75}, {wch:2.75},
        {wch:2.75}, {wch:2.75}, {wch:2.75}, {wch:2.75}, {wch:2.75}, {wch:2.75},
        {wch:2.75}, {wch:2.75}, {wch:2.75}, {wch:2.75}, {wch:2.75}, {wch:2.75},
        {wch:2.75}];
    ws['!merges'] = [];

    // weekday report uses the eight rooms
    for (var i = 1; i <= 8; ++i) {
        ws['!merges'].push(
            {s : {c : 0, r : ws.rows}, e : {c : 31, r : ws.rows}});
        ws['!merges'].push(
            {s : {c : 0, r : ws.rows + 1}, e : {c : 31, r : ws.rows + 1}});
        ws['!merges'].push(
            {s : {c : 0, r : ws.rows + 2}, e : {c : 31, r : ws.rows + 2}});
        cell(ws, 0, ws.rows++, 'Record of Meals and Supplements Served',
             excel.XF_B8_C);
        cell(ws, 0, ws.rows++,
             dates[0].toLocaleDateString() + ' through ' +
             dates[dates.length - 1].toLocaleDateString(),
             excel.XF_B8_C);
        cell(ws, 0, ws.rows++, meals.config['cat' + i + '_desc'],
             excel.XF_B8_C);
        ['A', 'B', 'C'].forEach(function (code) {
            ++ws.rows;
            make_header(ws, code, dates);
            make_data(data, ws, i - 1, code, dates, filter_dates, totals,
                      blank);
        });
        for (; ws.rows % 44; ++ws.rows)
            for (var j = 0; j < 32; ++j)
                cell(ws, j, ws.rows, '', excel.XF_8_L);
    }

    // write grand totals by code
    if (!blank) ['A', 'B', 'C'].forEach(function (code) {
        cell(ws, 0, ws.rows, 'Grand Total "' + code + '" Meals',
             excel.XF_B8_lrtb_C);
        for (var i = 0; i < 5; ++i)
            for (var j = 0; j < 5; ++j)
                cell(ws, i*6 + 2 + j, ws.rows, totals[code][i*5 + j],
                     j ? excel.XF_B8_lrtb_C : excel.XF_B8_lrtb_C);
        ++ws.rows;
    });

    return ws.export();
}


function make_header(ws, code, dates) {
    dates.forEach(function(d, i) {
        ws['!merges'].push(
            {s : {c : i*6 + 2, r : ws.rows}, e : {c : i*6 + 6, r : ws.rows}});
        cell(ws, i*6 + 2, ws.rows, d.toLocaleDateString(), excel.XF_B8_ltb_C);
        cell(ws, i*6 + 3, ws.rows, '', excel.XF_B8_tb_C);
        cell(ws, i*6 + 4, ws.rows, '', excel.XF_B8_tb_C);
        cell(ws, i*6 + 5, ws.rows, '', excel.XF_B8_tb_C);
        cell(ws, i*6 + 6, ws.rows, '', excel.XF_B8_rtb_C);
        cell(ws, i*6 + 2, ws.rows + 1, 'BR', excel.XF_B8_lrtb_C);
        cell(ws, i*6 + 3, ws.rows + 1, 'LU', excel.XF_B8_lrtb_C);
        cell(ws, i*6 + 4, ws.rows + 1, 'AS', excel.XF_B8_lrtb_C);
        cell(ws, i*6 + 5, ws.rows + 1, 'SU', excel.XF_B8_lrtb_C);
        cell(ws, i*6 + 6, ws.rows + 1, 'ES', excel.XF_B8_lrtb_C);
    });
    ++ws.rows;
    cell(ws, 0, ws.rows++, 'Code "' + code + '" Child', excel.XF_B8_lrtb_C);
}


function make_data(data, ws, room, code, dates, filter_dates, grand_totals,
                   blank) {
    var totals = (new Array(dates.length*5 + 5)).fill(0);
    data.filter(function (child) {
            // room has to match
            if (child.classroom !== room) return false;
            // a/b/c classification has to match
            if ((child.classification || meals.config.default_class) !== code)
                return false;
            // child has to have punches
            return filter_dates.some(function (d) {
                var index = d.getMonth()*100 + d.getDate();
                return child.meals[index].length > 0;
            });
        })
        .forEach(function (child, index) {
            cell(ws, 0, ws.rows, child.name, excel.XF_B8_lrtb_L);
            dates.forEach(function (d, i) {
                var meals = child.meals[d.getMonth()*100 + d.getDate()];
                cell(ws, i*6 + 1, ws.rows, index + 1, excel.XF_8_C);
                cell(ws, i*6 + 2, ws.rows, '', excel.XF_8_lrtb_C);
                if (!blank && meals.indexOf('breakfast') >= 0) {
                    cell(ws, i*6 + 2, ws.rows, 'X', excel.XF_8_lrtb_C);
                    ++totals[i*5 + 0]; ++grand_totals[code][i*5 + 0];
                }
                cell(ws, i*6 + 3, ws.rows, '', excel.XF_8_lrtb_C);
                if (!blank && meals.indexOf('lunch') >= 0) {
                    cell(ws, i*6 + 3, ws.rows, 'X', excel.XF_8_lrtb_C);
                    ++totals[i*5 + 1]; ++grand_totals[code][i*5 + 1];
                }
                cell(ws, i*6 + 4, ws.rows, '', excel.XF_8_lrtb_C);
                if (!blank && meals.indexOf('afternoon') >= 0) {
                    cell(ws, i*6 + 4, ws.rows, 'X', excel.XF_8_lrtb_C);
                    ++totals[i*5 + 2]; ++grand_totals[code][i*5 + 2];
                }
                cell(ws, i*6 + 5, ws.rows, '', excel.XF_8_lrtb_C);
                if (!blank && meals.indexOf('dinner') >= 0) {
                    cell(ws, i*6 + 5, ws.rows, 'X', excel.XF_8_lrtb_C);
                    ++totals[i*5 + 3]; ++grand_totals[code][i*5 + 3];
                }
                cell(ws, i*6 + 6, ws.rows, '', excel.XF_8_lrtb_C);
                if (!blank && meals.indexOf('evening') >= 0) {
                    cell(ws, i*6 + 6, ws.rows, 'X', excel.XF_8_lrtb_C);
                    ++totals[i*5 + 4]; ++grand_totals[code][i*5 + 4];
                }
            });
            cell(ws, 31, ws.rows, index + 1, excel.XF_8_C);
            ++ws.rows;
        });
    cell(ws, 0, ws.rows, 'Total "' + code + '" Meals', excel.XF_B8_lrtb_C);
    for (var i = 0; i < 5; ++i)
        for (var j = 0; j < 5; ++j)
            cell(ws, i*6 + 2 + j, ws.rows, blank ? '' : totals[i*5 + j],
                 j ? excel.XF_B8_lrtb_C : excel.XF_B8_lrtb_C);
    ++ws.rows;
}


module.exports.generate = generate;
