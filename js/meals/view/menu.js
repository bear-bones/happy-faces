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
            item(menu, 'Saturdays by Classroom', 'meals>blank>saturdays');
            item(menu, 'Weekdays by Classroom', 'meals>blank>weekdays');
            item(menu, '', 'separator');
            item(menu, 'Saturday', 'meals>blank>saturday');
            item(menu, 'Breakfast', 'meals>blank>breakfast');
            item(menu, 'Lunch', 'meals>blank>lunch');
            item(menu, 'Afternoon Snack', 'meals>blank>afternoon');
            item(menu, 'Supper', 'meals>blank>supper');
            item(menu, 'Evening Snack', 'meals>blank>evening');
            return menu;
        })(new gui.Menu()));
        item(menu, 'Complete', (function (menu) {
            item(menu, 'Saturdays by Classroom', 'meals>complete>saturdays');
            item(menu, 'Weekdays by Classroom', 'meals>complete>weekdays');
            item(menu, '', 'separator');
            item(menu, 'Saturday', 'meals>complete>saturday');
            item(menu, 'Breakfast', 'meals>complete>breakfast');
            item(menu, 'Lunch', 'meals>complete>lunch');
            item(menu, 'Afternoon Snack', 'meals>complete>afternoon');
            item(menu, 'Supper', 'meals>complete>supper');
            item(menu, 'Evening Snack', 'meals>complete>evening');
            return menu;
        })(new gui.Menu()));
        return menu;
    })(new gui.Menu()));

    item(menu, 'Roll Call', (function (menu) {
        item(menu, 'Hours by Classroom', 'roll>classroom');
        item(menu, '', 'separator');
        item(menu, 'Blank', (function (menu) {
            item(menu, 'Day', 'roll>blank>day');
            item(menu, 'Week', 'roll>blank>week');
            item(menu, 'Month', 'roll>blank>month');
            return menu;
        })(new gui.Menu()));
        item(menu, 'Complete', (function (menu) {
            item(menu, 'Day', 'roll>complete>day');
            item(menu, 'Week', 'roll>complete>week');
            item(menu, 'Month', 'roll>complete>month');
            return menu;
        })(new gui.Menu()));
        return menu;
    })(new gui.Menu()));

    gui.Window.get().menu = menu;
}



module.exports.init = init;
