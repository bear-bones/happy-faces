function begin(child_id) {
    var data = title_xx.model.data, length = data.length,
        error = new title_xx.model.model_error('Child not found');

    for (var i = 0; i < length && data[i].child_id === child_id; ++i);
    if (i >= length) throw console.error(error), error;

    title_xx.view.edit_dialog.open(this.current_child = data[i]);
}



function save(child) {
    var self = this;
    co(function* () {
        // save child to database
        // this will throw if it fails and the rest of the method will not run
        child.child_id = self.current_child.child_id;
        yield title_xx.websql.children.update(child);

        // update child in model data
        Object.keys(child)
            .filter(function (key) {return key in self.current_child})
            .forEach(function (key) {self.current_child[key] = child[key]});

        // recalculate time units remaining
        child = self.current_child;
        child.remaining = Math.round((child.auth_amount - (
            child.auth_unit === 'days' ? child.total_days : child.total_time
        )) * 100) / 100;

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
