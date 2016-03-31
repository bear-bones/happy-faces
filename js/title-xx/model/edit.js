function begin(child_id) {
   var data = title_xx.model.data, length = data.length,
       error = new title_xx.model.model_error('Child not found');

   this.current_child = null;
   for (var i = 0; i < length; ++i) {
      if (data[i].child_id === +child_id) {
         this.current_child = data[i];
         break;
      }
   }
   if (!this.current_child) {
      log.error(error);
      log.debug(error.stack);
      throw error;
   }

   title_xx.view.edit_dialog.open(this.current_child);
}



function save(child) {
   var self = this;

   if (Object.keys(child).length === 0)
      return title_xx.view.edit_dialog.close();

   co(function* () {
      // save child to database
      // this will throw if it fails and the rest of the method will not run
      child.child_id = self.current_child.child_id;
      yield title_xx.websql.children.update(child);

      // update child in model data
      Object
         .keys(child)
         .filter(function (key) {return key in self.current_child})
         .forEach(function (key) {self.current_child[key] = child[key]});

      // recalculate time units remaining
      child = self.current_child;
      title_xx.model.load.process_child(child);

      title_xx.view.edit_dialog.close();
   });
}



function cancel() {
   this.current_child = null;
   title_xx.view.edit_dialog.close();
}



module.exports.begin = begin;
module.exports.save = save;
module.exports.cancel = cancel;
