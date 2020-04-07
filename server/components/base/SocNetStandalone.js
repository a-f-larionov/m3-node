/**
 * Компонент для работы с социальной сетью(платформой).
 * @constructor
 */
SocNetStandalone = function () {

    this.init = function (afterInitCallback) {
        afterInitCallback();
    };


    /**
     * Получить список друзей из соц сети.
     * @param socNetTypeId {Number} id социальной сети SoNet.TYPE_*
     * @param socNetUserId {Number} id юзера, в социальной сети.
     * @param callback {Function} is it array of friend ids
     */
    this.getFriends = function (socNetUserId, callback) {
        let friends = [];
        callback(friends);
    };

    /**
     * Получит
     * @param socNetTypeId
     * @param socNetUserId
     * @param callback
     */
    this.getUserInfo = function (socNetUserId, callback) {
        let info = {};
        info.id = id;
        info.first_name = 'firstName';
        info.last_name = 'lastName';
        info.photo_50 = '/images/not-found.png';
        info.photo_100 = '/images/not-found.png';
        info.sex = SocNet.SEX_UNKNOWN;
        callback(info);
    };


    /**
     * Проверка авторизации
     * @param socNetUserId id в социальной сети.
     * @param authParams специфичные для соц.сети данные проверки м.
     * @returns {boolean} результат аутентификации.
     */
    this.checkAuth = function (socNetUserId, authParams) {
        return true;
    };

};

/** @type {SocNetStandalone} */
SocNetStandalone = new SocNetStandalone;