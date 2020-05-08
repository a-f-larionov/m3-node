/**
 * @type {DataCross}
 */
let DataCross = {
    user: {
        maxHealth: 5,
        healthRecoveryTime: 45,
    },
    app: {
        width: 777,
        height: 500
    }
};

/** Для кросс-сайдных компонент */
if (CONST_IS_SERVER_SIDE) {
    global['DataCross'] = DataCross;
}