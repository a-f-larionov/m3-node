/**
 * Компонет для работы с социальной сетью(платформой): сайтом http://krestiki-noliki.xyz/
 * @constructor
 */
/**
 * @type {SocNetStandalone}
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
            'Кириллов Юрий Валериевич https://sun9-66.userapi.com/c850720/v850720693/aa731/OfJz30MgPwk.jpg?ava=1',
            'Пахомов Александр Григорьевич https://sun9-14.userapi.com/c638221/v638221218/2ef4b/_aHYzcPLBCg.jpg?ava=1',
            'Негода Устин Леонидович https://sun1-22.userapi.com/RmZXykSdi9zj13kzngIYEqOfID_hx6orUlfJlA/MMMD8qmZ_Xw.jpg?ava=1',
            'Грабчак Роман Андреевич https://sun1-21.userapi.com/y5VqHemrzxItmMMqaFLOgs8zICBGDnLsQSgAxQ/vCEOyLcrgd0.jpg?ava=1',
            'Наумов Людвиг Артёмович https://sun1-17.userapi.com/dqr7J__INZrCV_sz-q_FjD3QZZ2teSTYvc1tnQ/jnfGgShVuX8.jpg?ava=1',
            'Симонов Игнатий Васильевич https://sun1-89.userapi.com/XbvESSpRKkZTVrKVoPaLsvxi8VeAt2F3bnBSjw/CXlmEGL1hLA.jpg?ava=1',
            'Харитонов Яромир Александрович https://sun9-23.userapi.com/c852020/v852020728/2517a/KgfXYhVKZqc.jpg?ava=1',
            'Носков Людвиг Романович https://sun9-46.userapi.com/c856128/v856128757/17a84c/jVZi7Qhn8J0.jpg?ava=1',
            'Крюков Марк Романович https://sun9-25.userapi.com/c129/u3798851/d_c8272907.jpg?ava=1',
            'Киранов Марат Романович https://sun9-21.userapi.com/c856128/v856128316/2231ac/YlxmsBfJmRo.jpg?ava=1',
            'Чубайк Николай Викторович https://sun9-24.userapi.com/c855236/v855236720/1fc41b/30CK4PHZdbA.jpg?ava=1',
            'Пушкин Александр Сергеевич https://sun9-71.userapi.com/c857324/v857324568/1766c5/-0YaEO72vRE.jpg?ava=1',
            'Билл Гейтс Ибнабабн https://sun9-9.userapi.com/c857324/v857324365/129750/UE54E0SgDaU.jpg?ava=1',
            'Стив Джоб Jobs https://sun9-45.userapi.com/c845420/v845420707/eff82/P3Mvr9Zp4qI.jpg?ava=1',
        ];
        let info = {};
        if (id === this.getSocNetUserId()) {
            //info.first_name = 'Админ';
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
        let url;
        let qty = confirm("Купить " + product.quantity + "монет за " + votes + " стенделонов?");
        if (qty) {
            url = "https://local.host/service/standalone_buy?" +
                "receiver_id=" + LogicUser.getCurrent().socNetUserId + "&" +
                "order_id=" + LogicTimeClient.getTime() + "&" +
                "item_price=" + product.votes;
            window.open(url);
        }
    };

    this.post = function () {
        console.log(arguments);
        alert('Возможно не сейчас!');
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