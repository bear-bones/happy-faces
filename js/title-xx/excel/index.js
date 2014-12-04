var XLSX = require('xlsx'),
    
    months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
    ],
    BOLD_LEFT = 1,
    BOLD_RIGHT = 2,
    BOLD_THINTOP_THINBOTTOM_LEFT = 3,
    BOLD_THINTOP_MEDIUMBOTTON_LEFT = 4,
    BOLD_MEDIUMTOP_MEDIUMBOTTOM_LEFT = 5,
    BOLD_MEDIUMTOP_MEDIUMBOTTOM_CENTER = 6,
    NORMAL_THINTOP_THINBOTTON_LEFT = 7,
    NORMAL_THINTOP_THINBOTTOM_CENTER = 8,
    NORMAL_THINTOP_MEDIUMBOTTOM_CENTER = 9;



function generate(file_name) {
    console.log('Generating excel spreadsheet...');
    try {
        console.log(XLSX.writeFile({
            SheetNames : ['1-15', '16-31', 'Summary', 'Totals', 'Notes'],
            Sheets : {
                '1-15' : worksheet_one(), '16-31' : worksheet_two()/*,
                'Summary' : worksheet_three(), 'Totals' : worksheet_four(),
                'Notes' : worksheet_five()*/
            }
        }, file_name));
    } catch (error) {
        console.log(error);
        throw new Error('Error generating spreadsheet');
    }
    console.log('Spreadsheet generated.');
}



function worksheet_one() {
    var worksheet = new title_xx.excel.Worksheet(19);
    worksheet['!cols'] = [
        {wch:12}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8},
        {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8},
        {wch:4.8}, {wch:6}, {wch:6}
    ];
    calendar_header(worksheet, new Date('Oct 1 2014'), 1);
    return worksheet.export();
}



function worksheet_two() {
    var worksheet = new title_xx.excel.Worksheet(20);
    worksheet['!cols'] = [
        {wch:12}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8},
        {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8}, {wch:4.8},
        {wch:4.8}, {wch:4.8}, {wch:6}, {wch:6}
    ];
    calendar_header(worksheet, new Date('Oct 1 2014'), 16);
    return worksheet.export();
}



function calendar_header(worksheet, report_date, first_day) {
    var offset = worksheet.cols - 19,
        first_day = offset ? 16 : 1,
        last_day = 15,
        range = '1st through the 15th';

    if (offset) {
        last_day = (new Date(
            report_date.getFullYear(), report_date.getMonth() + 1, 0
        )).getDate();
        range
            = '16th through the ' + last_day + (last_day === 31 ? 'st' : 'th');
    }


    var rows = worksheet.rows;
    worksheet['!merges'] = worksheet['!merges'].concat([
        {s : {c : 0, r : rows}, e : {c : 8, r : rows}}, 
        {s : {c : 10 + offset, r : rows}, e : {c : 18 + offset, r : rows}}, 

        {s : {c : 1, r : rows + 2}, e : {c : 8, r : rows + 2}}, 
        {s : {c : 1, r : rows + 3}, e : {c : 8, r : rows + 3}}, 
        {s : {c : 1, r : rows + 4}, e : {c : 8, r : rows + 4}}, 

        {s : {c : 9 + offset, r : rows + 2}, e : {c : 10 + offset, r : rows + 2}}, 
        {s : {c : 11 + offset, r : rows + 2}, e : {c : 18 + offset, r : rows + 2}}, 
        {s : {c : 9 + offset, r : rows + 3}, e : {c : 10 + offset, r : rows + 3}}, 
        {s : {c : 11 + offset, r : rows + 3}, e : {c : 18 + offset, r : rows + 3}}, 
        {s : {c : 9 + offset, r : rows + 4}, e : {c : 10 + offset, r : rows + 4}}, 
        {s : {c : 11 + offset, r : rows + 4}, e : {c : 18 + offset, r : rows + 4}}, 

        {s : {c : 0, r : rows + 6}, e : {c : 18 + offset, r : rows + 6}}
    ]);


    worksheet[cc(0, rows)] = sc('Child Care Center Attendance Calendar', BOLD_LEFT);
    worksheet[cc(10 + offset, rows)] = sc('Nebraska Health and Human Services System', BOLD_RIGHT);

    worksheet[cc(0, rows + 2)] = sc('Prepared By:');
    worksheet[cc(1, rows + 2)] = sc(title_xx.config.prepared_by);
    worksheet[cc(0, rows + 3)] = sc('Prepared:');
    worksheet[cc(1, rows + 3)] = sc((new Date()).toLocaleDateString());
    worksheet[cc(0, rows + 4)] = sc('Report For:');
    worksheet[cc(1, rows + 4)] = sc(months[report_date.getMonth()] + ' ' + report_date.getDate());

    worksheet[cc(9 + offset, rows + 2)] = sc('Center:');
    worksheet[cc(11 + offset, rows + 2)] = sc('Happy Faces Child Development Center, LLC');
    worksheet[cc(9 + offset, rows + 3)] = sc('Address:');
    worksheet[cc(11 + offset, rows + 3)] = sc('2402 N Street, Omaha, NE, 68107');
    worksheet[cc(9 + offset, rows + 4)] = sc('Phone:');
    worksheet[cc(11 + offset, rows + 4)] = sc('(402) 884-2402');

    worksheet[cc(0, rows + 6)] = sc('Attendance by days, the ' + range, BOLD_LEFT);

    worksheet[cc(0, rows + 7)] = sc('Child', BOLD_MEDIUMTOP_MEDIUMBOTTOM_LEFT);
    worksheet[cc(1, rows + 7)] = sc('', BOLD_MEDIUMTOP_MEDIUMBOTTOM_LEFT);

    for (var c = 2, day = first_day; day <= last_day; ++c, ++day)
        worksheet[cc(c, rows + 7)]
            = sc('' + day, BOLD_MEDIUMTOP_MEDIUMBOTTOM_CENTER);
    worksheet[cc(c++, rows + 7)]
        = sc('Hours', BOLD_MEDIUMTOP_MEDIUMBOTTOM_CENTER);
    worksheet[cc(c++, rows + 7)]
        = sc('Days', BOLD_MEDIUMTOP_MEDIUMBOTTOM_CENTER);


    worksheet.rows += 8;
}


function calendar_child(worksheet, child, first_day) {
}


function calendar_footer(worksheet, first_day) {
    ++calendar_footer.page;
}
calendar_footer.page = 0;



// cell coordinates
function cc(col, row) {return XLSX.utils.encode_cell({c : col, r : row})}

// string cell
function sc(string, style) {
    var result = {t : 's', v : string};
    if (style) result.raw_style = style;
    return result;
}



module.exports.generate = generate;
module.exports.Worksheet = require('./worksheet.js');

module.exports.BOLD_LEFT = 1;
module.exports.BOLD_RIGHT = 2;
module.exports.BOLD_THINTOP_THINBOTTOM_LEFT = 3;
module.exports.BOLD_THINTOP_MEDIUMBOTTON_LEFT = 4;
module.exports.BOLD_MEDIUMTOP_MEDIUMBOTTOM_LEFT = 5;
module.exports.BOLD_MEDIUMTOP_MEDIUMBOTTOM_CENTER = 6;
module.exports.NORMAL_THINTOP_THINBOTTON_LEFT = 7;
module.exports.NORMAL_THINTOP_THINBOTTOM_CENTER = 8;
module.exports.NORMAL_THINTOP_MEDIUMBOTTOM_CENTER = 9;
