function begin() {
    meals.view.config_dialog.open(meals.config);
}



function save(config) {
    co(function* () {
        // save config. this will throw if it fails and the rest will not run
        yield meals.websql.config.update(config);

        // update local config object
        Object.keys(config).forEach(function (key) {
            if (key in meals.config) meals.config[key] = config[key];
        });

        meals.view.config_dialog.close();
    });
}



function cancel() {
    meals.view.config_dialog.close();
}



module.exports.begin = begin;
module.exports.save = save;
module.exports.cancel = cancel;
