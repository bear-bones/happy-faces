var XLSX = require('xlsx'),

    cell = common.excel.functions.cell,
    cc = common.excel.functions.cc,
    sc = common.excel.functions.sc,
    getHHMM = common.excel.functions.getHHMM,
    getHHMMam = common.excel.functions.getHHMMam,
    round = common.excel.functions.round,

    worksheet = common.excel.worksheet;


function punch_text(hour, punches) {
    for (var i = 0; i < punches.length; ++i) {
        var punch = punches[i];
        if ((hour === 6 && punch.start < 6) ||
            (punch.start >= hour && punch.start < hour + 1))
            return punch.start_str;
        else if ((hour === 20 && punch.end > hour) ||
                 (punch.end >= hour && punch.end < hour + 1))
            return punch.end_str;
        else if (punch.start < hour && punch.end >= hour)
            return 'X';
    }
    return '';
}

function combine(a, b, c, d, e) {
    return a.map(function (_, i) {
        return a[i] + b[i] + c[i] + d[i] + e[i];
    });
}

function blank_to(ws, row) {
    while (ws.rows < row) {
        for (var j = 0; j < 18; ++j) cell(ws, j, ws.rows, '');
        ++ws.rows;
    }
}


function generate() {
    try {
        XLSX.writeFile({
            SheetNames : ['Roll Call by Classroom'],
            Sheets : {
                'Roll Call by Classroom' : make_sheet(),
            }
        }, meals.excel.file_name);
    } catch (error) {
        log.error(error);
        log.debug(error.stack);
        throw new Error('Error generating spreadsheet');
    }
    log.debug('Spreadsheet generated.');
}


function make_sheet() {
    var date = meals.model.report_date.clone(),
        ws = new common.excel.worksheet(18),
        infant_totals = (new Array(15)).fill(0),
        toddler_totals = (new Array(15)).fill(0),
        discovery_totals = (new Array(15)).fill(0),
        creativity_totals = (new Array(15)).fill(0),
        school_totals = (new Array(15)).fill(0),
        totals;

    ws['!page'] = {
        margins : {left : 0.3, right : 0.3, top : 0.4, bottom : 0.4},
        landscape : true
    };
    ws['!cols'] = [{wch: 8}, {wch: 4.5}, {wch:31},
        {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:4.5},
        {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:4.5}, {wch:4.5},
        {wch:4.5}, {wch:4.5}, {wch:4.5}];
    ws['!merges'] = [];

    blank_to(ws, 44);
    make_page_header(ws, date);
    make_totals_line(ws, meals.config['cat1_desc'], '', 'XF_B8_lrTb_');
    make_room_chunk(ws, date, 1, infant_totals);
    make_totals_line(ws, meals.config['cat2_desc'], '', 'XF_B8_lrtb_');
    make_room_chunk(ws, date, 2, infant_totals);
    make_totals_line(ws, 'Infants', infant_totals);
    blank_to(ws, 88);
    make_page_header(ws, date);
    make_totals_line(ws, meals.config['cat3_desc'], '', 'XF_B8_lrTb_');
    make_room_chunk(ws, date, 3, toddler_totals);
    make_totals_line(ws, meals.config['cat4_desc'], '', 'XF_B8_lrtb_');
    make_room_chunk(ws, date, 4, toddler_totals);
    make_totals_line(ws, 'Toddlers', toddler_totals);
    blank_to(ws, 132);
    make_page_header(ws, date);
    make_totals_line(ws, meals.config['cat5_desc'], '', 'XF_B8_lrTb_');
    make_room_chunk(ws, date, 5, discovery_totals);
    make_totals_line(ws, 'Pre-K (' + meals.config['cat5_desc'] + ')',
                     discovery_totals);
    ++ws.rows;
    make_totals_line(ws, meals.config['cat6_desc'], '', 'XF_B8_lrTb_');
    make_room_chunk(ws, date, 6, creativity_totals);
    make_totals_line(ws, 'Pre-K (' + meals.config['cat6_desc'] + ')',
                     creativity_totals);
    blank_to(ws, 176);
    make_page_header(ws, date);
    make_totals_line(ws, meals.config['cat7_desc'], '', 'XF_B8_lrTb_');
    make_room_chunk(ws, date, 7, school_totals);
    make_totals_line(ws, meals.config['cat8_desc'], '', 'XF_B8_lrtb_');
    make_room_chunk(ws, date, 8, school_totals);
    make_totals_line(ws, 'After School', school_totals);

    var rows = ws.rows;
    ws.rows = 0;

    ws['!merges'].push({s : {c : 1, r : ws.rows}, e : {c : 18, r : ws.rows}});
    ws['!merges'].push(
        {s : {c : 1, r : ws.rows+1}, e : {c : 18, r : ws.rows+1}});

    cell(ws, 1, ws.rows++, 'Happy Faces Child Development Center',
         common.excel.XF_B8_C);
    cell(ws, 1, ws.rows++, date.toLocaleDateString(), common.excel.XF_B8_C);
    ws.rows += 2;

    make_page_header(ws, date, '');

    ++ws.rows;
    ws['!merges'].push({s : {c : 2, r : ws.rows}, e : {c : 17, r : ws.rows}});
    cell(ws, 2, ws.rows, 'Attendance', common.excel.XF_B8_Tb_C);
    for (var i = 3; i <= 17; ++i)
        cell(ws, i, ws.rows, '', common.excel.XF_B8_Tb_L);
    ++ws.rows;
    make_totals_line(ws, 'Infants', infant_totals, 'XF_B8_');   
    make_totals_line(ws, 'Toddlers', toddler_totals, 'XF_B8_');   
    make_totals_line(ws, 'Pre-K (' + meals.config['cat5_desc'] + ')',
                     discovery_totals, 'XF_B8_');   
    make_totals_line(ws, 'Pre-K (' + meals.config['cat6_desc'] + ')',
                     creativity_totals, 'XF_B8_');   
    make_totals_line(ws, 'After School', school_totals, 'XF_B8_');   
    make_totals_line(ws, 'Total', combine(
        infant_totals, toddler_totals, discovery_totals, creativity_totals,
        school_totals
    ), 'XF_B8_lrtB_');

    infant_totals = infant_totals.map(function (n) {return n / 4});
    toddler_totals = toddler_totals.map(function (n) {return n / 6});
    discovery_totals = discovery_totals.map(function (n) {return n / 10});
    creativity_totals = creativity_totals.map(function (n) {return n / 12});
    school_totals = school_totals.map(function (n) {return n / 15});

    ++ws.rows;
    ws['!merges'].push({s : {c : 2, r : ws.rows}, e : {c : 17, r : ws.rows}});
    cell(ws, 2, ws.rows, 'Required Staff', common.excel.XF_B8_Tb_C);
    for (var i = 3; i <= 17; ++i)
        cell(ws, i, ws.rows, '', common.excel.XF_B8_Tb_L);
    ++ws.rows;
    make_totals_line(ws, ['4:1', 'Infants'], infant_totals, 'XF_B8_');   
    make_totals_line(ws, ['6:1', 'Toddlers'], toddler_totals, 'XF_B8_');   
    make_totals_line(ws, ['10:1', 'Pre-K (' + meals.config['cat5_desc'] + ')'],
                     discovery_totals, 'XF_B8_');   
    make_totals_line(ws, ['12:1', 'Pre-K (' + meals.config['cat6_desc'] + ')'],
                     creativity_totals, 'XF_B8_');   
    make_totals_line(ws, ['15:1', 'After School'], school_totals, 'XF_B8_');   
    make_totals_line(ws, 'Total', combine(
        infant_totals, toddler_totals, discovery_totals, creativity_totals,
        school_totals
    ), 'XF_B8_lrtb_');

    make_totals_line(ws, 'Actual Staff', '', 'XF_B8_lrtb_');
    make_totals_line(ws, 'Difference', '', 'XF_B8_lrtB_');

    ws.rows = rows;
    return ws.export();
}


var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
              'August', 'September', 'October', 'November', 'December'];
function make_page_header(ws, date, label) {
    label = label === undefined ? 'Name' : label;
    ws['!merges'].push({s : {c : 2, r : ws.rows}, e : {c : 17, r : ws.rows}});
    cell(ws, 2, ws.rows++, months[date.getMonth()] + ' ' + date.getFullYear());
    cell(ws, 2, ws.rows, label, common.excel.XF_B8_lrTB_L);
    cell(ws, 3, ws.rows, '6:00', common.excel.XF_B8_lrTB_R);
    cell(ws, 4, ws.rows, '7:00', common.excel.XF_B8_lrTB_R);
    cell(ws, 5, ws.rows, '8:00', common.excel.XF_B8_lrTB_R);
    cell(ws, 6, ws.rows, '9:00', common.excel.XF_B8_lrTB_R);
    cell(ws, 7, ws.rows, '10:00', common.excel.XF_B8_lrTB_R);
    cell(ws, 8, ws.rows, '11:00', common.excel.XF_B8_lrTB_R);
    cell(ws, 9, ws.rows, '12:00', common.excel.XF_B8_lrTB_R);
    cell(ws, 10, ws.rows, '1:00', common.excel.XF_B8_lrTB_R);
    cell(ws, 11, ws.rows, '2:00', common.excel.XF_B8_lrTB_R);
    cell(ws, 12, ws.rows, '3:00', common.excel.XF_B8_lrTB_R);
    cell(ws, 13, ws.rows, '4:00', common.excel.XF_B8_lrTB_R);
    cell(ws, 14, ws.rows, '5:00', common.excel.XF_B8_lrTB_R);
    cell(ws, 15, ws.rows, '6:00', common.excel.XF_B8_lrTB_R);
    cell(ws, 16, ws.rows, '7:00', common.excel.XF_B8_lrTB_R);
    cell(ws, 17, ws.rows, '8:00', common.excel.XF_B8_lrTB_R);
    ++ws.rows;
}


function make_room_chunk(ws, date, room, totals) {
    var index = date.getMonth()*100 + date.getDate();

    meals.model.data
        .filter(function (child) {return child.classroom === room - 1})
        .filter(function (child) {return child.punches[index].length > 0})
        .forEach(function (child, i) {
            var punches = child.punches[index]
                .map(function (punch) {return {
                    start : (new Date(punch.start)).getUTCHours(),
                    start_str : getHHMMam(punch.start),
                    end : (new Date(punch.end)).getUTCHours(),
                    end_str : getHHMMam(punch.end)
                }});
            cell(ws, 1, ws.rows, i + 1, common.excel.XF_8_lrtb_R);
            cell(ws, 2, ws.rows, child.name, common.excel.XF_8_lrtb_L);
            for (var hour = 6, text; hour <= 20; ++hour) {
                text = punch_text(hour, punches);
                format = 'XF_8_lrtb_' + (text === 'X' ? 'C' : 'R');
                cell(ws, hour - 3, ws.rows, text, common.excel[format]);
                if (text !== '') ++totals[hour - 6];
            }
            ++ws.rows;
        });
}


function make_totals_line(ws, label, totals, format) {
    var ratio;
    if (format === undefined) format = 'XF_B8_lrTB_';
    if (typeof label === 'object') {
        ratio = label[0];
        label = label[1];
    }
    if (ratio)
        cell(ws, 1, ws.rows, ratio, common.excel[format + 'L']);
    cell(ws, 2, ws.rows, label, common.excel[format + 'L']);
    for (var i = 0; i < 15; ++i)
        cell(ws, i + 3, ws.rows, totals && round(totals[i]),
             common.excel[format + 'R']);
    ++ws.rows;
}


module.exports.generate = generate;
