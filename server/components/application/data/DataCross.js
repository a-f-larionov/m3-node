/**
 * @type {DataCross}
 */
let DataCross = {
    user: {
        maxHealth: 5,
        healthRecoveryTime: 120,
    },
    app: {
        width: 778,
        height: 500
    },
    clientCryptKey: 3705,
    serverCryptKey: 987,

    topUsersLimit: 6
};

/** Для кросс-сайдных компонент */
if (CONST_IS_SERVER_SIDE) {
    global['DataCross'] = DataCross;
}