let QUERYSTRING = require('querystring');
let MD5 = require('md5');
var AsyncLock = require('async-lock');
var LOCK = new AsyncLock();

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
        let body = '', buyPrefix = 'vk_buy';
        let tid;
        tid = LogicTid.getOne();

        Logs.log(buyPrefix + " tid:" + tid + " REQUEST", Logs.LEVEL_DETAIL, undefined, Logs.CHANNEL_VK_PAYMENTS);

        /** Собираем тело */
        request.on('data', function (data) {
            body += data;
        });

        /** Завершили сбор тела */
        request.on('end', function () {
            onVKbuyReady(
                request.url,
                body,
                QUERYSTRING.decode(body),
                tid,
                callback,
                buyPrefix
            );
        });
    };

    this.standaloneBuy = function (callback, request) {
        let body = '', buyPrefix = 'standalone_buy';
        let tid, params;
        tid = LogicTid.getOne();

        Logs.log(buyPrefix + " tid:" + tid + " REQUEST", Logs.LEVEL_DETAIL, undefined, Logs.CHANNEL_VK_PAYMENTS);

        /** Собираем тело */
        request.on('data', function (data) {
            body += data;
        });

        /** Завершили сбор тела */
        request.on('end', function () {
            params = QUERYSTRING.parse(request.url.substr(request.url.indexOf('?') + 1));

            Logs.log(JSON.stringify(params));

            self.doOrderChange(
                parseInt(params.receiver_id),
                parseInt(params.order_id),
                parseInt(params.item_price),
                tid,
                function (answer) {
                    callback(JSON.stringify(answer));
                },
                SocNet.TYPE_STANDALONE,
                buyPrefix);
        });
    };

    let onVKbuyReady = function (url, body, params, tid, callback, buyPrefix) {

        Logs.log(buyPrefix + " tid:" + tid + " REQUEST BODY READY", Logs.LEVEL_DETAIL, {
            url: url, body: body, params: params
        }, Logs.CHANNEL_VK_PAYMENTS);

        self.VKBuyProccess(params, tid, function (answer) {
            callback(JSON.stringify(answer));
        }, buyPrefix);
    };

    this.VKBuyProccess = function (params, tid, callback, buyPrefix) {
        let app_id, receiver_id, sig, order_id, item_price, notification_type;
        /** Проверка наличия полей */
        if (
            !params.app_id ||
            !params.receiver_id ||
            !params.sig ||
            !params.order_id ||
            !params.item_price ||
            !params.notification_type
        ) {
            Logs.log(buyPrefix + " tid:" + tid + " Не все аргументы.", Logs.LEVEL_ERROR, params, Logs.CHANNEL_VK_PAYMENTS);
            return callback(vkErrorCommon);
        }
        app_id = parseInt(params.app_id);
        receiver_id = parseInt(params.receiver_id);
        sig = params.sig;
        order_id = parseInt(params.order_id);
        item_price = parseInt(params.item_price);
        notification_type = params.notification_type;

        /** Проверка id приложения */
        if (app_id !== Config.SocNet.VK.appId) {
            Logs.log(buyPrefix + " tid:" + tid + " Не верный appId", Logs.LEVEL_ERROR, params, Logs.CHANNEL_VK_PAYMENTS);
            return callback(vkErrorCommon);
        }
        /** Проверка сигнатуры */
        if (sig !== self.calcVKSign(params)) {
            Logs.log(buyPrefix + " tid:" + tid + " Не верная сигнатура подписи", Logs.LEVEL_ERROR, params, Logs.CHANNEL_VK_PAYMENTS);
            return callback(vkErrorSign);
        }
        /** Проверка типа запроса */
        if (notification_type === 'order_status_change' || notification_type === 'order_status_change_test') {
            if (!params.status || params.status !== 'chargeable') {
                Logs.log(buyPrefix + " tid:" + tid + " Ошибка статуса", Logs.LEVEL_ERROR, params, Logs.CHANNEL_VK_PAYMENTS);
                return callback(vkErrorCommon);
            }
            return self.doOrderChange(receiver_id, order_id, item_price, tid, callback, SocNet.TYPE_VK, buyPrefix);
        } else {
            Logs.log(buyPrefix + " tid:" + tid + " Ошибка типа запроса `notification_type` ", Logs.LEVEL_ERROR, params, Logs.CHANNEL_VK_PAYMENTS);
            return callback(vkErrorCommon);
        }
    };

    this.doOrderChange = function (socNetUserId, order_id, item_price, tid, callback, socNetTypeId, buyPrefix) {
        let product;
        socNetTypeId = Valid.DBUINT(socNetTypeId);
        socNetUserId = Valid.DBUINT(socNetUserId);
        item_price = Valid.DBUINT(item_price);
        order_id = Valid.DBUINT(order_id);
        if (!socNetTypeId || !socNetUserId || !item_price || !order_id) {
            Logs.log(buyPrefix + " tid:" + tid + "CANCEL no data", Logs.LEVEL_ALERT, arguments);
            return callback(vkErrorItemPriceNotFound);
        }
        product = DataShop.getGoldProductByPrice(item_price);
        console.log(arguments);
        /** Существует ли такой товар */
        if (!product) {
            Logs.log(buyPrefix + " tid:" + tid + " product not found", Logs.LEVEL_ERROR, arguments, Logs.CHANNEL_VK_PAYMENTS);
            return callback(vkErrorItemPriceNotFound);
        }

        LOCK.acquire(buyPrefix + order_id, function (done) {
            setTimeout(done, 5 * 60 * 1000);
            /** Проверка наличия пользователя */
            DataUser.getBySocNet(socNetTypeId, socNetUserId, function (user) {
                if (!user || !user.id) {
                    Logs.log(buyPrefix + " tid:" + tid + " no user found", Logs.LEVEL_ERROR, arguments, Logs.CHANNEL_VK_PAYMENTS);
                    done();
                    return callback(vkErrorCommon);
                }
                /** Проверка повторной обработки заказа. */
                DataPayments.getByOrderId(order_id, function (order) {
                    if (order) {
                        Logs.log(buyPrefix + " tid:" + tid + " order already exists", Logs.LEVEL_WARNING, arguments, Logs.CHANNEL_VK_PAYMENTS);
                        done();
                        //
                        return callback(vkErrorCommon);
                    }

                    DataPayments.createOrder(
                        user.id,
                        LogicTimeServer.getTime(),
                        order_id,
                        item_price, function (newOrder) {

                            DataStuff.giveAGold(user.id, product.quantity, tid);

                            CAPIStuff.incrementGold(user.id, product.quantity);

                            Logs.log(buyPrefix + " tid:" + tid + " uid:" + user.id + " votes:" + item_price + " gold:" + product.quantity + " order success", Logs.LEVEL_DETAIL, {
                                order: order, itemPrice: item_price
                            }, Logs.CHANNEL_VK_PAYMENTS);
                            done();
                            return callback(
                                {"response": {"order_id": order_id, "app_order_id": newOrder.id}}
                            );
                        });
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
        return MD5(str);
    };
};

LogicPayments = new LogicPayments();