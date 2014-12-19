function get_age(dob) {
    if (!dob) return null;
    var now = new Date(),
        y1 = now.getFullYear(), y2 = dob.getFullYear(),
        m1 = now.getMonth(), m2 = dob.getMonth(),
        d1 = now.getDay(), d2 = dob.getDay();
    return y1 - y2 - (m1 < m2 || (m1 === m2 && d1 < d2));
}



module.exports = function* load() {
    title_xx.view.status_dialog.open([{
        processing_message : 'Loading children from CCM database',
        complete_message : 'done!', indeterminate : true
    }, {
        processing_message : 'Loading punches from CCM database',
        complete_message : 'done!', indeterminate : true
    }, {
        processing_message : 'Updating children in reporting database',
        complete_message : 'child information saved.', indeterminate : true
    }, {
        processing_message : 'Saving new punches into database',
        complete_message : 'punch information saved.', indeterminate : true
    }, {
        processing_message : 'Processing punches by child',
        complete_message : 'all punches processed.'
    }, {
        processing_message : 'Building child data table',
        complete_message : 'done!', indeterminate : true
    }]);
    title_xx.view.status_dialog.next();

    var error;
    try {
        yield* read_ccm();
        yield* write_local();
        yield* process_data(true);
    } catch (_error) {
        error = _error;
        title_xx.view.status_dialog.close();
    }
    if (error) throw error;
}



function* read_ccm() {
    var children, punches;

    try {
        children = yield title_xx.mssql.children.read();
    } catch (error) {
        console.error(error);
        throw new title_xx.model_error('Error reading child information');
    }
    title_xx.model.data = children.map(function (child) {return {
        child_id : child.childkey,
        name : child.last + ', ' + child.first + ' ' + (child.middle || ''),
        age : get_age(child.dob)
    }});
    title_xx.view.status_dialog.next('loaded ' + children.length + ' children.');

    try {
        punches = yield title_xx.mssql.punches.read(title_xx.config.last_load);
    } catch (error) {
        console.error(error);
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
        new_data.forEach(function (data) {
            data.claim_num = 0;
            data.line_num = 0;
            data.fee = 'no';
            data.auth_amount = 0;
            data.auth_unit = 'hours';
        });
        yield title_xx.websql.children.create_all(new_data);
        yield title_xx.websql.children.update_all(
            title_xx.model.data.filter(function (_, key) {return exists[key]})
        );
        yield title_xx.websql.children.delete_except(title_xx.model.data);
        title_xx.model.data = yield title_xx.websql.children.read();
    } catch (error) {
        console.error(error);
        throw new title_xx.model.model_error('Error saving child information into reporting database');
    }
    title_xx.view.status_dialog.next();

    try {
        yield title_xx.websql.punches.create_all(title_xx.model.punches);
    } catch (error) {
        console.error(error);
        throw new title_xx.model.model_error('Error saving punch information into reporting database');
    }
    title_xx.view.status_dialog.next();
}



function* process_data(initial) {
    var data = title_xx.model.data,
        report_date = title_xx.model.report_date.getTime(),
        date = new Date(report_date);


    if (date.getMonth() >= title_xx.config.title_xx_year_start)
        date.setMonth(title_xx.config.title_xx_year_start, 1);
    else
        date.setMonth(12 - title_xx.config.title_xx_year_start, 1);
    date = date.getTime();


    console.log(new Date(date));
    console.log(new Date(report_date));


    try {
        var ticks = 0, step = data.length / 100;
        for (var i = 0, length = data.length; i < length; ++i) {
            var child = data[i],
                days = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

            // testing
            /*
            child.auth_amount = 100;
            child.auth_unit = Math.random() > 0.8 ? 'days' : 'hours';
            child.fee = Math.random() > 0.9 ? 'yes' : 'no';
             */
            // testing

            child.punches = yield title_xx.websql.punches.read(
                child.child_id, date, report_date
            );
            child.time = new Array(12);
            child.time.fill(0);
            child.total_time = 0;
            child.days = new Array(12);
            child.days.fill(0);
            child.total_days = 0;

            for (var j = 0, len = child.punches.length; j < len; ++j) {
                var punch = child.punches[j],
                    time = (punch.time_out - punch.time_in) / 3600000,
                    date_in = new Date(punch.time_in),
                    month = date_in.getMonth(), day = '' + date_in.getDate();
                child.time[month] += time;
                child.total_time += time;
                try {
                    if (!(day in days[month])) {
                        days[month][day] = true;
                        ++child.days[month], ++child.total_days;
                    }
                } catch (error) {
                    throw error;
                }
            }

            child.total_time = Math.round(child.total_time * 100) / 100;
            child.total_days = Math.round(child.total_days * 100) / 100;
            child.actual = child.auth_unit === 'days'
                ? child.total_days : child.total_time;
            child.remaining
                = Math.round((child.auth_amount - child.actual) * 100) / 100;
            child.sign = child.remaining >= 0.0 ? 'pos' : 'neg';

            if (step*ticks < i) title_xx.view.status_dialog.tick(++ticks);
        }
    } catch (error) {
        console.error(error);
        throw new title_xx.model.model_error('Error loading punch information per child');
    }


    title_xx.model.data
        = data.filter(function (child) {return child.punches.length});
    // testing
//    data.forEach(function (child, i) {
//        child.claim_num = Math.ceil(i / 9);
//        child.line_num = i%9 + 1;
//    });


    // grid processing freezes the rendering thread. run it at the start of the
    // next event loop, so the user sees the 'child process complete' status.
    title_xx.view.status_dialog.next();
    setImmediate(function () {
        if (initial) {
            title_xx.view.set_grid(title_xx.model.data); // synchronous and slow
            title_xx.view.status_dialog.close();
        } else {
            setTimeout(function () {title_xx.view.status_dialog.close()}, 3000);
            title_xx.view.sort_grid(); // async, locks render thread, not fast
        }
    });
}



module.exports.read_ccm = read_ccm;
module.exports.write_local = write_local;
module.exports.process_data = process_data;
