/**
 * Компонет для работы с социальной сетью(платформой): сайтом http://krestiki-noliki.xyz/
 * @constructor
 */

SocNetStandalone = function () {

    this.init = function () {
    };

    this.getAuthParams = function () {
        return {};
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
        socNetUserId = parseInt(getQueryVariable('soc-net-user-id'));
        if (!socNetUserId) {
            Logs.log("TODO Me. SocNetStandlaone.getSocNetUesrId and ... guset mode :)", Logs.LEVEL_WARNING);
            socNetUserId = 111; // is it guest!!!
        }
        return socNetUserId;
    };

    let friends = [];
    for (let i = 0; i < 10000; i++) {
        friends.push(i);
    }
    this.getFriendIds = function (callback) {
        callback(friends);
    };

    this.getUserInfo = function (id, callback) {
        let randomName = [
            'Носков Людвиг Романович /images/field-octopus.png',
            'Кириллов Юрий Валериевич /images/field-barrel.png',
            'Пахомов Александр Григорьевич /images/field-box.png',
            'Наумов Людвиг Артёмович /images/field-blue.png',
            'Негода Устин Леонидович /images/field-red.png',
            'Грабчак Роман Андреевич /images/field-green.png',
            'Симонов Игнатий Васильевич /images/field-purple.png',
            'Харитонов Яромир Александрович /images/field-yellow.png',
            'Крюков Марк Романович /images/field-poly-color.png',
            'Киранов Марат Романович /images/field-treasures.png',
            'Пушкин Александр Сергеевич /images/field-poly-color.png',
        ];
        let info = {};
        if (id === this.getSocNetUserId() && false) {
            info.first_name = 'Админ';
            info.last_name = 'Админов';
            info.photo_50 = '/images/button-shuffle-rest.png';
            info.photo_100 = '/images/button-shuffle-rest.png';
        } else {
            info.first_name = randomName[id % randomName.length].split(' ')[0];
            info.last_name = randomName[id % randomName.length].split(' ')[1];
            info.photo_50 = randomName[id % randomName.length].split(' ')[3];
            info.photo_100 = randomName[id % randomName.length].split(' ')[3];
        }
        info.id = id;
        info.sex = SocNet.SEX_UNKNOWN;
        console.log(info);
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