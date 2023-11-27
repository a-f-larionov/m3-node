let Validator = {

    DBUINT: function (value, mayZero) {
        value = parseInt(value);
        return !Number.isNaN(value)
            && (value > 0 || (mayZero && value >= 0))
            && value < 4294967295
            && value;
    },
};


/** Для кросс-сайдных компонент */
if (CONST_IS_SERVER_SIDE) {
    global['Validator'] = Validator;
}