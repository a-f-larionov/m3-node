/**
 * @type {{DBUINT: Valid.DBUINT}}
 */
let Valid = {

    DBUINT: function (value, mayZero) {
        value = parseInt(value);
        return !Number.isNaN(value)
            && (value > 0 || (mayZero && value >= 0))
            && value < DB.INTEGER_MAX_NUMBER
            && value;
    },

    DBUINTArray: function (arr) {
        if (typeof arr !== 'object') return false;
        if (!arr.length) return false;
        if (!arr instanceof Array) return false;
        if (arr.length === 0) return false;
        if (arr.length > 1000) return false;
        let out;
        out = true;
        arr.forEach(function (val) {
            out &= !!Valid.DBUINT(val);
        });
        if (!out) return false;

        arr.map(n => +n);
        return arr;
    }
};


/** Для кросс-сайдных компонент */
if (CONST_IS_SERVER_SIDE) {
    global['Valid'] = Valid;
}