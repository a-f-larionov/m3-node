/**
 * Компонет для работы с социальной сетью(платформой): сайтом http://krestiki-noliki.xyz/
 * @constructor
 */

SocNetStandalone = function () {

    this.init = function () {
        //do something here
    };

    this.getAuthParams = function () {
        Logs.log("TODO me, SocNetStandalone.getAuthParams", Logs.LEVEL_WARNING);
        return {
            //some params
        };
    };

    this.getUserProfileUrl = function () {
        Logs.log("TODO Me, SocNetStandalone.getUserProfileUrl", Logs.LEVEL_WARNING);
        return '/notFound/todo/me/please/:)';
    };

    this.openInviteFriendDialog = function () {
        Logs.log("todo me SocNetStandalone.openIvniteFirendDialog", Logs.LEVEL_WARNING);
        alert('Sorry, but functional is not realized!');
    };

    this.getSocNetUserId = function () {
        var socNetUserId;
        socNetUserId = getQueryVariable('socNetUserId');
        if (!socNetUserId) {
            Logs.log("TODO Me. SocNetStandlaone.getSocNetUesrId and ... guset mode :)", Logs.LEVEL_WARNING);
            socNetUserId = 111; // is it guest!!!
        }
        return socNetUserId;
    };

    this.getFriendIds = function (callback) {
        //callback();
    };

    this.getUserInfo = function (callback) {
        //callback();
    };

    /**
     * Detect is now is a that soc net\platform.
     * @returns {boolean}
     */
    this.detectIsItThat = function () {
        if (window.PLATFORM_ID == 'STANDALONE') return true;
        return false;
    };
};

/**
 * Статичный класс.
 * @type {SocNetStandalone}
 */
SocNetStandalone = new SocNetStandalone();