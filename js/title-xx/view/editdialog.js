function date_to_yyyymmdd(date) {
   var result = '', mm, dd;
   if (date) {
      date = new Date(date); mm = date.getMonth() + 1; dd = date.getDate();
      result = date.getFullYear() + '-' + (mm < 10 ? '0' : '') + mm + '-' +
               (dd < 10 ? '0' : '') + dd;
   }
   return result;
}

function yyyymmdd_to_time(yyyymmdd) {
   if (!yyyymmdd) return '';
   yyyymmdd = yyyymmdd.split('-');
   return (new Date(yyyymmdd[0], yyyymmdd[1] - 1, yyyymmdd[2])).getTime();
}


function readonly(decorator) {
   var input = decorator.firstChild;
   decorator.onclick = decorator.onkeydown = decorator.onchange =
   input.onclick = input.onkeydown = input.onchange =
       function (e) {e.preventDefault(), e.stopPropagation()};
}



function open(child) {
   var self = this,
       document = window.document;


   title_xx.view.edit_dialog.result = {
      age: child.age,
      all_punches: child.all_punches,
      auth_range_start: child.auth_range_start,
      auth_range_end: child.auth_range_end,
      auth_days: child.auth_days,
      auth_hours: child.auth_hours,
      alt_range_start: child.alt_range_start,
      alt_range_end: child.alt_range_end,
      alt_days: child.alt_days,
      alt_hours: child.alt_hours,
      current_type: child.current && child.current.type
   };
   title_xx.view.edit_dialog.auth_range = [];
   title_xx.view.edit_dialog.alt_range = [];
   title_xx.view.edit_dialog.all_valid = true;


   this.paper_dialog = document.createElement('paper-dialog');
   this.paper_dialog.setAttribute('backdrop', '');
   this.paper_dialog.setAttribute('autoclosedisabled', '');
   this.paper_dialog.setAttribute('class', 'edit-dialog');


   // prototypes to be cloned
   var decorator = document.createElement('paper-input-decorator'),
       input = document.createElement('input');
   decorator.setAttribute('floatingLabel', 'true');
   input.setAttribute('is', 'core-input');
   decorator.appendChild(input);

   var div = document.createElement('div');
   div.setAttribute('class', 'line');

   var header = document.createElement('h4');
   header.setAttribute('class', 'line-header');


   // child name, age, fee
   var label = header.cloneNode(true);
   label.setAttribute('class', 'line-header child');
   label.textContent = child.name.trim() + ', age ' + child.display.age;
   this.paper_dialog.appendChild(label);

   var fee = document.createElement('core-label');
   fee.setAttribute('class', 'fee');
   var text = document.createElement('div');
   text.setAttribute('class', 'label');
   text.textContent = 'Fee Paid';
   fee.appendChild(text);
   var checkbox = document.createElement('paper-checkbox');
   checkbox.setAttribute('id', 'fee');
   checkbox.setAttribute('class', 'checkbox');
   checkbox.addEventListener('change', on_boolean_change);
   if (child.fee === "yes") checkbox.setAttribute('checked', 'checked');
   fee.appendChild(checkbox);
   this.paper_dialog.appendChild(fee);


   // Misc crap
   var claim_num = decorator.cloneNode(true);
   claim_num.setAttribute('label', 'Claim');
   claim_num.setAttribute('class', 'field');
   input = claim_num.firstChild;
   input.decorator = claim_num;
   input.setAttribute('type', 'number');
   input.setAttribute('value', child.claim_num);
   input.setAttribute('id', 'claim_num');
   input.setAttribute('min', 0);
   input.onchange = on_number_change;
   this.paper_dialog.appendChild(claim_num);

   var line_num = decorator.cloneNode(true);
   line_num.setAttribute('label', 'Line');
   line_num.setAttribute('class', 'field');
   input = line_num.firstChild;
   input.decorator = line_num;
   input.setAttribute('type', 'number');
   input.setAttribute('value', child.line_num);
   input.setAttribute('id', 'line_num');
   input.setAttribute('min', 0);
   input.onchange = on_number_change;
   this.paper_dialog.appendChild(line_num);

   var client_id = decorator.cloneNode(true);
   client_id.setAttribute('label', 'Client ID');
   client_id.setAttribute('class', 'field');
   input = client_id.firstChild;
   input.decorator = client_id;
   input.setAttribute('type', 'number');
   input.setAttribute('value', child.client_id);
   input.setAttribute('id', 'client_id');
   input.setAttribute('min', 0);
   input.onchange = on_number_change;
   this.paper_dialog.appendChild(client_id);

   var auth_num = decorator.cloneNode(true);
   auth_num.setAttribute('label', 'Auth ID');
   auth_num.setAttribute('class', 'field');
   input = auth_num.firstChild;
   input.decorator = auth_num;
   input.setAttribute('type', 'number');
   input.setAttribute('value', child.auth_num);
   input.setAttribute('id', 'auth_num');
   input.setAttribute('min', 0);
   input.onchange = on_number_change;
   this.paper_dialog.appendChild(auth_num);


   // TXX Hours
   var label = header.cloneNode(true);
   label.textContent = 'Hours';
   this.paper_dialog.appendChild(label);

   var auth_hours = decorator.cloneNode(true);
   auth_hours.setAttribute('label', 'Authorized');
   auth_hours.setAttribute('class', 'field');
   input = auth_hours.firstChild;
   input.decorator = auth_hours;
   input.setAttribute('type', 'number');
   input.setAttribute('value', child.auth_hours);
   input.setAttribute('id', 'auth_hours');
   input.setAttribute('min', 0);
   input.onchange = on_auth_change;
   this.paper_dialog.appendChild(auth_hours);

   var total_hours = decorator.cloneNode(true);
   total_hours.setAttribute('label', 'Actual');
   total_hours.setAttribute('class', 'field read-only');
   input = total_hours.firstChild;
   input.decorator = total_hours;
   input.setAttribute('value', child.display.total_hours);
   input.setAttribute('id', 'total_hours');
   readonly(total_hours);
   auth_hours.firstChild.used = input;
   this.paper_dialog.appendChild(total_hours);

   var rem_hours = decorator.cloneNode(true);
   rem_hours.setAttribute('label', 'Remaining');
   rem_hours.setAttribute('class',
                          'field read-only ' + child.display.hours_sign);
   input = rem_hours.firstChild;
   input.decorator = rem_hours;
   input.setAttribute('value', child.display.rem_hours);
   input.setAttribute('id', 'rem_hours');
   readonly(rem_hours);
   auth_hours.firstChild.rem = input;
   this.paper_dialog.appendChild(rem_hours);


   // TXX Days
   var label = header.cloneNode(true);
   label.textContent = 'Days';
   this.paper_dialog.appendChild(label);

   var auth_days = decorator.cloneNode(true);
   auth_days.setAttribute('label', 'Authorized');
   auth_days.setAttribute('class', 'field');
   input = auth_days.firstChild;
   input.decorator = auth_days;
   input.setAttribute('type', 'number');
   input.setAttribute('value', child.auth_days);
   input.setAttribute('id', 'auth_days');
   input.setAttribute('min', 0);
   input.onchange = on_auth_change;
   this.paper_dialog.appendChild(auth_days);

   var total_days = decorator.cloneNode(true);
   total_days.setAttribute('label', 'Actual');
   total_days.setAttribute('class', 'field read-only');
   input = total_days.firstChild;
   input.decorator = total_days;
   input.setAttribute('value', child.display.total_days);
   input.setAttribute('id', 'total_days');
   readonly(total_days);
   auth_days.firstChild.used = input;
   this.paper_dialog.appendChild(total_days);

   var rem_days = decorator.cloneNode(true);
   rem_days.setAttribute('label', 'Remaining');
   rem_days.setAttribute('class',
                         'field read-only ' + child.display.days_sign);
   input = rem_days.firstChild;
   input.decorator = rem_days;
   input.setAttribute('value', child.display.rem_days);
   input.setAttribute('id', 'rem_days');
   readonly(rem_days);
   auth_days.firstChild.rem = input;
   this.paper_dialog.appendChild(rem_days);


   // authorized date range
   var label = header.cloneNode(true);
   label.setAttribute('class', 'line-header range');
   label.textContent = 'Authorization Range';
   this.paper_dialog.appendChild(label);

   var start_date = decorator.cloneNode(true);
   start_date.setAttribute('label', 'Start');
   start_date.setAttribute('class', 'field range');
   input = start_date.firstChild;
   input.decorator = start_date;
   input.setAttribute('type', 'date');
   input.setAttribute('value', date_to_yyyymmdd(child.auth_range_start));
   input.setAttribute('id', 'auth_range_start');
   input.onchange = on_range_change;
   title_xx.view.edit_dialog.auth_range.push(input);
   this.paper_dialog.appendChild(start_date);

   var end_date = decorator.cloneNode(true), temp = child.auth_range_end,
       sign = temp && (new Date()).getTime() > temp ? ' neg' : '';
   end_date.setAttribute('label', 'End');
   end_date.setAttribute('class', 'field range' + sign);
   input = end_date.firstChild;
   input.decorator = end_date;
   input.setAttribute('type', 'date');
   input.setAttribute('value', date_to_yyyymmdd(child.auth_range_end));
   input.setAttribute('id', 'auth_range_end');
   input.onchange = on_range_change;
   title_xx.view.edit_dialog.auth_range.push(input);
   this.paper_dialog.appendChild(end_date);


   // previous date range
   var label = header.cloneNode(true);
   label.setAttribute('class', 'line-header range');
   label.textContent = 'Previous Range';
   this.paper_dialog.appendChild(label);

   start_date = decorator.cloneNode(true);
   start_date.setAttribute('label', 'Start');
   start_date.setAttribute('class', 'field range');
   input = start_date.firstChild;
   input.decorator = start_date;
   input.setAttribute('type', 'date');
   input.setAttribute('value', date_to_yyyymmdd(child.alt_range_start));
   input.setAttribute('id', 'alt_range_start');
   input.onchange = on_range_change;
   title_xx.view.edit_dialog.alt_range.push(input);
   this.paper_dialog.appendChild(start_date);

   end_date = decorator.cloneNode(true);
   end_date.setAttribute('label', 'End');
   end_date.setAttribute('class', 'field range');
   input = end_date.firstChild;
   input.decorator = end_date;
   input.setAttribute('type', 'date');
   input.setAttribute('value', date_to_yyyymmdd(child.alt_range_end));
   input.setAttribute('id', 'alt_range_end');
   input.onchange = on_range_change;
   title_xx.view.edit_dialog.alt_range.push(input);
   this.paper_dialog.appendChild(end_date);


   // buttons
   var bottom = document.createElement('div');
   bottom.setAttribute('class', 'line last')

   var button = document.createElement('paper-icon-button');
   button.setAttribute('class', 'edit-button');
   button.setAttribute('icon', 'check');
   button.setAttribute('title', 'Save updates for ' + child.name);
   button.setAttribute('id', 'edit-save');
   button.onclick = on_save_click;
   bottom.appendChild(button);

   var button = document.createElement('paper-icon-button');
   button.setAttribute('class', 'edit-button');
   button.setAttribute('icon', 'close');
   button.setAttribute('title', 'Cancel updates for ' + child.name);
   button.setAttribute('id', 'edit-cancel');
   button.onclick = on_cancel_click;
   bottom.appendChild(button);

   this.paper_dialog.appendChild(bottom);


   // error toaster message
   this.toast = title_xx.view.toast.cloneNode(true);
   this.toast.setAttribute('text', 'Cannot save; there are invalid fields.');
   this.paper_dialog.appendChild(this.toast);


   document.body.appendChild(this.paper_dialog);


   // on dialog close, remove the dialog from the document
   this.paper_dialog.addEventListener(
      'core-overlay-close-completed', function () {
         document.body.removeChild(self.paper_dialog);
         delete self.paper_dialog;
      });


   this.paper_dialog.open();
}



function close() {
   this.paper_dialog.close();
}



function on_boolean_change(event) {
   var target = event.target;
   title_xx.view.edit_dialog.result[target.getAttribute('id')] =
      (target.checked ? 'yes' : 'no');
}


// adjust the remaining hours based on the new auth hours amount
function on_auth_change(event) {
   var target = event.target,
       unit = target.getAttribute('id').substr(5),
       result = title_xx.view.edit_dialog.result,
       value = target.value === '' ? undefined : +target.value;

   // i.e. result.alt_hours
   result[result.current_type + '_' + unit] = value;
   title_xx.model.load.process_child(result);

   target.used.setAttribute('value', result.display['total_' + unit]);
   target.rem.parentNode.setAttribute(
      'class', 'field read-only ' + result.display[unit + '_sign']);
   target.rem.setAttribute('value', result.display['rem_' + unit]);
}


// every time any range member changes, we revalidate them all
function on_range_change(event) {
   var auth_start = title_xx.view.edit_dialog.auth_range[0],
       auth_end = title_xx.view.edit_dialog.auth_range[1],
       alt_start = title_xx.view.edit_dialog.alt_range[0],
       alt_end = title_xx.view.edit_dialog.alt_range[1],
       all_valid = true, invalid, message = '';

   // reset all errors
   auth_start.setCustomValidity(auth_start.decorator.error = '');
   auth_end.setCustomValidity(auth_end.decorator.error = '');
   alt_start.setCustomValidity(alt_start.decorator.error = '');
   alt_end.setCustomValidity(alt_end.decorator.error = '');
   auth_start.decorator.isInvalid = auth_end.decorator.isInvalid =
   alt_start.decorator.isInvalid = alt_end.decorator.isInvalid = false;

   // validation for date ranges
   // 1. (a && b) || (!a && !b)    both dates or none
   if (!auth_start.value && auth_end.value) invalid = auth_start;
   if (auth_start.value && !auth_end.value) invalid = auth_end;
   if (invalid) {
      invalid.setCustomValidity('Both dates are required.');
      invalid.decorator.error = 'Both dates are required.';
      invalid.decorator.isInvalid = true;
      all_valid = false;
   }
   invalid = null;
   if (!alt_start.value && alt_end.value) invalid = alt_start;
   if (alt_start.value && !alt_end.value) invalid = alt_end;
   if (invalid) {
      invalid.setCustomValidity('Both dates are required.');
      invalid.decorator.error = 'Both dates are required.';
      invalid.decorator.isInvalid = true;
      all_valid = false;
   }
   // 2. a <= b    first date chronologically before second
   if (auth_start.value && auth_end.value &&
       auth_start.value > auth_end.value) {
      auth_start.setCustomValidity('Start date cannot come after the end.');
      auth_start.decorator.error = 'Start date cannot come after the end.';
      auth_start.decorator.isInvalid = true;
      all_valid = false;
   }
   if (alt_start.value && alt_end.value && alt_start.value > alt_end.value) {
      alt_start.setCustomValidity('Start date cannot come after the end.');
      alt_start.decorator.error = 'Start date cannot come after the end.';
      alt_start.decorator.isInvalid = true;
      all_valid = false;
   }
   // 3. a1 > b2 || b1 < a2    auth and alt ranges don't overlap
   // only applies if all fields are filled in and otherwise valid
   if (all_valid &&
       auth_start.value && auth_end.value &&
       alt_start.value && alt_end.value &&
       auth_start.value <= alt_end.value && alt_start.value < auth_end.value) {
      auth_start.setCustomValidity('Start date cannot come after the end.');
      auth_start.decorator.error = 'Start date cannot come after the end.';
      auth_start.decorator.isInvalid = true;
      auth_end.decorator.isInvalid = true;
      alt_start.decorator.isInvalid = true;
      alt_end.decorator.isInvalid = true;
      all_valid = false;
   }

   title_xx.view.edit_dialog.all_valid = all_valid;
}


function on_number_change(event) {
   var target = event.target,
       id = target.getAttribute('id'),
       value = target.value,
       message = ''
       self = title_xx.view.edit_dialog;
   self.result[id] = value;
}



function on_save_click() {
   var view = title_xx.view,
       self = view.edit_dialog;

   if (!view.enabled) return;

   if (self.all_valid) {
      self.result.auth_range_start = yyyymmdd_to_time(self.auth_range[0].value);
      self.result.auth_range_end = yyyymmdd_to_time(self.auth_range[1].value);
      self.result.alt_range_start = yyyymmdd_to_time(self.alt_range[0].value);
      self.result.alt_range_end = yyyymmdd_to_time(self.alt_range[1].value);
      self.toast.dismiss();
      view.emit('click', 'edit:save', self.result);
   } else {
      self.toast.show();
   }
}



function on_cancel_click() {
   if (!title_xx.view.enabled) return;
   title_xx.view.edit_dialog.toast.dismiss();
   title_xx.view.emit('click', 'edit:cancel');
}



module.exports.open = open;
module.exports.close = close;
