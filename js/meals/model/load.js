function get_age(dob, now) {
    if (!dob) return null;
    now = now || new Date();
    // difference in years times 12, plus difference in months, minus one if
    // we haven't hit birthday day yet in this month
    return (now.getFullYear() - dob.getFullYear()) * 12
        + (now.getMonth() - dob.getMonth())
        - (now.getDay() < dob.getDay());
}

var classrooms = [
    'Beginners', 'Movers', 'Climbers', 'Curiosity', 'Discovery', 'Creativity',
    'Kinder', 'Enrichment'
];
function make_displayable(child) {
    child.display = {
        classroom : classrooms[child.classroom],
        dob : (new Date(child.dob)).toLocaleDateString()
    };
}

function hundredths(number) {
    return Math.round(number * 100) / 100;
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
    meals.view.status_dialog.open(statuses);
    meals.view.status_dialog.next();

    try {
        if (!skip_mssql) {
            yield* read_ccm();
            yield* write_local();
        }
        yield* process_data(true);
    } catch (error) {
        meals.view.status_dialog.close();
        throw error;
    }
}



function* read_ccm() {
    var children, punches;

    try {
        children = yield meals.mssql.children.read();
    } catch (error) {
        log.error(error);
        log.debug(error.stack);
        throw new meals.model_error('Error reading child information');
    }
    meals.model.data = children.map(function (child) {
        var result = {
            child_id : child.childkey,
            name : child.last + ', ' + child.first + ' ' + (child.middle || ''),
            dob : child.dob, age : get_age(child.dob),
            classification : child.chfield2
        };
        return result;
    });
    meals.view.status_dialog.next('loaded ' + children.length + ' children.');

    try {
        punches = yield meals.mssql.punches.read(meals.config.last_load);
    } catch (error) {
        log.error(error);
        log.debug(error.stack);
        throw new meals.model_error('Error reading punch information');
    }
    meals.model.punches = punches
        .map(function (value, key) {
            if (value.dtTimeIn && value.dtTimeOut &&
                value.dtTimeIn.getTime() > value.dtTimeOut.getTime()) {
                var temp = value.dtTimeOut;
                value.dtTimeOut = value.dtTimeIn;
                value.dtTimeIn = temp;
            }
            return {
                punch_id : value.pkChildTime, child_id : value.fkChild,
                time_in : value.dtTimeIn && value.dtTimeIn.getTime(),
                time_out : value.dtTimeOut && value.dtTimeOut.getTime()
            };
        });
    meals.view.status_dialog.next('loaded ' + punches.length + ' punches.');
}



function* write_local() {
    try {
        yield meals.websql.punches.create_all(meals.model.punches);
    } catch (error) {
        log.error(error);
        log.debug(error.stack);
        throw new meals.model.model_error('Error saving punch information into reporting database');
    }

    try {
        yield meals.websql.config.update({'last_load' : new Date()});
    } catch (error) {
        log.error(error);
        log.debug(error.stack);
    }

    meals.view.status_dialog.next();
}



function prioritize(list, abc) {
    var stack; abc = (abc || 'a').toLowerCase();
    if (list.length < 3) return list;
    stack = [{name : 'breakfast', rate : meals.config['br_' + abc + '_rate']},
             {name : 'morning',   rate : meals.config['ms_' + abc + '_rate']},
             {name : 'lunch',     rate : meals.config['lu_' + abc + '_rate']},
             {name : 'afternoon', rate : meals.config['as_' + abc + '_rate']},
             {name : 'dinner',    rate : meals.config['di_' + abc + '_rate']},
             {name : 'evening',   rate : meals.config['es_' + abc + '_rate']}]
        .sort(function (a, b) {return a.rate - b.rate}) //reverse: it's a stack
        .map(function (meal) {return meal.name});
    return ['', '', ''].map(function (meal) {
        do meal = stack.pop(); while (meal && list.indexOf(meal) < 0);
        return meal;
    });
}



function* process_data(initial) {
    log.debug('processing data');


    var data = meals.model.data,
        report_date = meals.model.report_date,
        date = new Date(report_date.getTime()),
        cfg = meals.config,
        _meals = [
            {start : cfg.br_start, end : cfg.br_end, name : 'breakfast'},
            {start : cfg.ms_start, end : cfg.ms_end, name : 'morning'},
            {start : cfg.lu_start, end : cfg.lu_end, name : 'lunch'},
            {start : cfg.as_start, end : cfg.as_end, name : 'afternoon'},
            {start : cfg.di_start, end : cfg.di_end, name : 'dinner'},
            {start : cfg.es_start, end : cfg.es_end, name : 'evening'}
        ];

    date.setDate(1);
    date = date.getTime();


    try {
        var ticks = 0, step = data.length / 100, days = report_date.getDate();
        for (var i = 0, length = data.length; i < length; ++i) {
            var child = data[i],
                punches = yield meals.websql.punches.read(
                    child.child_id, date, report_date.getTime()
                );

            // store punches in a 2d array, day x punches
            child.punches = new Array(days);
            for (var j = 0; j < days; ++j) child.punches[j] = [];
            for (var j = 0, len = punches.length; j < len; ++j) {
                var day = (new Date(punches[j].time_in)).getDate() - 1;
                child.punches[day] = child.punches[day] || [];
                child.punches[day].push({
                    start : punches[j].time_in, end : punches[j].time_out
                });
            }

            // map 2d punches array to a 2d array of meals
            child.meals = child.punches.map(function (punches) {
                if (!punches || !punches.length) return [];
                punches = punches.map(function (punch) {return {
                    start : Math.round(punch.start / 60000) % 1440,
                    end : Math.round(punch.end / 60000) % 1440
                }});
                // this nifty algorithm takes two lists of ranges (in this case,
                // punch- and meal-times) and yields a list of their overlapping
                // ranges (in this case, those meals for which the child was
                // present)
                var p = 1, m = 1,
                    punch = punches[0], meal = _meals[0],
                    result = {};
                while (punch && meal) {
                    if (punch.end < meal.start) {
                        punch = punches[p++];
                    } else {
                        if (meal.end >= punch.start) result[meal.name] = true;
                        meal = _meals[m++];
                    }
                }
                return prioritize(Object.keys(result), child.classification);
            });

            var months = get_age(new Date(child.dob), report_date);
            child.classroom = 0 + (months >= 9) + (months >= 18)
                + (months >= 27) + (months >= 36) + (months >= 48)
                + (months >= 60) + (months >= 84);
            make_displayable(child);

            if (step*ticks < i) meals.view.status_dialog.tick(++ticks);
        }
    } catch (error) {
        log.error(error);
        log.debug(error.stack);
        throw new meals.model.model_error('Error loading punch information per child');
    }


    meals.model.data = data;


    meals.view.status_dialog.next();
    setImmediate(function () {
        // grid processing freezes the rendering thread. run it at the start of
        // the next event loop, so the user sees the 'child process complete'
        // status.
        meals.view.set_grid(meals.model.data); // synchronous and slow
        meals.view.status_dialog.close();
    });
}



module.exports.read_ccm = read_ccm;
module.exports.write_local = write_local;
module.exports.process_data = process_data;
