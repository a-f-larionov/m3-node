/**
 * @type {DataCross}
 */
let DataCross = {
    user: {
        maxHealth: 5,
        healthRecoveryTime: 10,
    },
    app: {
        width: 777,
        height: 500
    },
    clientCryptKey: 3705,
    serverCryptKey: 987,
};

/** Для кросс-сайдных компонент */
if (CONST_IS_SERVER_SIDE) {
    global['DataCross'] = DataCross;
}