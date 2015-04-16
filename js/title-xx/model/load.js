function get_age(dob) {
    if (!dob) return null;
    var now = new Date();
    // difference in years times 12, plus difference in months, minus one if
    // we haven't hit birthday day yet in this month
    return (now.getFullYear() - dob.getFullYear()) * 12
        + (now.getMonth() - dob.getMonth())
        - (now.getDay() < dob.getDay());
}

function hundredths(number) {
    return Math.round(number * 100) / 100;
}

function mmyyyy(date) {
    date = new Date(date);
    return '' + (date.getMonth() + 1) + '/' + (date.getFullYear() % 100);
}

function joined_date(date) {
    return split_date(date.substr(0, 2), date.substr(2, 2), date.substr(4));
}
function split_date(m, d, y) {
    try {
        m = parseInt(m, 10); d = parseInt(d, 10); y = parseInt(y, 10);
        if (y < 100) y += 2000;
        return (new Date(y, m - 1, d)).getTime();
    } catch (_) {
        return null;
    }
}



    // remove whitespace and unneeded financial information
var range_cruft_regexp = /(?:[cu$].*$|\s+)/g,
    range_dash_regexp = /[\/-]+/g,  // condense sequences of / and - to 1 -
    // only digits and dashes allowed, must start and end w/digits
    range_valid_chars_regexp = /(?:^\D+|\D+$|[^\d-])/g,
    // remove whitespace, cents, and unneeded financial information
    time_cruft_regexp = /(?:[cu$].*$|\s+|\.00)/g,
    time_dash_regexp = /[\/.-]+/g,  // condense sequences of /, -, and . to 1 -
    time_days_regexp = /-?d(?:a?y(?:s\.?)?)?/g,  // normalize "days" units
    time_hours_regexp = /-?h(?:(?:ou)?r(?:s\.?)?)?/g,  // normalize "hours" units
    // only digits, dashes, d's, and h's, must start w/digit, end w/[dh]
    time_valid_chars_regexp = /(?:^\D+|[^dh]+$|[^\ddh-]+)/g,
    days_regexp = /^\d+d$/,  // digits followed by d
    hours_regexp = /^\d+h$/;  // digits followed by h
// parsing freetext user data. gag me.
function update_txx_data(mssql_child, websql_child) {
    var date_in = mssql_child.chfield3.toLowerCase()
            .replace(range_cruft_regexp, '')
            .replace(range_dash_regexp, '-')
            .replace(range_valid_chars_regexp, ''),
        dates = [],
        time_in = mssql_child.chfield4.toLowerCase()
            .replace(time_cruft_regexp, '')
            .replace(time_dash_regexp, '-')
            .replace(time_days_regexp, 'd-')
            .replace(time_hours_regexp, 'h-')
            .replace(time_dash_regexp, '-')
            .replace(time_valid_chars_regexp, ''),
        days = [],
        hours = [];
    date_in = date_in.split('-');
    time_in = time_in.split('-');

    for (var i = 0, length = date_in.length; i < length; ++i) {
        var entry = date_in[i], size = entry.length, result = null;
        if (size === 6 || size === 8)
            result = joined_date(entry);
        else if ((size === 1 || size === 2) && length - i >= 3)
            result = split_date(entry, date_in[++i], date_in[++i]);
        if (result) {
            dates.push(result);
        } else {
            log.error('Curious date range: "' + mssql_child.chfield3 + '"');
            log.debug(mssql_child);
            return;
        }
    }
    if (dates.length !== 2 && dates.length !== 4) {
        log.error('Curious date range: "' + mssql_child.chfield3 + '"');
        log.debug(mssql_child);
        return;
    }

    for (var i = 0, length = time_in.length; i < length; ++i) {
        var entry = time_in[i];
        if (days_regexp.test(entry)) days.push(parseInt(entry, 10));
        else if (hours_regexp.test(entry)) hours.push(parseInt(entry, 10));
        else {
            log.error('Curious auth time: "' + mssql_child.chfield4 + '"');
            log.debug(mssql_child);
            return;
        }
    }
    if (days.length > 2 || hours.length > 2) {
        log.error('Curious auth time: "' + mssql_child.chfield4 + '"');
        log.debug(mssql_child);
        return;
    }

    switch (dates.length) {
    case 4:  // alt date range + regular date range
        websql_child.alt_range_start = dates[2];
        websql_child.alt_range_end = dates[3];
        // falls through
    case 2:  // regular date range
        websql_child.auth_range_start = dates[0];
        websql_child.auth_range_end = dates[1];
    }

    websql_child.auth_days = days.shift() || 0;
    websql_child.alt_days = days.shift() || 0;
    websql_child.auth_hours = hours.shift() || 0;
    websql_child.alt_hours = hours.shift() || 0;
}



module.exports = function* load(skip_mssql) {
    var statuses = [];
    if (!skip_mssql) {
        statuses.push({
            processing_message : 'Loading children from CCM database',
            complete_message : 'done!', indeterminate : true
        });
        statuses.push({
            processing_message : 'Loading punches from CCM database',
            complete_message : 'done!', indeterminate : true
        });
        statuses.push({
            processing_message : 'Updating children in reporting database',
            complete_message : 'child information saved.', indeterminate : true
        });
        statuses.push({
            processing_message : 'Saving new punches into database',
            complete_message : 'punch information saved.', indeterminate : true
        });
    }
    statuses.push({
        processing_message : 'Processing punches by child',
        complete_message : 'all punches processed.'
    });
    statuses.push({
        processing_message : 'Building child data table',
        complete_message : 'done!', indeterminate : true
    });
    title_xx.view.status_dialog.open(statuses);
    title_xx.view.status_dialog.next();

    try {
        if (!skip_mssql) {
            yield* read_ccm();
            yield* write_local();
        }
        yield* read_local();
        yield* process_data(true);
    } catch (error) {
        title_xx.view.status_dialog.close();
        throw error;
    }
}



function* read_ccm() {
    var children, punches;

    try {
        children = yield title_xx.mssql.children.read();
    } catch (error) {
        log.error(error);
        log.debug(error.stack);
        throw new title_xx.model_error('Error reading child information');
    }
    title_xx.model.data = children.map(function (child) {
        var result = {
            child_id : child.childkey,
            name : child.last + ', ' + child.first + ' ' + (child.middle || ''),
            age : get_age(child.dob)
        };
        //if (child.chfield3 && child.chfield4) update_txx_data(child, result);
        return result;
    });
    title_xx.view.status_dialog.next('loaded ' + children.length + ' children.');

    try {
        punches = yield title_xx.mssql.punches.read(title_xx.config.last_load);
    } catch (error) {
        log.error(error);
        log.debug(error.stack);
        throw new title_xx.model_error('Error reading punch information');
    }
    title_xx.model.punches = punches
        .filter(function (value) {
            var i = value.dtTimeIn, o = value.dtTimeOut;
            return i && o && i.getTime() <= o.getTime();
        })
        .map(function (value, key) {return {
            punch_id : value.pkChildTime, child_id : value.fkChild,
            time_in : value.dtTimeIn && value.dtTimeIn.getTime(),
            time_out : value.dtTimeOut && value.dtTimeOut.getTime()
        }});
    title_xx.view.status_dialog.next('loaded ' + punches.length + ' punches.');
}



function* write_local() {
    try {
        var exists = yield title_xx.websql.children.exists(title_xx.model.data);
        var new_data = title_xx.model.data
            .filter(function (_, key) {return !exists[key]});
        yield title_xx.websql.children.create_all(new_data);
        yield title_xx.websql.children.update_all(
            title_xx.model.data.filter(function (_, key) {return exists[key]})
        );
        yield title_xx.websql.children.delete_except(title_xx.model.data);
    } catch (error) {
        log.error(error);
        log.debug(error.stack);
        throw new title_xx.model.model_error('Error saving child information into reporting database');
    }
    title_xx.view.status_dialog.next();

    try {
        yield title_xx.websql.punches.create_all(title_xx.model.punches);
    } catch (error) {
        log.error(error);
        log.debug(error.stack);
        throw new title_xx.model.model_error('Error saving punch information into reporting database');
    }
    title_xx.view.status_dialog.next();

    try {
        yield title_xx.websql.config.update({'last_load' : new Date()});
    } catch (error) {
        log.error(error);
        log.debug(error.stack);
    }
}



function* read_local() {
    try {
        title_xx.model.data = yield title_xx.websql.children.read();
    } catch (error) {
        log.error(error);
        log.debug(error.stack);
        throw new title_xx.model.model_error('Error reading child information from reporting database');
    }
}



function process_child(child) {
    var year = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        report_date = title_xx.model.report_date.getTime(),
        from = title_xx.model.report_date.clone();
    from.setDate(1);
    from = from.getTime();
    report_date.setHours(23, 59, 59);

    // process authorized date range
    if (child.auth_range_start && child.auth_range_start <= report_date &&
        child.auth_range_end && child.auth_range_end >= report_date
    ) {
        child.current = {
            type : 'auth',
            auth_range_start : child.auth_range_start,
            auth_range_end : child.auth_range_end,
            auth_hours : child.auth_hours, auth_days : child.auth_days
        };
    } else if (child.alt_range_start && child.alt_range_start <= report_date &&
        child.alt_range_end && child.alt_range_end >= report_date
    ) {
        child.current = {
            type : 'alt',
            auth_range_start : child.alt_range_start,
            auth_range_end : child.alt_range_end,
            auth_hours : child.alt_hours, auth_days : child.alt_days
        };
        if (!child.alt_hours && !child.alt_days) {
            child.current.auth_hours = child.auth_hours;
            child.current.auth_days = child.auth_days;
        }
    }
    if (child.current) from = child.current.auth_range_start;

    child.punches = child.all_punches.filter(function (punch) {
        return punch.time_in >= from && punch.time_out <= report_date;
    });
    child.total_days = 0;
    child.total_hours = 0.0;
    child.rem_hours = child.current ? child.current.auth_hours : 0;
    child.rem_days = child.current ? child.current.auth_days : 0;
    child.days = [];
    child.hours = [];

    // accumulate hours by month/day
    for (var j = 0, len = child.punches.length; j < len; ++j) {
        var punch = child.punches[j],
            hours = (punch.time_out - punch.time_in) / 3600000,
            date_in = new Date(punch.time_in),
            month = date_in.getMonth(), day = '' + date_in.getDate();
        if (!(day in year[month])) year[month][day] = 0.0;
        year[month][day] += hours;
    }

    // count days/hours by child using txx limits and rounding rules:
    //  - round up to the nearest quarter hour
    //  - 6+ hours => day
    year.forEach(function (month) {
        var days = 0, hours = 0.0;
        Object.keys(month).forEach(function (day) {
            var time = month[day],
                int = Math.trunc(time), frac = time - int;
            // round up to the nearest quarter hour
            frac = frac === 0.0 ? 0.0 : frac <= 0.25 ? 0.25
                : frac <= 0.5 ? 0.5 : frac <= 0.75 ? 0.75 : 1;
            if (int + frac >= 6.0) ++days; else hours += int + frac;
        });
        child.total_days += days; child.total_hours += hours;
        child.rem_days -= days; child.rem_hours -= hours;
        child.days.push(days); child.hours.push(hours);
    });

    if (!child.current) child.rem_hours = child.rem_days = undefined;
    make_displayable(child);

}

function* process_data(initial) {
    var data = title_xx.model.data,
        report_date = title_xx.model.report_date.getTime(),
        from = title_xx.model.report_date.clone();
    from.setDate(1);
    from = from.getTime();


    try {
        var ticks = 0, step = data.length / 100;
        for (var i = 0, length = data.length; i < length; ++i) {
            var child = data[i];
            child.all_punches =
                yield title_xx.websql.punches.read(child.child_id);
            process_child(child);
            if (step*ticks < i) title_xx.view.status_dialog.tick(++ticks);
        }
    } catch (error) {
        log.error(error);
        log.debug(error.stack);
        throw new title_xx.model.model_error('Error loading punch information per child');
    }


    title_xx.model.data = data;


    title_xx.view.status_dialog.next();
    setImmediate(function () {
        // grid processing freezes the rendering thread. run it at the start of
        // the next event loop, so the user sees the 'child process complete'
        // status.
        title_xx.view.set_grid(title_xx.model.data); // synchronous and slow
        title_xx.view.status_dialog.close();
    });
}

function make_displayable(child) {
    var current = child.current;
    child.display = {
        auth_period
            : current ? mmyyyy(current.auth_range_start) + '-' +
                        mmyyyy(current.auth_range_end)
            : child.auth_range_start ? mmyyyy(child.auth_range_start) + '-' +
                                       mmyyyy(child.auth_range_end)
            : child.alt_range_start ? mmyyyy(child.alt_range_start) + '-' +
                                      mmyyyy(child.alt_range_end)
            : '',
        period_sign : current ? 'pos' : 'neg',
        auth_hours : current ? hundredths(current.auth_hours) : '',
        total_hours : hundredths(child.total_hours),
        rem_hours : typeof child.rem_hours === 'number' ?
                    hundredths(child.rem_hours) : '',
        hours_sign : !child.rem_hours || child.rem_hours > 0.0 ? 'pos' : 'neg',
        auth_days : current ? hundredths(current.auth_days) : '',
        total_days : hundredths(child.total_days),
        rem_days : typeof child.rem_days === 'number' ?
                   hundredths(child.rem_days) : '',
        days_sign : !child.rem_days || child.rem_days > 0.0 ? 'pos' : 'neg',
    };
    if (child.age < 24) child.display.age = child.age + 'mo';
    else child.display.age = Math.trunc(child.age / 12) + 'yr';
}



module.exports.read_ccm = read_ccm;
module.exports.write_local = write_local;
module.exports.read_local = read_local;
module.exports.process_child = process_child;
module.exports.process_data = process_data;
