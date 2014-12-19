function open() {
    var self = this,
        document = window.document;


    title_xx.view.config_dialog.result = {};
    title_xx.view.config_dialog.invalid = {};

    
    this.paper_dialog = document.createElement('paper-dialog');
    this.paper_dialog.setAttribute('backdrop', '');
    this.paper_dialog.setAttribute('autoclosedisabled', '');
    this.paper_dialog.setAttribute('class', 'config-dialog');


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


    var fee_amount = decorator.cloneNode(true);
    fee_amount.setAttribute('label', 'Fee Amount');
    fee_amount.setAttribute('class', 'fee-amount');
    input = fee_amount.firstChild;
    input.decorator = fee_amount;
    input.setAttribute('type', 'number');
    input.setAttribute('step', 'any');
    input.setAttribute('value', title_xx.config.fee_amount);
    input.setAttribute('id', 'fee_amount');
    input.setAttribute('min', 0);
    input.onchange = on_other_change;


    var prepared_by = decorator.cloneNode(true);
    prepared_by.setAttribute('label', 'Prepared By');
    prepared_by.setAttribute('class', 'prepared-by');
    input = prepared_by.firstChild;
    input.decorator = prepared_by;
    input.setAttribute('type', 'text');
    input.setAttribute('value', title_xx.config.prepared_by);
    input.setAttribute('id', 'prepared_by');
    input.setAttribute('maxlength', 100);
    input.onchange = on_other_change;

    var top = div.cloneNode(true);
    top.appendChild(fee_amount);
    top.appendChild(prepared_by);
    this.paper_dialog.appendChild(top);


    for (var i = 0, mins = new Array(4), maxes = new Array(4); i < 4; ++i) {
        var rate = 'rate' + (i + 1);

        var label = header.cloneNode(true);
        label.textContent = 'Rate ' + (i + 1);

        var min_age = decorator.cloneNode(true);
        min_age.setAttribute('label', 'Minimum Age');
        min_age.setAttribute('class', 'rate-field');
        input = min_age.firstChild;
        input.decorator = min_age;
        input.setAttribute('type', 'number');
        input.setAttribute('value', title_xx.config[rate + '_min_age']);
        input.setAttribute('id', rate + '_min_age');
        input.setAttribute('min', 0);
        input.setAttribute('max', 240);
        mins[i] = input, mins[i].index = i;

        var max_age = decorator.cloneNode(true);
        max_age.setAttribute('label', 'Maximum Age');
        max_age.setAttribute('class', 'rate-field');
        input = max_age.firstChild;
        input.decorator = max_age;
        input.setAttribute('type', 'number');
        input.setAttribute('value', title_xx.config[rate + '_max_age']);
        input.setAttribute('id', rate + '_max_age');
        input.setAttribute('min', 0);
        input.setAttribute('max', 240);
        maxes[i] = input, maxes[i].index = i;

        var hourly_rate = decorator.cloneNode(true);
        hourly_rate.setAttribute('label', 'Hourly Rate');
        hourly_rate.setAttribute('class', 'rate-field');
        input = hourly_rate.firstChild;
        input.decorator = hourly_rate;
        input.setAttribute('type', 'number');
        input.setAttribute('step', 'any');
        input.setAttribute('value', title_xx.config[rate + '_hourly_rate']);
        input.setAttribute('id', rate + '_hourly_rate');
        input.setAttribute('min', 0);
        input.onchange = on_other_change;

        var daily_rate = decorator.cloneNode(true);
        daily_rate.setAttribute('label', 'Daily Rate');
        daily_rate.setAttribute('class', 'rate-field');
        input = daily_rate.firstChild;
        input.decorator = daily_rate;
        input.setAttribute('type', 'number');
        input.setAttribute('step', 'any');
        input.setAttribute('value', title_xx.config[rate + '_daily_rate']);
        input.setAttribute('id', rate + '_daily_rate');
        input.setAttribute('min', 0);
        input.onchange = on_other_change;

        var line = div.cloneNode(true);
        line.appendChild(label);
        line.appendChild(min_age);
        line.appendChild(max_age);
        line.appendChild(hourly_rate);
        line.appendChild(daily_rate);
        this.paper_dialog.appendChild(line);
    }

    var bottom = div.cloneNode(true);
    bottom.setAttribute('class', 'line last')
 
    var button = document.createElement('paper-icon-button');
    button.setAttribute('class', 'config-button');
    button.setAttribute('icon', 'check');
    button.setAttribute('title', 'Save updates to Title XX configuration');
    button.setAttribute('id', 'config-save');
    button.onclick = on_save_click;
    bottom.appendChild(button);

    var button = document.createElement('paper-icon-button');
    button.setAttribute('class', 'config-button');
    button.setAttribute('icon', 'close');
    button.setAttribute('title', 'Cancel updates to Title XX configuration');
    button.setAttribute('id', 'config-cancel');
    button.onclick = on_cancel_click;
    bottom.appendChild(button);
    this.paper_dialog.appendChild(bottom);


    this.toast = title_xx.view.toast.cloneNode(true);
    this.paper_dialog.appendChild(this.toast);


    document.body.appendChild(this.paper_dialog);


    for (var i = 0; i < 4; ++i) {
        if (i > 0) mins[i].prev = maxes[i - 1];
        mins[i].next = maxes[i]; maxes[i].prev = mins[i];
        if (i < 3) maxes[i].next = mins[i + 1];
        mins[i].onchange = on_min_change;
        maxes[i].onchange = on_max_change;
    }


    // on dialog close, remove the dialog from the document
    this.paper_dialog.addEventListener(
        'core-overlay-close-completed', function () {
            document.body.removeChild(self.paper_dialog);
            delete self.paper_dialog;
        }
    );


    this.paper_dialog.open();
}



function close() {
    this.paper_dialog.close();
}



function on_other_change(event) {
    var target = event.target,
        id = target.getAttribute('id'),
        value = target.value,
        message = '',
        self = title_xx.view.config_dialog;

    if (value === '') message = 'Field is required.';
    else title_xx.view.config_dialog.result[id] =
        id === 'prepared_by' ? value : +value;

    target.setCustomValidity(message);
    target.decorator.error = message;
    target.decorator.isInvalid = !target.validity.valid;

    if (target.validity.valid) {
        if (id in self.invalid) delete self.invalid[id];
    } else {
        self.invalid[id] = true;
    }
}



function on_min_change(event) {
    var target = event.target,
        id = target.getAttribute('id'),
        value = target.value,
        index = target.index + 1,
        was_valid = target.validity.valid,
        prev = target.prev, next = target.next,
        message = '',
        self = title_xx.view.config_dialog;

    // same range min and max can be equal; different range cannot
    if (prev && +prev.value >= +value)
        message = 'Rate ' + index + ' minimum must be greater than the rate ' + (index - 1) + ' maximum.'
    else if (next && +next.value < +value)
        message = 'Rate ' + index + ' minimum must be less than or equal to the maximum.';
    else if (value === '') message = 'Field is required.';
    else title_xx.view.config_dialog.result[id] = +value;


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



function on_max_change(event) {
    var target = event.target,
        id = target.getAttribute('id'),
        value = target.value,
        index = target.index + 1,
        was_valid = target.validity.valid,
        prev = target.prev, next = target.next,
        message = '',
        self = title_xx.view.config_dialog;

    // same range min and max can be equal; different range cannot
    if (prev && +prev.value > +value)
        message = 'Rate ' + index + ' maximum must be greater or equal to the minimum.';
    else if (next && +next.value <= +value)
        message = 'Rate ' + index + ' maximum must be less than the rate ' + (index + 1) + ' minimum.';
    else if (value === '') message = 'Field is required.';
    else title_xx.view.config_dialog.result[id] = +value;

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
    var view = title_xx.view,
        self = view.config_dialog;

    if (!view.enabled) return;

    console.log(self.invalid);
    if (Object.keys(self.invalid).length > 0) return self.toast.show();
    else self.toast.dismiss();

    title_xx.view.emit('click', 'config:save', self.result);
}



function on_cancel_click() {
    if (!title_xx.view.enabled) return;
    title_xx.view.config_dialog.toast.dismiss();
    title_xx.view.emit('click', 'config:cancel');
}



module.exports.open = open;
module.exports.close = close;
