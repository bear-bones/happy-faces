var meal_names = ['breakfast', 'morning snack', 'lunch', 'afternoon snack',
                  'dinner', 'evening snack'],
    Meal_names = ['Breakfast', 'Morning snack', 'Lunch', 'Afternoon snack',
                  'Dinner', 'Evening snack'],
    Meal_Names = ['Breakfast', 'Morning Snack', 'Lunch', 'Afternoon Snack',
                  'Dinner', 'Evening Snack'];



function hhmm_to_minutes(hhmm) {
    hhmm = hhmm.split(':');
    return 60*hhmm[0] + hhmm[1];
}

function minutes_to_hhmm(minutes) {
    var h = Math.trunc(minutes / 60), m = minutes % 60;
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
}



function open() {
    var self = this,
        document = window.document;


    meals.view.config_dialog.result = {};
    meals.view.config_dialog.invalid = {};

    
    this.paper_dialog = document.createElement('paper-dialog');
    this.paper_dialog.setAttribute('backdrop', '');
    this.paper_dialog.setAttribute('autoclosedisabled', '');
    this.paper_dialog.setAttribute('class', 'config-dialog');


    var panel, toolbar, tabs, tab, lookup = ['classrooms', 'meals', 'misc'];
    panel = document.createElement('core-header-panel');

    toolbar = document.createElement('core-toolbar');
    tabs = document.createElement('paper-tabs');
    tabs.setAttribute('selected', '0');
    var current_tab = tab = document.createElement('paper-tab');
    tab.setAttribute('name', 'classrooms');
    tab.textContent = 'Classrooms';
    tabs.appendChild(tab);
    tab = document.createElement('paper-tab');
    tab.setAttribute('name', 'meals');
    tab.textContent = 'Meals';
    tabs.appendChild(tab);
    tab = document.createElement('paper-tab');
    tab.setAttribute('name', 'misc');
    tab.textContent = 'Misc';
    tabs.appendChild(tab);
    toolbar.appendChild(tabs);
    panel.appendChild(toolbar);

    var pages = document.createElement('core-pages');
    pages.appendChild(make_classrooms_tab());
    pages.appendChild(make_meals_tab());
    pages.appendChild(make_misc_tab());
    panel.appendChild(pages);

    // on tab change, show the correct tab
    tabs.addEventListener('core-select', function () {
        pages.selected = lookup.indexOf(tabs.selected);
    });

    this.paper_dialog.appendChild(panel);


    var bottom = document.createElement('div');
    bottom.setAttribute('class', 'line last')
 
    var button = document.createElement('paper-icon-button');
    button.setAttribute('class', 'config-button');
    button.setAttribute('icon', 'check');
    button.setAttribute('title', 'Save updates to Meals configuration');
    button.setAttribute('id', 'config-save');
    button.onclick = on_save_click;
    bottom.appendChild(button);

    var button = document.createElement('paper-icon-button');
    button.setAttribute('class', 'config-button');
    button.setAttribute('icon', 'close');
    button.setAttribute('title', 'Cancel updates to Meals configuration');
    button.setAttribute('id', 'config-cancel');
    button.onclick = on_cancel_click;
    bottom.appendChild(button);
    this.paper_dialog.appendChild(bottom);


    this.toast = meals.view.toast.cloneNode(true);
    this.toast.setAttribute('text', 'Cannot save; there are invalid fields.');
    this.paper_dialog.appendChild(this.toast);


    document.body.appendChild(this.paper_dialog);


    // on dialog close, remove the dialog from the document
    this.paper_dialog.addEventListener(
        'core-overlay-close-completed', function () {
            document.body.removeChild(self.paper_dialog);
            delete self.paper_dialog;
        }
    );


    this.paper_dialog.open();
    setImmediate(function () {pages.selected = 0});
}



function make_classrooms_tab() {
    var self = this,
        document = window.document;


    var tab = document.createElement('div');
    tab.setAttribute('id', 'classrooms');
    //tab.setAttribute('active', 'active');
    //tab.setAttribute('class', 'core-selected');


    // prototypes to be cloned
    var decorator = document.createElement('paper-input-decorator'),
        input = document.createElement('input');
    decorator.setAttribute('floatingLabel', 'true');
    input.setAttribute('is', 'core-input');
    input.setAttribute('required', 'required');
    decorator.appendChild(input);

    var div = document.createElement('div');
    div.setAttribute('class', 'line');


    for (var i = 0, mins = new Array(8), maxes = new Array(8); i < 8; ++i) {
        var prefix = 'cat' + (i + 1) + '_';

        var desc = decorator.cloneNode(true);
        desc.setAttribute('label', 'Description');
        desc.setAttribute('class', 'rate-field');
        input = desc.firstChild;
        input.decorator = desc;
        input.setAttribute('type', 'text');
        input.setAttribute('value', meals.config[prefix + 'desc']);
        input.setAttribute('id', prefix + 'desc');
        input.onchange = on_other_change;

        var min_age = decorator.cloneNode(true);
        min_age.setAttribute('label', 'Start age');
        min_age.setAttribute('class', 'rate-field');
        input = min_age.firstChild;
        input.decorator = min_age;
        input.setAttribute('type', 'number');
        input.setAttribute('step', '1');
        input.setAttribute('value', meals.config[prefix + 'min_age']);
        input.setAttribute('id', prefix + 'min_age');
        input.setAttribute('min', 0);
        input.setAttribute('max', 216);
        mins[i] = input, mins[i].index = i;

        var max_age = decorator.cloneNode(true);
        max_age.setAttribute('label', 'End age');
        max_age.setAttribute('class', 'rate-field');
        input = max_age.firstChild;
        input.decorator = max_age;
        input.setAttribute('type', 'number');
        input.setAttribute('step', '1');
        input.setAttribute('value', meals.config[prefix + 'max_age']);
        input.setAttribute('id', prefix + 'max_age');
        input.setAttribute('min', 0);
        input.setAttribute('max', 216);
        maxes[i] = input, maxes[i].index = i;

        var teacher = decorator.cloneNode(true);
        teacher.setAttribute('label', 'Description');
        teacher.setAttribute('class', 'rate-field');
        input = teacher.firstChild;
        input.decorator = teacher;
        input.setAttribute('type', 'text');
        input.setAttribute('value', meals.config[prefix + 'teacher']);
        input.setAttribute('id', prefix + 'teacher');
        input.onchange = on_other_change;

        var line = div.cloneNode(true);
        line.appendChild(desc);
        line.appendChild(min_age);
        line.appendChild(max_age);
        line.appendChild(teacher);
        tab.appendChild(line);
    }


    for (var i = 0; i < 8; ++i) {
        if (i > 0) mins[i].prev = maxes[i - 1];
        mins[i].next = maxes[i]; maxes[i].prev = mins[i];
        if (i < 7) maxes[i].next = mins[i + 1];
        mins[i].onchange = on_classroom_min_change;
        maxes[i].onchange = on_classroom_max_change;
    }


    return tab;
}



function make_meals_tab() {
    var self = this,
        document = window.document;


    var tab = document.createElement('div');
    tab.setAttribute('id', 'meals');


    // prototypes to be cloned
    var decorator = document.createElement('paper-input-decorator'),
        input = document.createElement('input');
    decorator.setAttribute('floatingLabel', 'true');
    input.setAttribute('is', 'core-input');
    input.setAttribute('required', 'required');
    decorator.appendChild(input);

    var div = document.createElement('div');
    div.setAttribute('class', 'line');

    var header = document.createElement('h4');
    header.setAttribute('class', 'rate-header');


    var prefixes = ['br', 'ms', 'lu', 'as', 'di', 'es'],
        mins = new Array(6), maxes = new Array(6);
    prefixes.forEach(function (prefix, i) {
        var label = header.cloneNode(true);
        label.textContent = Meal_Names[i];

        var start_time = decorator.cloneNode(true);
        start_time.setAttribute('label', 'Start');
        start_time.setAttribute('class', 'rate-field');
        input = start_time.firstChild;
        input.decorator = start_time;
        input.setAttribute('type', 'time');
        input.setAttribute('value',
                           minutes_to_hhmm(meals.config[prefix + '_start']));
        input.setAttribute('id', prefix + '_start');
        input.setAttribute('min', 0);
        mins[i] = input, mins[i].index = i;

        var end_time = decorator.cloneNode(true);
        end_time.setAttribute('label', 'End');
        end_time.setAttribute('class', 'rate-field');
        input = end_time.firstChild;
        input.decorator = end_time;
        input.setAttribute('type', 'time');
        input.setAttribute('value',
                           minutes_to_hhmm(meals.config[prefix + '_end']));
        input.setAttribute('id', prefix + '_end');
        input.setAttribute('min', 0);
        maxes[i] = input, maxes[i].index = i;

        var a = decorator.cloneNode(true);
        a.setAttribute('label', 'A Rate');
        a.setAttribute('class', 'rate-field');
        input = a.firstChild;
        input.decorator = a;
        input.setAttribute('type', 'number');
        input.setAttribute('step', 'any');
        input.setAttribute('value', meals.config[prefix + '_a_rate']);
        input.setAttribute('id', prefix + '_a_rate');
        input.setAttribute('min', 0);
        input.onchange = on_other_change;

        var b = decorator.cloneNode(true);
        b.setAttribute('label', 'B Rate');
        b.setAttribute('class', 'rate-field');
        input = b.firstChild;
        input.decorator = b;
        input.setAttribute('type', 'number');
        input.setAttribute('step', 'any');
        input.setAttribute('value', meals.config[prefix + '_b_rate']);
        input.setAttribute('id', prefix + '_b_rate');
        input.setAttribute('min', 0);
        input.onchange = on_other_change;

        var c = decorator.cloneNode(true);
        c.setAttribute('label', 'C Rate');
        c.setAttribute('class', 'rate-field');
        input = c.firstChild;
        input.decorator = c;
        input.setAttribute('type', 'number');
        input.setAttribute('step', 'any');
        input.setAttribute('value', meals.config[prefix + '_c_rate']);
        input.setAttribute('id', prefix + '_c_rate');
        input.setAttribute('min', 0);
        input.onchange = on_other_change;

        var line = div.cloneNode(true);
        line.appendChild(label);
        line.appendChild(start_time);
        line.appendChild(end_time);
        line.appendChild(a);
        line.appendChild(b);
        line.appendChild(c);
        tab.appendChild(line);
    });


    for (var i = 0; i < 6; ++i) {
        if (i > 0) mins[i].prev = maxes[i - 1];
        mins[i].next = maxes[i]; maxes[i].prev = mins[i];
        if (i < 5) maxes[i].next = mins[i + 1];
        mins[i].onchange = on_meals_min_change;
        maxes[i].onchange = on_meals_max_change;
    }


    return tab;
}



function make_misc_tab() {
    var self = this,
        document = window.document;

    var tab = document.createElement('div');
    tab.setAttribute('id', 'misc');

    // prototypes to be cloned
    var decorator = document.createElement('paper-input-decorator'),
        input = document.createElement('input');
    decorator.setAttribute('floatingLabel', 'true');
    input.setAttribute('is', 'core-input');
    input.setAttribute('required', 'required');
    decorator.appendChild(input);

    var div = document.createElement('div');
    div.setAttribute('class', 'line');

    var deflt = decorator.cloneNode(true);
    deflt.setAttribute('label', 'Default classification');
    deflt.setAttribute('class', 'misc-field');
    input = deflt.firstChild;
    input.decorator = deflt;
    input.setAttribute('type', 'text');
    input.setAttribute('value', meals.config.default_class);
    input.setAttribute('id', 'default_class');
    input.onchange = on_other_change;
    tab.appendChild(deflt);

    var lue = decorator.cloneNode(true);
    lue.setAttribute('label', 'Cash in lue');
    lue.setAttribute('class', 'misc-field');
    input = lue.firstChild;
    input.decorator = lue;
    input.setAttribute('type', 'number');
    input.setAttribute('step', 'any');
    input.setAttribute('value', meals.config.cash_in_lue);
    input.setAttribute('id', 'cash_in_lue');
    input.onchange = on_other_change;
    tab.appendChild(lue);

    var dir = decorator.cloneNode(true);
    dir.setAttribute('label', 'Default report directory');
    dir.setAttribute('class', 'misc-field dir-field');
    input = dir.firstChild;
    input.decorator = dir;
    input.setAttribute('type', 'text');
    input.setAttribute('value', meals.config.report_dir);
    input.setAttribute('id', 'report_dir');
    input.onclick = function () {file.click()};
    input.onkeydown = function (event) {
        file.click();
        event.preventDefault();
    };
    tab.appendChild(dir);

    var file = document.createElement('input')
    file.setAttribute('type', 'file');
    file.setAttribute('style', 'visibility: hidden');
    file.setAttribute('nwdirectory', meals.config.report_dir);
    file.setAttribute('nwworkingdir', meals.config.report_dir);
    file.setAttribute('value', meals.config.report_dir);
    file.onchange = function () {
        input.value = file.value;
        on_other_change({target: input});
    };
    tab.appendChild(file);
    
    return tab;
}



function close() {
    this.paper_dialog.close();
}



function on_other_change(event) {
    var target = event.target,
        id = target.getAttribute('id'),
        value = target.value,
        message = '',
        self = meals.view.config_dialog;

    if (value === '') message = 'Field is required.';
    else meals.view.config_dialog.result[id] =
        id.endsWith('_rate') || id.endsWith('_lue') ? +value : value;

    target.setCustomValidity(message);
    target.decorator.error = message;
    target.decorator.isInvalid = !target.validity.valid;

    if (target.validity.valid) {
        if (id in self.invalid) delete self.invalid[id];
    } else {
        self.invalid[id] = true;
    }
}


function on_classroom_min_change(event) {
    var target = event.target,
        id = target.getAttribute('id'),
        value = target.value,
        index = target.index + 1,
        was_valid = target.validity.valid,
        prev = target.prev, next = target.next,
        message = '',
        self = meals.view.config_dialog;

    // same range min and max can be equal; different range cannot
    if (value === '') message = 'Field is required.';
    else if (prev && +prev.value >= +value)
        message = "Start age must be greater than the previous room's end."
    else if (next && +next.value < +value)
        message = 'Start age must be less than or equal to the end.';
    else meals.view.config_dialog.result[id] = +value;

    target.setCustomValidity(message);
    target.decorator.error = message;
    target.decorator.isInvalid = !target.validity.valid;

    if (target.validity.valid) {
        if (id in self.invalid) delete self.invalid[id];
    } else {
        self.invalid[id] = true;
    }

    if (!was_valid && !message) {
        prev && prev.onchange({target:prev});
        next && next.onchange({target:next});
    }
}


function on_classroom_max_change(event) {
    var target = event.target,
        id = target.getAttribute('id'),
        value = target.value,
        index = target.index + 1,
        was_valid = target.validity.valid,
        prev = target.prev, next = target.next,
        message = '',
        self = meals.view.config_dialog;

    // same range min and max can be equal; different range cannot
    if (value === '') message = 'Field is required.';
    else if (prev && +prev.value > +value)
        message = 'End age must be greater or equal to the start.';
    else if (next && +next.value <= +value)
        message = "End age must be less than the next room's start.";
    else meals.view.config_dialog.result[id] = +value;

    target.setCustomValidity(message);
    target.decorator.error = message;
    target.decorator.isInvalid = !target.validity.valid;

    if (target.validity.valid) {
        if (id in self.invalid) delete self.invalid[id];
    } else {
        self.invalid[id] = true;
    }

    if (!was_valid && !message) {
        prev && prev.onchange({target:prev});
        next && next.onchange({target:next});
    }
}


function on_meals_min_change(event) {
    var target = event.target,
        id = target.getAttribute('id'),
        value = target.value,
        index = target.index,
        was_valid = target.validity.valid,
        prev = target.prev, next = target.next,
        message = '',
        self = meals.view.config_dialog;

    // same range min and max can be equal; different range cannot
    if (value === '') message = 'Field is required.';
    else if (prev && hhmm_to_minutes(prev.value) >= hhmm_to_minutes(value))
        message = Meal_names[index] + ' start time must be greater than the ' + meal_names[index-1] + ' end.'
    else if (next && hhmm_to_minutes(next.value) < hhmm_to_minutes(value))
        message = Meal_names[index] + ' start time must be less than or equal to the end.';
    else meals.view.config_dialog.result[id] = hhmm_to_minutes(value);

    target.setCustomValidity(message);
    target.decorator.error = message;
    target.decorator.isInvalid = !target.validity.valid;

    if (target.validity.valid) {
        if (id in self.invalid) delete self.invalid[id];
    } else {
        self.invalid[id] = true;
    }

    if (!was_valid && !message) {
        prev && prev.onchange({target:prev});
        next && next.onchange({target:next});
    }
}


function on_meals_max_change(event) {
    var target = event.target,
        id = target.getAttribute('id'),
        value = target.value,
        index = target.index + 1,
        was_valid = target.validity.valid,
        prev = target.prev, next = target.next,
        message = '',
        self = meals.view.config_dialog;

    // same range min and max can be equal; different range cannot
    if (value === '') message = 'Field is required.';
    else if (prev && hhmm_to_minutes(prev.value) > hhmm_to_minutes(value))
        message = Meal_names[index] + ' end time must be greater or equal to the start.';
    else if (next && hhmm_to_minutes(next.value) <= hhmm_to_minutes(value))
        message = Meal_names[index] + ' end time must be less than the ' + meal_names[index+1] + ' start.';
    else meals.view.config_dialog.result[id] = hhmm_to_minutes(value);

    target.setCustomValidity(message);
    target.decorator.error = message;
    target.decorator.isInvalid = !target.validity.valid;

    if (target.validity.valid) {
        if (id in self.invalid) delete self.invalid[id];
    } else {
        self.invalid[id] = true;
    }

    if (!was_valid && !message) {
        prev && prev.onchange({target:prev});
        next && next.onchange({target:next});
    }
}



function on_save_click() {
    var view = meals.view,
        self = view.config_dialog;

    if (!view.enabled) return;

    if (Object.keys(self.invalid).length > 0) return self.toast.show();
    else self.toast.dismiss();

    meals.view.emit('click', 'config:save', self.result);
}


function on_cancel_click() {
    if (!meals.view.enabled) return;
    meals.view.config_dialog.toast.dismiss();
    meals.view.emit('click', 'config:cancel');
}



module.exports.open = open;
module.exports.close = close;
