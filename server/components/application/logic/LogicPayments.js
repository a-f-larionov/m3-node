var QUERYSTRING = require('querystring');
var MD5 = require('md5');
var FS = require('fs');

LogicPayments = function () {

    let self = this;

    let vkErrorCommon = {
        error: {
            error_code: 1,
            error_msg: 'общая ошибка',
            crtitcal: false
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
        var body = '';

        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            let params, url;

            url = request.url;
            FS.writeFile(CONST_DIR_SERVER + '/logs/payments.log',
                LogicTimeServer.getCurrentTime() + " " + request.url + " " + body + "\r\n",
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
            return callback(vkErrorCommon);
        }
        // проверка сигнатуры
        if (sig !== self.calcVKSign(params)) {
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
        // проверка наличия пользователя
        DataUser.getBySocNet(SocNet.TYPE_VK, receiver_id, function (user) {
            if (!user || !user.id) {
                return callback(vkErrorCommon);
            }
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
                        DataStuff.giveAGold(user.id, item_price * 10);
                        CAPIStuff.incrementGold(user.id, item_price * 10);
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
    }
};

LogicPayments = new LogicPayments();