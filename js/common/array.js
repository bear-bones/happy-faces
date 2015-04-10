window.Array.prototype.fill = global.Array.prototype.fill =
    [].fill || function (value) {
        for (var i = 0, length = this.length; i < length; ++i)
            this[i] = value;
    };
