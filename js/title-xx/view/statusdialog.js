var document = window.document;



function update_line(item, line) {
   var create = !(line instanceof window.HTMLElement);


   if (create) {
      line = document.createElement('div');
      line._processing = line.appendChild(document.createElement('div'));
      line._complete = line.appendChild(document.createElement('div'));
      line._progress =
         line.appendChild(document.createElement('paper-progress'));
      line._item = item;
   } else {
      Object.keys(item).forEach(function (key) {line._item[key] = item[key]});
      item = line._item;
   }


   line.setAttribute('class', (item.active ? '' : 'in') + 'active status-line');

   line._processing.setAttribute('class', 'processing-message');
   line._processing.textContent = item.processing_message;

   line._complete.setAttribute('class', 'complete-message');
   line._complete.textContent = item.complete ? item.complete_message : '';

   if (item.complete) line._progress.setAttribute('class', 'complete');
   else line._progress.removeAttribute('class');
   line._progress.setAttribute('value', item.progress_value);
   if (!item.complete && item.active && item.indeterminate)
      line._progress.setAttribute('indeterminate', 'true');
   else
      line._progress.removeAttribute('indeterminate');


   if (create) this.paper_dialog.appendChild(line);


   return line;
}



function open(items) {
   var self = this;

   
   this.line = -1;

   this.paper_dialog = document.createElement('paper-dialog');
   this.paper_dialog.setAttribute('backdrop', '');
   this.paper_dialog.setAttribute('autoclosedisabled', '');
   this.paper_dialog.setAttribute('class', 'status-dialog');

   this.lines = items.map(update_line, this);

   document.body.appendChild(this.paper_dialog);


   // on dialog close, remove the dialog from the document
   this.paper_dialog.addEventListener(
      'core-overlay-close-completed', function () {
          document.body.removeChild(self.paper_dialog);
          delete self.paper_dialog;
      });


   // if polymer is ready now, open dialog now
   if (window.polymer_ready) this.paper_dialog.open();

   // if polymer isn't ready now, open dialog when it is
   else window.addEventListener(
      'polymer-ready', function () {self.paper_dialog.open()});
}



function next(complete_message) {
   if (this.line >= this.lines.length) return this.close();

   // if there is a current line, complete and deactivate it
   if (this.line >= 0) {
      var fields = {active : false, complete : true, progress_value : 100};
      if (complete_message) fields.complete_message = complete_message;
      update_line(fields, this.lines[this.line]);
   }

   // next line (if there is one)
   ++this.line;
   if (this.line >= this.lines.length) return this.close();

   // set the current line active and 0% complete
   update_line(
      {active : true, complete : false, progress_value : 0},
      this.lines[this.line]);
}



function tick(value) {
   if (this.line >= 0 & this.line < this.lines.length)
       update_line({progress_value : value}, this.lines[this.line]);
}



function close() {
   this.paper_dialog.close();
}



module.exports = {
   open: open,
   next: next,
   tick: tick,
   close: close};
