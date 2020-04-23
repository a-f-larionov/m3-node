/**
 * Компонет для работы с социальной сетью(платформой): сайтом http://krestiki-noliki.xyz/
 * @constructor
 */

let SocNetStandalone = function () {

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
            'Кириллов Юрий Валериевич field-barrel.png',
            'Пахомов Александр Григорьевич field-box.png',
            'Негода Устин Леонидович field-red.png',
            'Грабчак Роман Андреевич field-green.png',
            'Наумов Людвиг Артёмович field-blue.png',
            'Симонов Игнатий Васильевич field-purple.png',
            'Харитонов Яромир Александрович field-yellow.png',
            'Носков Людвиг Романович field-sand.png',
            'Крюков Марк Романович field-poly-color.png',
            'Киранов Марат Романович field-gold.png',
            'Чубайк Николай Викторович field-poly-color.png',
            'Пушкин Александр Сергеевич field-alpha.png',
            'Билл Гейтс Ибнабабн field-beta.png',
            'Стив Джоб Jobs field-gamma.png',
        ];
        let info = {};
        if (id === this.getSocNetUserId() && false) {
            info.first_name = 'Админ';
            info.last_name = 'Админов';
            info.photo_50 = 'button-shuffle-rest.png';
            info.photo_100 = 'button-shuffle-rest.png';
        } else {
            info.first_name = randomName[id % randomName.length].split(' ')[0];
            info.last_name = randomName[id % randomName.length].split(' ')[1];
            info.photo_50 = randomName[id % randomName.length].split(' ')[3];
            info.photo_100 = randomName[id % randomName.length].split(' ')[3];
        }
        info.id = id;
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