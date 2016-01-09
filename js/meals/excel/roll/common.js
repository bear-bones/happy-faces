var XLSX = require('xlsx'),

    cell = common.excel.functions.cell,
    cc = common.excel.functions.cc,
    sc = common.excel.functions.sc,
    getHHMM = common.excel.functions.getHHMM,
    getHHMMam = common.excel.functions.getHHMMam,
    round = common.excel.functions.round,

    worksheet = common.excel.worksheet;



function generate(done, blank, supper, period) {
    var start = meals.model.report_date.clone(),
        end = meals.model.report_date.clone(), 
        filter_start = start,
        filter_end = end,
        options = {},
        source;

    options.SheetNames = ['Roll Call', 'Template'];
    options.Sheets = {};

    function execute(data, dates, filter_dates) {
        try {
            options.Sheets['Roll Call'] =
                make_roll_sheet(data, dates, filter_dates, blank);
            options.Sheets['Template'] = make_template();
            XLSX.writeFile(options, meals.excel.file_name);
            log.debug('Spreadsheet generated.');
            done();
        } catch (e) {
            done(e);
        }
    }

    try {
        end.setHours(23, 59, 59);
        switch (period) {
        case 'day':
            // already correct
            break;
        case 'week':
            // this adjusts the start and end to be the monday/saturday of the
            // week containing the report date.  a sunday yields the following
            // monday through saturday.
            start.setDate(start.getDate() + 1 - start.getDay()); // monday
            end.setDate(start.getDate() + 5); // saturday
            if (blank) {
                filter_start = start.clone().inc(-7);
                filter_end = end.clone().inc(-7);
            }
            break;
        case 'month':
            start.setDate(1);
            end.setMonth(end.getMonth() + 1, 0); // last day of the month
            if (blank) {
                filter_start = start.clone();
                filter_start.setMonth(filter_start.getMonth() - 1);
                filter_end = filter_start.clone();
                filter_end.setMonth(filter_end.getMonth() + 1, 0);
            }
            break;
        }
        if (blank) {
            source = {
                data: meals.model.data, report_date: filter_end,
                no_punch_out: []
            };
            co(function* () {
                yield* meals.model.load.process_data(false, source);
                execute(source.data, [start, end], [filter_start, filter_end]);
            });
        } else {
            execute(meals.model.data, [start, end], [start, end]);
        }
    } catch (error) {
        log.error(error);
        log.debug(error.stack);
        throw new Error('Error generating spreadsheet');
    }
}



function make_roll_sheet(data, dates, filter_dates, blank) {
    var ws = new common.excel.worksheet(16);

    ws['!page'] = {
        margins : {left : 0.3, right : 0.3, top : 0.4, bottom : 0.4},
        landscape : true
    };
    ws['!cols'] = [{wch: 4.5}, {wch:31}, {wch:4.5}, {wch:4.5}, {wch:4.5},
        {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:4.5},
        {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:30}];
    ws['!merges'] = [];

    // filter the data so only children who had a punch during the report period
    // appear on the report
    data = data.filter(function (child) {
        return filter_dates.some(function (date) {
            var index = date.getMonth()*100 + date.getDate();
            return child.punches[index] && child.punches[index].length;
        });
    });

    // build the sheet
    for (; dates[0] <= dates[1]; dates[0].inc()) {
        if (dates[0].getDay())
            for (var i = 1; i <= 8; ++i)
                make_roll_page(data, ws, dates[0], filter_dates[0], i, blank);
        // for blank report, increment filter date as well, to a max of the last
        // day in its month (this check is necessary for, say, a blank report
        // for March 2017, where dates[0] will go up to 3/31 but filter_dates[0]
        // must stop and repeat at 2/28 for the rest of the loop)
        if (blank && filter_dates[0] < filter_dates[1]) filter_dates[0].inc();
    }

    return ws.export();
}



function punch_text(hour, punches) {
    for (var i = 0; i < punches.length; ++i) {
        var punch = punches[i];
        if ((hour === 6 && punch.start < 6) ||
            (punch.start >= hour && punch.start < hour + 1))
            return punch.start_str;
        else if ((hour === 18 && punch.end > hour) ||
                 (punch.end >= hour && punch.end < hour + 1))
            return punch.end_str;
        else if (punch.start < hour && punch.end >= hour)
            return 'X';
    }
    return '';
}

function make_roll_page(data, ws, date, filter_date, room, blank) {
    var config = meals.config, pre = 'cat' + room + '_',
        room_name = config[pre + 'desc'], teacher = config[pre + 'teacher'],
        min = config[pre + 'min_age'], max = config[pre + 'max_age'];

    ws['!merges'].push({s : {c : 0, r : ws.rows}, e : {c : 15, r : ws.rows}});
    ws['!merges'].push(
        {s : {c : 0, r : ws.rows + 2}, e : {c : 15, r : ws.rows + 2}});
    ws['!merges'].push(
        {s : {c : 0, r : ws.rows + 3}, e : {c : 15, r : ws.rows + 3}});

    cell(ws, 0, ws.rows++, 'Happy Faces Child Development Center',
         common.excel.XF_B10_C);
    ++ws.rows;
    cell(ws, 0, ws.rows++, date.toLocaleDateString(), common.excel.XF_B10_C);
    cell(ws, 0, ws.rows++, room_name + ': ' + teacher, common.excel.XF_B10_C);

    cell(ws, 1, ws.rows, 'Name', common.excel.XF_B10_lrtb_L);
    cell(ws, 2, ws.rows, '6:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 2, ws.rows, '6:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 3, ws.rows, '7:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 4, ws.rows, '8:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 5, ws.rows, '9:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 6, ws.rows, '10:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 7, ws.rows, '11:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 8, ws.rows, '12:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 9, ws.rows, '1:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 10, ws.rows, '2:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 11, ws.rows, '3:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 12, ws.rows, '4:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 13, ws.rows, '5:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 14, ws.rows, '6:00', common.excel.XF_B10_lrtb_R);
    cell(ws, 15, ws.rows++, 'Comments', common.excel.XF_B10_lrtb_L);

    var count = 0 - ws.rows;
    data.filter(function (child) {return child.classroom === room - 1})
        .forEach(function (child, i) {
            var index = filter_date.getMonth()*100 + filter_date.getDate(),
                punches = child.punches[index].map(function (punch) {return {
                    start : (new Date(punch.start)).getUTCHours(),
                    start_str : getHHMMam(punch.start),
                    end : (new Date(punch.end)).getUTCHours(),
                    end_str : getHHMMam(punch.end)
                }});
            cell(ws, 0, ws.rows, i + 1, common.excel.XF_lrtb_R);
            cell(ws, 1, ws.rows, child.name + (child.txx ? ' (TXX)' : ''),
                 common.excel.XF_lrtb_L);
            for (var hour = 6, text; hour < 19; ++hour) {
                text = blank ? '' : punch_text(hour, punches);
                format = 'XF_lrtb_' + (text === 'X' ? 'C' : 'R');
                cell(ws, hour - 4, ws.rows, text, common.excel[format]);
            }
            cell(ws, 15, ws.rows++, '', common.excel.XF_lrtb_L);
        });

    count += ws.rows;
    if (count > 38) {
        count = (count-39) % 44;
        if (count) count = 44 - count;
    } else {
        count = 39 - count;
    }
    for (; count; --count, ++ws.rows)
        for (var k = 0; k < 16; ++k )
            cell(ws, k, ws.rows, '', common.excel.XF_lrtb_C);
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



module.exports.generate = generate;
