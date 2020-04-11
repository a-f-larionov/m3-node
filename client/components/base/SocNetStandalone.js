/**
 * Компонет для работы с социальной сетью(платформой): сайтом http://krestiki-noliki.xyz/
 * @constructor
 */

SocNetStandalone = function () {

    this.init = function () {
        //do something here
    };

    this.getAuthParams = function () {
        //@todo
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
        let socNetUserId;
        socNetUserId = getQueryVariable('soc-net-user-id');
        if (!socNetUserId) {
            Logs.log("TODO Me. SocNetStandlaone.getSocNetUesrId and ... guset mode :)", Logs.LEVEL_WARNING);
            socNetUserId = 111; // is it guest!!!
        }
        return socNetUserId;
    };

    this.getFriendIds = function (callback) {
        let friends = [];
        callback(friends);
    };

    this.getUserInfo = function (id, callback) {
        let info = {};
        info.id = id;
        info.first_name = 'firstName';
        info.last_name = 'lastName';
        info.photo_50 = '/images/field-octopus.png';
        info.photo_100 = '/images/field-octopus.png';
        info.sex = SocNet.SEX_UNKNOWN;
        callback([info]);
    };

    this.openOrderDialog = function (votes) {
        let product = DataShop.getGoldProductByPrice(votes);
        let qty = confirm("Купить " + product.quantity + "монет за " + votes + " стенделонов?");
        if (qty) {
            //@todo callback here!
            //https://8ffd246e-5d74-49a5-8696-e92eff606a60.pub.cloud.scaleway.com/service/vk_buy
            //https://local.host/service/standalone_buy
            //do something here
        }
    };

    /**
     * Detect is now is a that soc net\platform.
     * @returns {boolean}
     */
    this.detectIsItThat = function () {
        if (window.PLATFORM_ID === 'STANDALONE') return true;
        return false;
    };
};

/**
 * Статичный класс.
 * @type {SocNetStandalone}
 */
SocNetStandalone = new SocNetStandalone();