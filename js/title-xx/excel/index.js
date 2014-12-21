var XLSX = require('xlsx'),
    
    months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
    ],
    BOLD_LEFT = 1,
    BOLD_RIGHT = 2,
    BOLD_THINTOP_THINBOTTOM_LEFT = 3,
    BOLD_THINTOP_MEDIUMBOTTOM_LEFT = 4,
    BOLD_MEDIUMTOP_MEDIUMBOTTOM_LEFT = 5,
    BOLD_MEDIUMTOP_MEDIUMBOTTOM_CENTER = 6,
    NORMAL_THINTOP_THINBOTTOM_LEFT = 7,
    NORMAL_THINTOP_THINBOTTOM_CENTER = 8,
    NORMAL_THINTOP_MEDIUMBOTTOM_CENTER = 9,
    NORMAL_THINBOTTOM = 10,
    NORMAL_THINTOP = 11
    NORMAL_RIGHT = 12;



function generate(file_name, children, config, report_date) {
    log.debug('Generating excel spreadsheet...');

    children = children.filter(function (child) {return child.line_num});
    children = children.sort(function (a, b) {
        return (a.claim_num*100 + a.line_num) - (b.claim_num*100 + b.line_num);
    });
    children.forEach(function (child) {
        child.first_date = null;
        child.last_date = null;
        child.hours = 0;
        child.days = 0;
    });

    var sheet_one = worksheet_one(children, report_date),
        sheet_two = worksheet_two(children, report_date),
        data = calculate_totals(children, report_date, config),
        sheet_three = worksheet_three(data.children),
        sheet_four = worksheet_four(data),
        sheet_five;

    try {
        XLSX.writeFile({
            SheetNames : ['1-15', '16-31', 'Summary', 'Totals', 'Notes'],
            Sheets : {
                '1-15' : sheet_one,
                '16-31' : sheet_two,
                'Summary' : sheet_three,
                'Totals' : sheet_four/*,
                'Notes' : worksheet_five()*/
            }
        }, file_name);
    } catch (error) {
        log.error(error);
        throw new Error('Error generating spreadsheet');
    }
    log.debug('Spreadsheet generated.');
}



function worksheet_one(children, report_date) {
    var ws = new title_xx.excel.worksheet(19);

    ws['!cols'] = [
        {wch:12}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8},
        {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8},
        {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:6}, {wch:6}
    ];

    children.forEach(function (child, i) {
        var mod = i % 4;
        if (mod === 0) build_header(ws, report_date, 1, 15);
        else build_spacer(ws, report_date, 1, 15);
        build_child(ws, report_date, 1, 15, children[i]);
        if (mod === 3) build_footer(ws, report_date, 1, 15);
    });

    return ws.export();
}



function worksheet_two(children, report_date) {
    var ws = new title_xx.excel.worksheet(20),
        last_day = (new Date(
            report_date.getFullYear(), report_date.getMonth() + 1, 0
        )).getDate();

    ws['!cols'] = [
        {wch:12}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8},
        {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8},
        {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8},
        {wch:6}, {wch:6}
    ];

    children.forEach(function (child, i) {
        var mod = i % 4;
        if (mod === 0) build_header(ws, report_date, 16, last_day);
        else build_spacer(ws, report_date, 16, last_day);
        build_child(ws, report_date, 16, last_day, children[i]);
        if (mod === 3) build_footer(ws, report_date, 16, last_day);
    });

    return ws.export();
}



function calculate_totals(children, report_date, config) {
    var data = {
            total_dollars : 0,
            total_hours : 0,
            total_days : 0,
            total_children : 0,
            rates : [
                {dollars : 0, hours : 0, days : 0, children : 0},
                {dollars : 0, hours : 0, days : 0, children : 0},
                {dollars : 0, hours : 0, days : 0, children : 0},
                {dollars : 0, hours : 0, days : 0, children : 0}
            ]
        },
        month_offset = report_date.getFullYear()*12 + report_date.getMonth()
            - (new Date()).getFullYear()*12 - (new Date()).getMonth();


    data.children = children.map(function (child) {
        var result = {
                claim_num : child.claim_num, line_num : child.line_num,
                name : child.name,
                from_date : child.from_date, to_date : child.to_date,
                fee : child.fee === 'yes' ? config.fee_amount : 0
            },
            age = child.age + month_offset,
            rate_unit, rate_index
                = age <= config.rate1_max_age ? 1
                : age <= config.rate2_max_age ? 2
                : age <= config.rate3_max_age ? 3 : 4;

        if (child.auth_unit === 'days') {
            result.time_unit = 'DY';
            result.time_amount = child.days;
            rate_unit = 'daily';
            data.total_days += result.time_amount;
            data.rates[rate_index-1].days += result.time_amount;
        } else {
            result.time_unit = 'HR';
            result.time_amount = child.hours;
            rate_unit = 'hourly';
            data.total_hours += result.time_amount;
            data.rates[rate_index-1].hours += result.time_amount;
        }

        result.rate = config['rate' + rate_index + '_' + rate_unit + '_rate'];
        if (result.time_amount > 0.0) {
            result.amount = result.time_amount * result.rate;
            data.total_dollars += result.amount;
            ++data.total_children;
            data.rates[rate_index-1].dollars += result.amount;
            ++data.rates[rate_index-1].children;
        }

        return result;
    });
        
    return data;
}



function worksheet_three(children) {
    var ws = new title_xx.excel.worksheet(13),
        claim_rows = 0, prev_claim = -1;

    ws['!cols'] = [
        {wch:4}, {wch:28}, {wch:8}, {wch:8}, {wch:4}, {wch:10}, {wch:10},
        {wch:4}, {wch:6}, {wch:4}, {wch:8}, {wch:6}, {wch:10}
    ];

    children.forEach(function (child) {
        // do header stuff for new claims
        if (child.claim_num !== prev_claim) {
            // if it's not the first claim, pad out the previous claim to 1 page
            if (prev_claim !== -1) {
                for (var i = 0; i < 13; ++i) 
                    cell(ws, i, ws.rows, '', NORMAL_THINTOP);
                ws.rows += 34 - claim_rows;
                claim_rows = 0;
            }
            prev_claim = child.claim_num;

            ws['!merges'] = ws['!merges'].concat([
                {s : {c : 0, r : ws.rows}, e : {c : 1, r : ws.rows}}
            ]);

            cell(ws, 0, ws.rows, 'Claim Number: ' + child.claim_num, BOLD_LEFT);
            ++ws.rows; ++claim_rows;
            cell(ws, 0, ws.rows, 'Line', BOLD_THINTOP_THINBOTTOM_LEFT);
            cell(ws, 1, ws.rows, 'Child Name', BOLD_THINTOP_THINBOTTOM_LEFT);
            cell(ws, 2, ws.rows, 'Client #', BOLD_THINTOP_THINBOTTOM_LEFT);
            cell(ws, 3, ws.rows, 'Auth #', BOLD_THINTOP_THINBOTTOM_LEFT);
            cell(ws, 4, ws.rows, 'Svc', BOLD_THINTOP_THINBOTTOM_LEFT);
            cell(ws, 5, ws.rows, 'From Date', BOLD_THINTOP_THINBOTTOM_LEFT);
            cell(ws, 6, ws.rows, 'To Date', BOLD_THINTOP_THINBOTTOM_LEFT);
            cell(ws, 7, ws.rows, 'Freq', BOLD_THINTOP_THINBOTTOM_LEFT);
            cell(ws, 8, ws.rows, 'Units', BOLD_THINTOP_THINBOTTOM_LEFT);
            cell(ws, 9, ws.rows, 'Rate', BOLD_THINTOP_THINBOTTOM_LEFT);
            cell(ws, 10, ws.rows, 'Charge', BOLD_THINTOP_THINBOTTOM_LEFT);
            cell(ws, 11, ws.rows, 'Fee', BOLD_THINTOP_THINBOTTOM_LEFT);
            cell(ws, 12, ws.rows, 'HHS Charge', BOLD_THINTOP_THINBOTTOM_LEFT);
            ++ws.rows; ++claim_rows;
        }

        cell(ws, 0, ws.rows, child.line_num);
        cell(ws, 1, ws.rows, child.name);
        cell(ws, 2, ws.rows, 0);
        cell(ws, 3, ws.rows, 0);
        cell(ws, 4, ws.rows, '');
        if (child.from_date)
            cell(ws, 5, ws.rows, child.from_date.toLocaleDateString());
        if (child.to_date)
            cell(ws, 6, ws.rows, child.to_date.toLocaleDateString());
        cell(ws, 7, ws.rows, child.time_unit);
        cell(ws, 8, ws.rows, round(child.time_amount), NORMAL_RIGHT);
        cell(ws, 9, ws.rows, child.rate, NORMAL_RIGHT);
        cell(ws, 10, ws.rows, round(child.amount), NORMAL_RIGHT);
        cell(ws, 11, ws.rows, child.fee, NORMAL_RIGHT);
        cell(ws, 12, ws.rows, round(child.amount) + child.fee, NORMAL_RIGHT);
        ++ws.rows; ++claim_rows;
    });

    return ws.export();
}

function worksheet_four(data) {
    var ws = new title_xx.excel.worksheet(2);
    ws['!cols'] = [{wch:16}, {wch:16}];

    cell(ws, 0, ws.rows, 'Total Dollars');
    cell(ws, 1, ws.rows, round(data.total_dollars), NORMAL_RIGHT);
    ++ws.rows;
    cell(ws, 0, ws.rows, 'Total Hours');
    cell(ws, 1, ws.rows, round(data.total_hours), NORMAL_RIGHT);
    ++ws.rows;
    cell(ws, 0, ws.rows, 'Total Days');
    cell(ws, 1, ws.rows, round(data.total_days), NORMAL_RIGHT);
    ++ws.rows;
    cell(ws, 0, ws.rows, 'Total Children');
    cell(ws, 1, ws.rows, round(data.total_children), NORMAL_RIGHT);
    ++ws.rows;

    ++ws.rows;

    for (var i = 0; i < 4; ++i) {
        cell(ws, 0, ws.rows, 'Rate ' + (i + 1) + ' Dollars');
        cell(ws, 1, ws.rows, round(data.rates[i].dollars), NORMAL_RIGHT);
        ++ws.rows;
        cell(ws, 0, ws.rows, 'Rate ' + (i + 1) + ' Hours');
        cell(ws, 1, ws.rows, round(data.rates[i].hours), NORMAL_RIGHT);
        ++ws.rows;
        cell(ws, 0, ws.rows, 'Rate ' + (i + 1) + ' Days');
        cell(ws, 1, ws.rows, round(data.rates[i].days), NORMAL_RIGHT);
        ++ws.rows;
        cell(ws, 0, ws.rows, 'Rate ' + (i + 1) + ' Children');
        cell(ws, 1, ws.rows, round(data.rates[i].children), NORMAL_RIGHT);
        ++ws.rows;
    }


    return ws.export();
}




function build_header(ws, report_date, first_day, last_day) {
    var offset = ws.cols - 19,
        range = offset
            ? '16th through the ' + last_day + (last_day === 31 ? 'st' : 'th')
            : '1st through the 15th';

    var rows = ws.rows;
    ws['!merges'] = ws['!merges'].concat([
        {s : {c : 0, r : rows}, e : {c : 8, r : rows}}, 
        {s : {c : 10 + offset, r : rows}, e : {c : 18 + offset, r : rows}}, 

        {s : {c : 1, r : rows + 1}, e : {c : 8, r : rows + 1}}, 
        {s : {c : 1, r : rows + 2}, e : {c : 8, r : rows + 2}}, 
        {s : {c : 1, r : rows + 3}, e : {c : 8, r : rows + 3}}, 

        {s : {c : 9 + offset, r : rows + 1}, e : {c : 10 + offset, r : rows + 1}}, 
        {s : {c : 11 + offset, r : rows + 1}, e : {c : 18 + offset, r : rows + 1}}, 
        {s : {c : 9 + offset, r : rows + 2}, e : {c : 10 + offset, r : rows + 2}}, 
        {s : {c : 11 + offset, r : rows + 2}, e : {c : 18 + offset, r : rows + 2}}, 
        {s : {c : 9 + offset, r : rows + 3}, e : {c : 10 + offset, r : rows + 3}}, 
        {s : {c : 11 + offset, r : rows + 3}, e : {c : 18 + offset, r : rows + 3}}, 

        {s : {c : 0, r : rows + 5}, e : {c : 18 + offset, r : rows + 5}}
    ]);


    cell(ws, 0, rows, 'Child Care Center Attendance Calendar', BOLD_LEFT);
    cell(
        ws, 10 + offset, rows, 'Nebraska Health and Human Services System',
        BOLD_RIGHT
    );

    cell(ws, 0, rows + 1, 'Prepared By:');
    cell(ws, 1, rows + 1, title_xx.config.prepared_by);
    cell(ws, 0, rows + 2, 'Prepared:');
    cell(ws, 1, rows + 2, (new Date()).toLocaleDateString());
    cell(ws, 0, rows + 3, 'Report For:');
    cell(
        ws, 1, rows + 3,
        months[report_date.getMonth()] + ' ' + report_date.getDate()
    );

    cell(ws, 9 + offset, rows + 1, 'Center:');
    cell(
        ws, 11 + offset, rows + 1, 'Happy Faces Child Development Center, LLC'
    );
    cell(ws, 9 + offset, rows + 2, 'Address:');
    cell(ws, 11 + offset, rows + 2, '2402 N Street, Omaha, NE, 68107');
    cell(ws, 9 + offset, rows + 3, 'Phone:');
    cell(ws, 11 + offset, rows + 3, '(402) 884-2402');

    cell(ws, 0, rows + 5, 'Attendance by days, the ' + range, BOLD_LEFT);

    cell(ws, 0, rows + 6, 'Child', BOLD_MEDIUMTOP_MEDIUMBOTTOM_LEFT);
    cell(ws, 1, rows + 6, '', BOLD_MEDIUMTOP_MEDIUMBOTTOM_LEFT);

    for (var c = 2, day = first_day; day <= last_day; ++c, ++day)
        cell(ws, c, rows + 6, '' + day, BOLD_MEDIUMTOP_MEDIUMBOTTOM_CENTER);
    cell(ws, c++, rows + 6, 'Hours', BOLD_MEDIUMTOP_MEDIUMBOTTOM_CENTER);
    cell(ws, c++, rows + 6, 'Days', BOLD_MEDIUMTOP_MEDIUMBOTTOM_CENTER);


    ws.rows += 7;
}


function build_spacer(ws, report_date, first_day, last_day) {
    for (var i = 0, length = last_day - first_day + 5; i < length; ++i)
        cell(ws, i, ws.rows, '', BOLD_MEDIUMTOP_MEDIUMBOTTOM_LEFT);
    ++ws.rows;
}


function build_child(ws, report_date, first_day, last_day, child) {
    var rows = ws.rows,
        name = child.name.split(', ', 2),
        punches = new Array(last_day - first_day + 1),
        total_time = 0, total_days = 0;

    child.punches
        .filter(function (punch) {
            var date = new Date(punch.time_in);
            return date.getMonth() === report_date.getMonth()
                && date.getFullYear() === report_date.getFullYear()
                && date.getDate() - first_day < punches.length
                && date.getDate() >= first_day;
        })
        .forEach(function (punch) {
            var date = new Date(punch.time_in),
                i = date.getDate() - first_day;
            if (!punches[i]) punches[i] = {punches : [], total : 0};
            if (punches[i].punches.length < 4 ) {
                punches[i].punches.push(getHHMM(punch.time_in));
                punches[i].punches.push(getHHMM(punch.time_out));
                punches[i].total += punch.time_out - punch.time_in;
            }
            // store some child data for use in calculating totals
            if (!child.from_date) child.from_date = date;
            child.to_date = date;
        });


    ws['!merges'] = ws['!merges'].concat([
        {s : {c : 0, r : rows + 4}, e : {c : 1, r : rows + 4}}
    ]);

    cell(ws, 0, rows, child.line_num);
    cell(ws, 0, rows + 2, name[0]);
    cell(ws, 0, rows + 1, name.pop());
    cell(
        ws, 0, rows + 4, 'Total hours per day', BOLD_THINTOP_MEDIUMBOTTOM_LEFT
    );
    cell(ws, 1, rows + 4, '', BOLD_THINTOP_MEDIUMBOTTOM_LEFT);

    cell(ws, 1, rows, 'IN');
    cell(ws, 1, rows + 1, 'OUT');
    cell(ws, 1, rows + 2, 'IN');
    cell(ws, 1, rows + 3, 'OUT');


    for (var i = 0, punches_length = punches.length; i < punches_length; ++i) {
        var punch = punches[i], total = 0;
        if (punch) {
            for (var j = 0, length = punch.punches.length; j < length; ++j)
                cell(ws, i + 2, rows + j, punch.punches[j]);
            total = punch.total; total_time += total; ++total_days;
        }
        cell(
            ws, i + 2, rows + 4, getHHMM(total),
            NORMAL_THINTOP_MEDIUMBOTTOM_CENTER
        );
    }


    cell(
        ws, punches.length + 2,
        rows + 4, round(total_time / 1000 / 60 / 60),
        BOLD_THINTOP_MEDIUMBOTTOM_LEFT
    );
    cell(
        ws, punches.length + 3, rows + 4, total_days,
        BOLD_THINTOP_MEDIUMBOTTOM_LEFT
    );


    // store data for totals worksheets
    child.hours += total_time / 1000 / 60 / 60;
    child.days += total_days;


    ws.rows += 5;
}


function build_footer(ws, report_date, first_day, last_day) {
    var rows =  ws.rows, columns = last_day - first_day + 4;

    ws['!merges'] = ws['!merges'].concat([
        {s : {c : 0, r : rows}, e : {c : columns, r : rows}},
        {s : {c : 0, r : rows + 1}, e : {c : columns, r : rows + 1}},
        {s : {c : 0, r : rows + 3}, e : {c : 1, r : rows + 3}},
        {s : {c : 2, r : rows + 3}, e : {c : 7, r : rows + 3}},
        {s : {c : 9, r : rows + 3}, e : {c : 10, r : rows + 3}},
        {s : {c : 11, r : rows + 3}, e : {c : 13, r : rows + 3}},
        {s : {c : columns - 1, r : rows + 3}, e : {c : columns, r : rows + 3}}
    ]);

    cell(ws, 0, rows, 'The exact number of hours (to the quarter-hour) of care provided must be indicated for each day you provide care.  Submit the');
    cell(ws, 0, rows + 1, 'original to the local office and retain the copy for your records. Report only time that the child is actually in attendance.');

    cell(ws, 0, rows + 3, "Provider's signature");
    cell(ws, 2, rows + 3, '', NORMAL_THINBOTTOM);
    cell(ws, 3, rows + 3, '', NORMAL_THINBOTTOM);
    cell(ws, 4, rows + 3, '', NORMAL_THINBOTTOM);
    cell(ws, 5, rows + 3, '', NORMAL_THINBOTTOM);
    cell(ws, 6, rows + 3, '', NORMAL_THINBOTTOM);
    cell(ws, 7, rows + 3, '', NORMAL_THINBOTTOM);
    cell(ws, 9, rows + 3, 'Date');
    cell(
        ws, 11, rows + 3, (new Date()).toLocaleDateString(), NORMAL_THINBOTTOM
    );
    cell(ws, 12, rows + 3, '', NORMAL_THINBOTTOM);
    cell(ws, 13, rows + 3, '', NORMAL_THINBOTTOM);
    cell(ws, columns - 1, rows + 3, 'Page ' + ++build_footer.page);

    ws.rows += 4;
}
build_footer.page = 0;



// convenience
function cell(worksheet, col, row, contents, style) {
    worksheet[cc(col, row)] = sc(contents, style);
}

// cell coordinates
function cc(col, row) {return XLSX.utils.encode_cell({c : col, r : row})}

// string cell
function sc(string, style) {
    var result = {t : 's', v : string};
    if (style) result.raw_style = style;
    return result;
}

// get time as \d?\d:\d\d
function getHHMM(timestamp) {
    var minutes = Math.round(timestamp / 1000 / 60),
        hours = Math.floor(minutes / 60);
    minutes = minutes % 60; hours = hours % 24;
    return hours + ':' + (minutes < 10 ? '0' : '') + minutes;
}

// round to hundredths
function round(num) {
    return Math.round(num * 100) / 100;
}



module.exports.generate = generate;
module.exports.worksheet = require('./worksheet.js');

module.exports.BOLD_LEFT = 1;
module.exports.BOLD_RIGHT = 2;
module.exports.BOLD_THINTOP_THINBOTTOM_LEFT = 3;
module.exports.BOLD_THINTOP_MEDIUMBOTTOM_LEFT = 4;
module.exports.BOLD_MEDIUMTOP_MEDIUMBOTTOM_LEFT = 5;
module.exports.BOLD_MEDIUMTOP_MEDIUMBOTTOM_CENTER = 6;
module.exports.NORMAL_THINTOP_THINBOTTOM_LEFT = 7;
module.exports.NORMAL_THINTOP_THINBOTTOM_CENTER = 8;
module.exports.NORMAL_THINTOP_MEDIUMBOTTOM_CENTER = 9;
module.exports.NORMAL_THINBOTTOM = 10;
module.exports.NORMAL_THINTOP = 11;
module.exports.NORMAL_RIGHT = 12;
