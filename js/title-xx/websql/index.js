var children = require('./children.js'),
    config = require('./config.js'),
    punches = require('./punches.js');



function init() {
   return Promise.all([children.init(), config.init(), punches.init()]);
}



module.exports.init = init;
module.exports.children = children;
module.exports.config = config;
module.exports.punches = punches;
