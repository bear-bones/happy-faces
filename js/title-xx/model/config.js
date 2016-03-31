function begin() {
   title_xx.view.config_dialog.open(title_xx.config);
}



function save(config) {
   co(function* () {
      // save config. this will throw if it fails and the rest will not run
      yield title_xx.websql.config.update(config);

      // update local config object
      Object.keys(config).forEach(function (key) {
         if (key in title_xx.config) title_xx.config[key] = config[key];
      });

      title_xx.view.config_dialog.close();
   });
}



function cancel() {
   title_xx.view.config_dialog.close();
}



module.exports.begin = begin;
module.exports.save = save;
module.exports.cancel = cancel;
