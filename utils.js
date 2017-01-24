Math.clamp = function(a, min, max) {
    return a < min ? min : (a > max ? max : a);
};

Array.prototype.indexContains = function(word) {
    for (var idx = 0; idx < this.length; idx++) {
        var test = this[idx];
        if (test.indexOf(word) >= 0 || word.indexOf(test) >= 0) {
            return idx;
        }
    }
    return -1;
};

String.prototype.capitalize = function() {
    if (this) {
        return this.substr(0, 1).toUpperCase() + this.substr(1);
    } else {
        return '';
    }
};
