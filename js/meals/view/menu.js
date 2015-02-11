function item(menu, label, parameter) {
    var options = {label : label}, type = typeof parameter;
    if (type === 'object') {
        options.submenu = parameter;
    } else {
        if (parameter === 'separator') options.type = parameter;
        else options.click
            = function () {meals.view.emit('click', 'excel', parameter)};
    }
    menu.append(new gui.MenuItem(options));
}



function init() {
    var menu, _menu, __menu;
    menu = new gui.Menu({type : 'menubar'});
    item(menu, 'Misc', (function (menu) {
        item(menu, 'Birthday', 'misc>birthday');
        item(menu, 'No Clock Out', 'misc>no-clock-out');
        return menu;
    })(new gui.Menu()));

    item(menu, 'Meals', (function (menu) {
        item(menu, 'Monthly Summary', 'meals>summary');
        item(menu, 'Monthly State', 'meals>state');
        item(menu, '', 'separator');
        item(menu, 'Blank', (function (menu) {
            //item(menu, 'Roll Call by Classroom', 'meals>blank>roll');
            item(menu, 'Saturday by Week', 'meals>blank>saturday');
            item(menu, 'Breakfast by Week', 'meals>blank>breakfast');
            item(menu, 'Morning Snack by Week', 'meals>blank>morning');
            item(menu, 'Lunch by Week', 'meals>blank>lunch');
            item(menu, 'Afternoon Snack by Week', 'meals>blank>afternoon');
            item(menu, 'Supper by Week', 'meals>blank>supper');
            item(menu, 'Evening Snack by Week', 'meals>blank>evening');
            return menu;
        })(new gui.Menu()));
        item(menu, 'Complete', (function (menu) {
            //item(menu, 'Roll Call by Classroom', 'meals>complete>roll');
            item(menu, 'Saturday by Week', 'meals>complete>saturday');
            item(menu, 'Breakfast by Week', 'meals>complete>breakfast');
            item(menu, 'Morning Snack by Week', 'meals>complete>morning');
            item(menu, 'Lunch by Week', 'meals>complete>lunch');
            item(menu, 'Afternoon Snack by Week', 'meals>complete>afternoon');
            item(menu, 'Supper by Week', 'meals>complete>supper');
            item(menu, 'Evening Snack by Week', 'meals>complete>evening');
            return menu;
        })(new gui.Menu()));
        return menu;
    })(new gui.Menu()));

    item(menu, 'Roll Call', (function (menu) {
        item(menu, 'Blank', 'roll>blank>month');
        item(menu, 'Complete', 'roll>complete>month');
        //item(menu, 'Blank', (function (menu) {
        //    item(menu, 'Day', 'roll>blank>day');
        //    item(menu, 'Week', 'roll>blank>week');
        //    item(menu, 'Month', 'roll>blank>month');
        //    return menu;
        //})(new gui.Menu()));
        //item(menu, 'Complete', (function (menu) {
        //    item(menu, 'Day', 'roll>complete>day');
        //    item(menu, 'Week', 'roll>complete>week');
        //    item(menu, 'Month', 'roll>complete>month');
        //    return menu;
        //})(new gui.Menu()));
        //item(menu, 'Supper', (function (menu) {
        //    item(menu, 'Day', 'roll>supper>day');
        //    item(menu, 'Week', 'roll>supper>week');
        //    item(menu, 'Month', 'roll>supper>month');
        //    return menu;
        //})(new gui.Menu()));
        return menu;
    })(new gui.Menu()));

    gui.Window.get().menu = menu;
}



module.exports.init = init;
