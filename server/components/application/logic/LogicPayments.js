let QUERYSTRING = require('querystring');
let MD5 = require('md5');
let FS = require('fs');

LogicPayments = function () {

    let self = this;

    let vkErrorCommon = {
        error: {
            error_code: 1,
            error_msg: 'общая ошибка',
            crtitcal: false
        }
    };

    let vkErrorItemPriceNotFound = {
        error: {
            error_code: 1,
            error_msg: 'нет такого товара',
            crtitcal: true
        }
    };

    let vkErrorSign = {
        error: {
            error_code: 10,
            error_msg: 'несовпадение вычисленной и переданной подписи.',
            critical: true
        }
    };

    /**
     * @see https://vk.com/dev/payments_callbacks?f=3.%20%D0%9F%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0%20%D0%BF%D0%BE%D0%B4%D0%BF%D0%B8%D1%81%D0%B8
     * @param callback
     * @param request
     * @constructor
     */
    this.VKbuy = function (callback, request) {
        let body = '';

        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            let params, url;

            url = request.url;
            FS.writeFile(CONST_DIR_SERVER + '/logs/payments.log',
                LogicTimeServer.getCurrentTime() + " " + url + " " + body + "\r\n",
                {flag: 'a'},
                function () {
                });
            params = QUERYSTRING.decode(body);

            self.VKProcessBuy(params, function (answer) {
                callback(JSON.stringify(answer));
            });
        });
        Logs.log("vk_buy", Logs.LEVEL_NOTIFY);
    };


    this.VKProcessBuy = function (params, callback) {
        let app_id, receiver_id, sig, order_id, item_price, notification_type;
        // проверка наличия полей
        if (
            !params.app_id ||
            !params.receiver_id ||
            !params.sig ||
            !params.order_id ||
            !params.item_price ||
            !params.notification_type
        ) {
            return callback(vkErrorCommon);
        }
        app_id = parseInt(params.app_id);
        receiver_id = parseInt(params.receiver_id);
        sig = params.sig;
        order_id = parseInt(params.order_id);
        item_price = parseInt(params.item_price);
        notification_type = params.notification_type;

        // проверка id приложения
        if (app_id !== Config.SocNet.VK.appId) {
            Logs.log("LogicPayments: Не верный appId", Logs.LEVEL_ERROR, params);
            return callback(vkErrorCommon);
        }
        if (!self.existsGoldWithPrice(item_price)) {
            vkErrorItemPriceNotFound.error_msg = 'Нет товара с ценой: ' + item_price;
            Logs.log("LogicPayments: Нет товара с ценой", Logs.LEVEL_ERROR, params);
            return callback(vkErrorItemPriceNotFound);
        }
        // проверка сигнатуры
        if (sig !== self.calcVKSign(params)) {
            Logs.log("LogicPayments: Не верная сигнатура подписи", Logs.LEVEL_ERROR, params);
            return callback(vkErrorSign);
        }

        if (notification_type === 'order_status_change' ||
            notification_type === 'order_status_change_test'
        ) {
            if (!params.status || params.status !== 'chargeable') {
                return callback(vkErrorCommon);
            }
            return self.doOrderChange(receiver_id, order_id, item_price, callback);
        }
    };

    this.doOrderChange = function (receiver_id, order_id, item_price, callback) {
        let itemGold;
        // проверка наличия пользователя
        DataUser.getBySocNet(SocNet.TYPE_VK, receiver_id, function (user) {
            if (!user || !user.id) {
                return callback(vkErrorCommon);
            }
            itemGold = self.getGoldByVotes(item_price);

            // дальше мы проверяем что собсно мы покупаем,
            DataPayments.getByOrderId(order_id, function (order) {
                if (order) {
                    return callback(vkErrorCommon);
                }
                DataPayments.createOrder(
                    user.id,
                    Math.floor(LogicTimeServer.getCurrentTime() / 1000),
                    order_id,
                    item_price, function (newOrder) {
                        DataStuff.giveAGold(user.id, itemGold);
                        CAPIStuff.incrementGold(user.id, itemGold);
                        return callback(
                            {"response": {"order_id": order_id, "app_order_id": newOrder.id}}
                        );
                    });
            });
        });
    };

    this.calcVKSign = function (params) {
        let keys, str;
        keys = [];
        for (let name in params) {
            if (name === 'sig') continue;
            keys.push(name);
        }
        keys.sort();
        str = '';
        keys.forEach(function (name) {
            str += name + '=' + params[name];
        });
        str += Config.SocNet.VK.secretKey;
        console.log(str);
        console.log(MD5(str));
        return MD5(str);
    };

    this.existsGoldWithPrice = function (itemPrice) {
        let exists;
        exists = false;
        DataShop.gold.forEach(function (item) {
            if (item.votes === itemPrice) exists = true;
        });
        return exists;
    };

    this.getGoldByVotes = function (itemPrice) {
        let gold;
        gold = false;
        DataShop.gold.forEach(function (item) {
            if (item.votes === itemPrice) gold = item.quantity;
        });
        return gold;
    }
};

LogicPayments = new LogicPayments();