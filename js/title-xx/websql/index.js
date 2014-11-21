var children = require('./children.js'),
    config = require('./config.js'),
    punches = require('./punches.js');



children.init();
config.init();
punches.init();



module.exports.children = children;
module.exports.config = config;
module.exports.punches = punches;
