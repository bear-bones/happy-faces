var XLSX = require('xlsx'),

    cell = common.excel.functions.cell,
    cc = common.excel.functions.cc,
    sc = common.excel.functions.sc,
    getHHMM = common.excel.functions.getHHMM,
    round = common.excel.functions.round,
    dollars = common.excel.functions.dollars,

    worksheet = common.excel.worksheet,

    months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
    ];



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
        log.debug(error.stack);
        throw new Error('Error generating spreadsheet');
    }
    log.debug('Spreadsheet generated.');
}



function worksheet_one(children, report_date) {
    var ws = new common.excel.worksheet(19);

    ws['!page'] = {
        margins : {left : 0.4, right : 0.4, top : 0.3, bottom : 0.3},
        landscape : true
    };
    ws['!cols'] = [
        {wch:14.5}, {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5},
        {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5},
        {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:6}, {wch:6}
    ];

    var child = children[0];
    for (var i = 1, j = 0; i < 100 && child; ++i) {
        build_header(ws, report_date, 1, 15);
        for (var k = 1; k < 5; ++k) {
            if (k > 1) build_spacer(ws, report_date, 1, 15);
            if (child && child.claim_num === i && child.line_num === k) {
                build_child(ws, report_date, 1, 15, child);
                child = ++j < children.length ? children[j] : null;
            } else {
                build_child(ws, report_date, 1, 15);
            }
        }
        build_footer(ws, report_date, 1, 15);
    }

    return ws.export();
}



function worksheet_two(children, report_date) {
    var ws = new common.excel.worksheet(20),
        last_day = (new Date(
            report_date.getFullYear(), report_date.getMonth() + 1, 0
        )).getDate();

    ws['!page'] = {
        margins : {left : 0.4, right : 0.4, top : 0.3, bottom : 0.3},
        landscape : true
    };
    ws['!cols'] = [
        {wch:14}, {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5},
        {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5},
        {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5},
        {wch:6}, {wch:6}
    ];

    var child = children[0];
    for (var i = 1, j = 0; i < 100 && child; ++i) {
        build_header(ws, report_date, 16, last_day);
        for (var k = 1; k < 5; ++k) {
            if (k > 1) build_spacer(ws, report_date, 16, last_day);
            if (child && child.claim_num === i && child.line_num === k) {
                build_child(ws, report_date, 16, last_day, child);
                child = ++j < children.length ? children[j] : null;
            } else {
                build_child(ws, report_date, 16, last_day);
            }
        }
        build_footer(ws, report_date, 16, last_day);
    }

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

        result.days = child.logical_days;
        result.daily_rate = config['rate' + rate_index + '_daily_rate'];
        result.daily_amount = result.days * result.daily_rate;
        data.total_days += result.days;
        data.total_dollars += result.daily_amount;
        data.rates[rate_index - 1].days += result.days;

        result.hours = child.logical_hours;
        result.hourly_rate = config['rate' + rate_index + '_hourly_rate'];
        result.hourly_amount = result.hours * result.hourly_rate;
        data.total_hours += result.hours;
        data.total_dollars += result.hourly_amount;
        data.rates[rate_index - 1].hours += result.hours;

        if (result.days + result.hours > 0.0) {
            ++data.total_children;
            ++data.rates[rate_index-1].children;
            data.rates[rate_index - 1].dollars
                += result.daily_amount + result.hourly_amount;
        }

        return result;
    });
        
    return data;
}



function worksheet_three(children) {
    var ws = new common.excel.worksheet(13), prev_claim = -1;

    ws['!page'] = {
        margins : {left : 0.4, right : 0.4, top : 0.3, bottom : 0.3},
        landscape : true
    };
    ws['!cols'] = [
        {wch:4}, {wch:28}, {wch:8}, {wch:8}, {wch:4}, {wch:10}, {wch:10},
        {wch:4}, {wch:6}, {wch:4}, {wch:8}, {wch:6}, {wch:12}
    ];

    children.forEach(function (child) {
        // do header stuff for new claims
        if (child.claim_num !== prev_claim) {
            // if it's not the first claim, pad out the previous claim to 1 page
            if (prev_claim !== -1) {
                fmt_fill(ws, ws.rows, 0, 12, XF_T_L);
                ws.rows += 4;
            }
            prev_claim = child.claim_num;

            ws['!merges'] = ws['!merges'].concat([
                {s : {c : 0, r : ws.rows}, e : {c : 1, r : ws.rows}}
            ]);

            cell(ws, 0, ws.rows, 'Claim Number: ' + child.claim_num, XF_B10_TB_L);
            fmt_fill(ws, ws.rows, 1, 12, XF_TB_L);
            ++ws.rows;
            cell(ws, 0, ws.rows, 'Line', XF_B10_TB_L);
            cell(ws, 1, ws.rows, 'Child Name', XF_B10_TB_L);
            cell(ws, 2, ws.rows, 'Client #', XF_B10_TB_L);
            cell(ws, 3, ws.rows, 'Auth #', XF_B10_TB_L);
            cell(ws, 4, ws.rows, 'Svc', XF_B10_TB_L);
            cell(ws, 5, ws.rows, 'From Date', XF_B10_TB_L);
            cell(ws, 6, ws.rows, 'To Date', XF_B10_TB_L);
            cell(ws, 7, ws.rows, 'Freq', XF_B10_TB_L);
            cell(ws, 8, ws.rows, 'Units', XF_B10_TB_L);
            cell(ws, 9, ws.rows, 'Rate', XF_B10_TB_L);
            cell(ws, 10, ws.rows, 'Charge', XF_B10_TB_L);
            cell(ws, 11, ws.rows, 'Fee', XF_B10_TB_L);
            cell(ws, 12, ws.rows, 'HHS Charge', XF_B10_TB_L);
            ++ws.rows;
        }

        var comb = (1 * !!child.days) + (2 * !!child.hours),
            clf = XF_L, crf = XF_R, dlf = XF_L, drf = XF_R;
        if (comb === 1) {
            clf = dlf = XF_b_L;
            crf = drf = XF_b_R;
        } else if (comb === 2) {
            clf = XF_b_L;
            crf = XF_b_R;
        }
        cell(ws, 0, ws.rows, child.line_num, clf);
        cell(ws, 1, ws.rows, child.name, clf);
        cell(ws, 2, ws.rows, 0, clf);
        cell(ws, 3, ws.rows, 0, clf);
        cell(ws, 4, ws.rows, '', clf);
        if (child.from_date)
            cell(ws, 5, ws.rows, child.from_date.toLocaleDateString(), clf);
        if (child.to_date)
            cell(ws, 6, ws.rows, child.to_date.toLocaleDateString(), clf);
        if (comb === 3) fmt_fill(ws, ws.rows + 1, 0, 6, XF_b_L);
        if (comb & 1) {
            cell(ws, 7, ws.rows, 'DY', dlf);
            cell(ws, 8, ws.rows, child.days, drf);
            cell(ws, 9, ws.rows, child.daily_rate, drf);
            cell(ws, 10, ws.rows, dollars(child.daily_amount), drf);
            cell(ws, 11, ws.rows, child.fee, drf);
            cell(ws, 12, ws.rows, dollars(child.daily_amount + child.fee), drf);
            ++ws.rows;
        }
        if (comb & 2) {
            cell(ws, 7, ws.rows, 'HR', XF_b_L);
            cell(ws, 8, ws.rows, child.hours, XF_b_R);
            cell(ws, 9, ws.rows, child.hourly_rate, XF_b_R);
            cell(ws, 10, ws.rows, dollars(child.hourly_amount), XF_b_R);
            cell(ws, 11, ws.rows, child.fee, XF_b_R);
            cell(ws, 12, ws.rows, dollars(child.hourly_amount + child.fee), XF_b_R);
            ++ws.rows;
        }
        if (!comb) {
            fmt_fill(ws, ws.rows, 7, 12, XF_b_L);
            ++ws.rows;
        }
    });

    return ws.export();
}

function worksheet_four(data) {
    var ws = new common.excel.worksheet(2);

    ws['!page'] = {
        margins : {left : 0.4, right : 0.4, top : 0.3, bottom : 0.3},
        landscape : true
    };
    ws['!cols'] = [{wch:16}, {wch:16}];

    cell(ws, 0, ws.rows, 'Total Dollars', XF_T_L);
    cell(ws, 1, ws.rows, dollars(data.total_dollars), XF_T_R);
    ++ws.rows;
    cell(ws, 0, ws.rows, 'Total Hours');
    cell(ws, 1, ws.rows, round(data.total_hours), XF_R);
    ++ws.rows;
    cell(ws, 0, ws.rows, 'Total Days');
    cell(ws, 1, ws.rows, round(data.total_days), XF_R);
    ++ws.rows;
    cell(ws, 0, ws.rows, 'Total Children', XF_B_L);
    cell(ws, 1, ws.rows, round(data.total_children), XF_B_R);
    ++ws.rows;

    for (var i = 0; i < 4; ++i) {
        cell(ws, 0, ws.rows, 'Rate ' + (i + 1) + ' Dollars');
        cell(ws, 1, ws.rows, dollars(data.rates[i].dollars), XF_R);
        ++ws.rows;
        cell(ws, 0, ws.rows, 'Rate ' + (i + 1) + ' Hours');
        cell(ws, 1, ws.rows, round(data.rates[i].hours), XF_R);
        ++ws.rows;
        cell(ws, 0, ws.rows, 'Rate ' + (i + 1) + ' Days');
        cell(ws, 1, ws.rows, round(data.rates[i].days), XF_R);
        ++ws.rows;
        cell(ws, 0, ws.rows, 'Rate ' + (i + 1) + ' Children', XF_b_L);
        cell(ws, 1, ws.rows, round(data.rates[i].children), XF_b_R);
        ++ws.rows;
    }

    fmt_fill(ws, ws.rows, 0, 1, XF_T_L);


    return ws.export();
}



function fmt_fill(ws, row, curcol, endcol, format) {
    for (; curcol <= endcol; ++curcol) cell(ws, curcol, row, '', format);
}
function build_header(ws, report_date, first_day, last_day) {
    var offset = ws.cols - 19,
        range = offset
            ? '16th through the ' + last_day + (last_day === 31 ? 'st' : 'th')
            : '1st through the 15th';

    var rows = ws.rows;
    ws['!merges'] = ws['!merges'].concat([
        {s : {c : 1, r : rows}, e : {c : 8, r : rows}}, 
        {s : {c : 10, r : rows}, e : {c : 17, r : rows}}, 

        {s : {c : 0, r : rows + 3}, e : {c : 6, r : rows + 3}}, 
        {s : {c : 7, r : rows + 3}, e : {c : 13, r : rows + 3}}, 
        {s : {c : 14, r : rows + 3}, e : {c : 17, r : rows + 3}}, 

        {s : {c : 1, r : rows + 5}, e : {c : 3, r : rows + 5}}, 
        {s : {c : 9, r : rows + 5}, e : {c : 10, r : rows + 5}}, 
        {s : {c : 16, r : rows + 5}, e : {c : 17, r : rows + 5}}
    ]);


    cell(ws, 1, rows, 'CHILD CARE CENTER ATTENDANCE CALENDAR', XF_B10_b_L);
    fmt_fill(ws, rows, 2, 8, XF_B10_b_L);
    cell(ws, 10, rows, 'NEBRASKA HEALTH AND HUMAN SERVICES SYSTEM', XF_B10_b_L);
    fmt_fill(ws, rows, 11, 17, XF_B10_b_L);

    cell(ws, 0, rows + 3, 'Center:  Happy Faces Child Development Center, LLC');
    cell(ws, 7, rows + 3, 'Address:  2402 N Street, Omaha, NE, 68107');
    cell(ws, 14, rows + 3, 'Phone:  (402) 884-2402');

    cell(ws, 0, rows + 5, 'Prepared By:');
    cell(ws, 1, rows + 5, title_xx.config.prepared_by, XF_b_L);
    fmt_fill(ws, rows + 5, 2, 3, XF_b_L);
    cell(ws, 7, rows + 5, 'Date prepared:');
    cell(ws, 9, rows + 5, (new Date()).toLocaleDateString(), XF_b_L);
    fmt_fill(ws, rows + 5, 10, 10, XF_b_L);
    cell(ws, 14, rows + 5, 'Mo/Year:');
    var rep_date = months[report_date.getMonth()] + ' ' + report_date.getDate();
    cell(ws, 16, rows + 5, rep_date, XF_b_L);
    fmt_fill(ws, rows + 5, 17, 17, XF_b_L);

    cell(ws, 0, rows + 7, 'Attendance by days, the ' + range, XF_B10_L);

    cell(ws, 0, rows + 8, "Child's Name", XF_LTB_L);
    cell(ws, 1, rows + 8, '', XF_RTB_L);

    for (var c = 2, day = first_day; day <= last_day; ++c, ++day)
        cell(ws, c, rows + 8, '' + day, XF_B10_rTB_C);
    cell(ws, c++, rows + 8, 'TOTAL', XF_B10_LRTB_C);
    cell(ws, c++, rows + 8, 'TOTAL', XF_B10_LRTB_C);


    ws.rows += 9;
}


function build_spacer(ws, report_date, first_day, last_day) {
    for (var i = 0, length = last_day - first_day + 5; i < length; ++i)
        cell(ws, i, ws.rows, '', XF_B10_GRAY_T_L);
    ++ws.rows;
}


function build_child(ws, report_date, first_day, last_day, child) {
    child = child || {name : ' ,  ', punches : [], line_num : ''};

    var rows = ws.rows,
        name = child.name.split(', ', 2),
        punches = new Array(last_day - first_day + 1),
        total_hours = 0, total_days = 0;
    punches.fill(null);

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
            if (!punches[i]) punches[i] = {punches : [], hours : 0};
            if (punches[i].punches.length < 4) {
                punches[i].punches.push(getHHMM(punch.time_in));
                punches[i].punches.push(getHHMM(punch.time_out));
                punches[i].hours += punch.time_out - punch.time_in;
            }
            // store some child data for use in calculating totals
            if (!child.from_date) child.from_date = date;
            child.to_date = date;
        });
    if (first_day === 1) {
        child.logical_hours = 0;
        child.logical_days = 0;
    }


    ws['!merges'] = ws['!merges'].concat([
        {s : {c : 0, r : rows + 4}, e : {c : 1, r : rows + 4}},
        {s : {c : 0, r : rows + 5}, e : {c : 1, r : rows + 5}}
    ]);

    cell(ws, 0, rows, child.line_num, XF_LT_L);
    cell(ws, 0, rows + 2, name[0], XF_L_L);
    cell(ws, 0, rows + 1, name.pop(), XF_L_L);
    cell(ws, 0, rows + 3, '', XF_L_L);
    cell(ws, 0, rows + 4, 'Total number of hours per day', XF_8_LTb_R);
    cell(ws, 1, rows + 4, '', XF_8_RTb_L);
    cell(ws, 0, rows + 5, 'Transportation trips', XF_8_LtB_R);
    cell(ws, 1, rows + 5, '', XF_8_RtB_L);

    cell(ws, 1, rows, 'IN', XF_RT_R);
    cell(ws, 1, rows + 1, 'OUT', XF_R_R);
    cell(ws, 1, rows + 2, 'IN', XF_R_R);
    cell(ws, 1, rows + 3, 'OUT', XF_R_R);


    punches.forEach(function (punch, i) {
        var hours = 0, days = 0, punches,
            time, int, frac;
        if (punch) {
            punches = [].slice.call(punch.punches);
            cell(ws, i + 2, rows, punches.shift() || '', XF_rTb_C);
            cell(ws, i + 2, rows + 1, punches.shift() || '', XF_rb_C);
            cell(ws, i + 2, rows + 2, punches.shift() || '', XF_rb_C);
            cell(ws, i + 2, rows + 3, punches.shift() || '', XF_rb_C);
            hours = punch.hours / 1000 / 60 / 60;
            int = Math.trunc(hours);
            frac = hours - int;
            // round up to the nearest quarter hour
            frac = frac === 0.0 ? 0.0 : frac <= 0.25 ? 0.25
                : frac <= 0.5 ? 0.5 : frac <= 0.75 ? 0.75 : 1;
            // 6+ hours is a day
            if (int + frac >= 6.0) {
                ++total_days;
                ++child.logical_days;
            } else {
                total_hours += hours;
                child.logical_hours += int + frac;
            }
        } else {
            cell(ws, i + 2, rows, '', XF_rTb_L);
            cell(ws, i + 2, rows + 1, '', XF_rb_L);
            cell(ws, i + 2, rows + 2, '', XF_rb_L);
            cell(ws, i + 2, rows + 3, '', XF_rb_L);
        }
        cell(ws, i + 2, rows + 4, getHHMM(hours * 1000 * 60 * 60), XF_rTb_C);
        cell(ws, i + 2, rows + 5, 0, XF_rB_C);
    });


    cell(ws, punches.length + 2, rows, 'Hours', XF_LrTb_C);
    cell(ws, punches.length + 2, rows + 1, '', XF_L_L);
    cell(ws, punches.length + 2, rows + 2, '', XF_L_L);
    cell(ws, punches.length + 2, rows + 3, '', XF_LB_L);
    cell(ws, punches.length + 2, rows + 4, round(total_hours), XF_LTb_C);
    cell(ws, punches.length + 2, rows + 5, 0, XF_LtB_C);

    cell(ws, punches.length + 3, rows, 'Days', XF_lRTb_C);
    cell(ws, punches.length + 3, rows + 1, '', XF_R_L);
    cell(ws, punches.length + 3, rows + 2, '', XF_R_L);
    cell(ws, punches.length + 3, rows + 3, '', XF_RB_L);
    cell(ws, punches.length + 3, rows + 4, total_days, XF_lRTb_C);
    cell(ws, punches.length + 3, rows + 5, 0, XF_lRtB_C);


    ws.rows += 6;
}


function build_footer(ws, report_date, first_day, last_day) {
    var rows =  ws.rows, columns = last_day - first_day + 4;

    ws['!merges'] = ws['!merges'].concat([
        {s : {c : 0, r : rows + 2}, e : {c : 1, r : rows + 2}},
        {s : {c : 2, r : rows + 2}, e : {c : 8, r : rows + 2}},
        {s : {c : 12, r : rows + 2}, e : {c : 13, r : rows + 2}},
        {s : {c : 0, r : rows + 4}, e : {c : columns, r : rows + 4}},
        {s : {c : 0, r : rows + 5}, e : {c : columns, r : rows + 5}},
        {s : {c : 0, r : rows + 6}, e : {c : columns, r : rows + 6}},
        {s : {c : 13, r : rows + 7}, e : {c : 15, r : rows + 7}}
    ]);

    cell(ws, 0, rows + 2, "Provider's signature:");
    fmt_fill(ws, rows + 2, 2, 8, XF_b_L);
    cell(ws, 11, rows + 2, 'Date:');
    cell(ws, 12, rows + 2, (new Date()).toLocaleDateString(), XF_b_L);
    fmt_fill(ws, rows + 2, 13, 13, XF_b_L);

    cell(ws, 0, rows + 4, 'The exact number of hours (to the quarter-hour) of care provided must be indicated for each day you provide care.');
    cell(ws, 0, rows + 5, 'Submit the original to the local office and retain the copy for your records.');
    cell(ws, 0, rows + 6, 'Report only time that the child is actually in attendance.');

    cell(ws, 12, rows + 7, 'CC-19', XF_B10_C);
    cell(ws, 13, rows + 7, '9/00 (56088) Page ' + ++build_footer.page, XF_R);

    ws.rows += 8;
}
build_footer.page = 0;



module.exports.generate = generate;
