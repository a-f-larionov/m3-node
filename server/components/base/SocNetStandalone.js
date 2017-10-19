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
        friends = [];
        callback(friends);
    };
    
    /**
     * Получит
     * @param socNetTypeId
     * @param socNetUserId
     * @param callback
     */
    this.getUserInfo = function (socNetUserId, callback) {
        info = {};
        info.firstName = 'firstName';
        info.lastName = 'lastName';
        info.photo50 = '';
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

SocNetStandalone = new SocNetStandalone;