/**
 *
 * @type {{app: {width: number, id: number, height: number}, topUsersLimit: number, user: {healthRecoveryTime: number, maxHealth: number}, clientCryptKey: number, serverCryptKey: number}}
 */
let DataCross = {
    user: {
        maxHealth: 5,
        healthRecoveryTime: 60 * 30,
    },
    app: {
        width: 778,
        height: 500,
        id: Config.SocNet.VK.appId
    },
    clientCryptKey: 3705,
    serverCryptKey: 987,

    topUsersLimit: 6
};

/** Для кросс-сайдных компонент */
if (CONST_IS_SERVER_SIDE) {
    global['DataCross'] = DataCross;
}