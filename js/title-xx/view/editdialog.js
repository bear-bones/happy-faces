function open(child) {
    var self = this,
        document = window.document;


    title_xx.view.edit_dialog.result = {};
    title_xx.view.edit_dialog.invalid = {};

    
    this.paper_dialog = document.createElement('paper-dialog');
    this.paper_dialog.setAttribute('backdrop', '');
    this.paper_dialog.setAttribute('autoclosedisabled', '');
    this.paper_dialog.setAttribute('class', 'edit-dialog');


    // prototypes to be cloned
    var decorator = document.createElement('paper-input-decorator'),
        input = document.createElement('input');
    decorator.setAttribute('floatingLabel', 'true');
    input.setAttribute('is', 'core-input');
    input.setAttribute('required', 'required');
    decorator.appendChild(input);

    var div = document.createElement('div');
    div.setAttribute('class', 'line');


    var top = div.cloneNode(true);
    top.setAttribute('class', 'line bold');
    top.textContent = child.name + ', age ' + child.age;
    this.paper_dialog.appendChild(top);

    var line = div.cloneNode(true);

    var auth_amount = decorator.cloneNode(true);
    auth_amount.setAttribute('label', 'Authorized Amount');
    auth_amount.setAttribute('class', 'auth-amount');
    input = auth_amount.firstChild;
    input.decorator = auth_amount;
    input.setAttribute('type', 'number');
    input.setAttribute('step', 'any');
    input.setAttribute('value', child.auth_amount);
    input.setAttribute('id', 'auth_amount');
    input.setAttribute('min', 0);
    input.addEventListener('change', on_number_change);
    line.appendChild(auth_amount);

    var label = document.createElement('core-label');
    label.setAttribute('class', 'auth-type');
    var text = document.createElement('div');
    text.setAttribute('class', 'label');
    text.textContent = 'Days';
    label.appendChild(text);
    var toggle = document.createElement('paper-toggle-button');
    toggle.setAttribute('id', 'auth_unit');
    toggle.setAttribute('class', 'toggle');
    if (child.auth_unit === 'days') toggle.setAttribute('checked', 'checked');
    toggle.addEventListener('change', on_boolean_change);
    label.appendChild(toggle);
    text = document.createElement('div');
    text.setAttribute('class', 'label');
    text.textContent = 'Hours';
    label.appendChild(text);
    line.appendChild(label);

    this.paper_dialog.appendChild(line);


    line = div.cloneNode(true);

    var label = document.createElement('core-label');
    label.setAttribute('class', 'fee');
    var text = document.createElement('div');
    text.setAttribute('class', 'label');
    text.textContent = 'Fee';
    label.appendChild(text);
    var checkbox = document.createElement('paper-checkbox');
    checkbox.setAttribute('id', 'fee');
    checkbox.setAttribute('class', 'checkbox');
    checkbox.addEventListener('change', on_boolean_change);
    if (child.fee === "yes") checkbox.setAttribute('checked', 'checked');
    label.appendChild(checkbox);
    line.appendChild(label);

    var claim_num = decorator.cloneNode(true);
    claim_num.setAttribute('label', 'Claim number');
    claim_num.setAttribute('class', 'claim-num');
    input = claim_num.firstChild;
    input.decorator = claim_num;
    input.setAttribute('type', 'number');
    input.setAttribute('value', child.claim_num);
    input.setAttribute('id', 'claim_num');
    input.setAttribute('min', 0);
    input.addEventListener('change', on_number_change);
    line.appendChild(claim_num);

    var line_num = decorator.cloneNode(true);
    line_num.setAttribute('label', 'Order');
    line_num.setAttribute('class', 'line-num');
    input = line_num.firstChild;
    input.decorator = line_num;
    input.setAttribute('type', 'number');
    input.setAttribute('value', child.line_num);
    input.setAttribute('id', 'line_num');
    input.setAttribute('min', 0);
    input.addEventListener('change', on_number_change);
    line.appendChild(line_num);

    this.paper_dialog.appendChild(line);


    var bottom = div.cloneNode(true);
    bottom.setAttribute('class', 'line last')
 
    var button = document.createElement('paper-icon-button');
    button.setAttribute('class', 'edit-button');
    button.setAttribute('icon', 'check');
    button.setAttribute('title', 'Save updates to ' + child.name);
    button.setAttribute('id', 'edit-save');
    button.onclick = on_save_click;
    bottom.appendChild(button);

    var button = document.createElement('paper-icon-button');
    button.setAttribute('class', 'edit-button');
    button.setAttribute('icon', 'close');
    button.setAttribute('title', 'Cancel updates');
    button.setAttribute('id', 'edit-cancel');
    button.onclick = on_cancel_click;
    bottom.appendChild(button);
    this.paper_dialog.appendChild(bottom);


    this.toast = title_xx.view.toast.cloneNode(true);
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
}



function close() {
    this.paper_dialog.close();
}



function on_boolean_change(event) {
    var target = event.target,
        id = target.getAttribute('id'),
        checked = target.checked;

    title_xx.view.edit_dialog.result[id] = id === 'auth_unit'
        ? (checked ? 'days' : 'hours')
        : (checked ? 'yes' : 'no');
}



function on_number_change(event) {
    var target = event.target,
        id = target.getAttribute('id'),
        value = target.value,
        message = ''
        self = title_xx.view.edit_dialog;

    if (value === '') message = 'Field is required.';
    else self.result[id] = value;

    target.setCustomValidity(message);
    target.decorator.error = message;
    target.decorator.isInvalid = !target.validity.valid;

    if (target.validity.valid) {
        if (id in self.invalid) delete self.invalid[id];
    } else {
        self.invalid[id] = true;
    }
}



function on_save_click() {
    var view = title_xx.view,
        self = view.edit_dialog;

    if (!view.enabled) return;

    if (Object.keys(self.invalid).length > 0) return self.toast.show();
    else self.toast.dismiss();

    title_xx.view.emit('click', 'edit:save', self.result);
}



function on_cancel_click() {
    if (!title_xx.view.enabled) return;
    title_xx.view.edit_dialog.toast.dismiss();
    title_xx.view.emit('click', 'edit:cancel');
}



module.exports.open = open;
module.exports.close = close;
