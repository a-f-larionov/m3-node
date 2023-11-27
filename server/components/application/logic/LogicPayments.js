const Kafka = require("../../base/Kafka.js").Kafka
let QUERYSTRING = require('querystring');
let MD5 = require('md5');
var AsyncLock = require('async-lock');
const {and32} = require("mysql/lib/protocol/Auth");
var LOCK = new AsyncLock();

LogicPayments = function () {

    let lastUniqTid = 1;

    let getOne = function () {
        return lastUniqTid++;
    }

    let callbacks = {};

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
        let body = '', buyPrefix = 'vk_buy';
        let tid;
        tid = getOne();

        Logs.log(buyPrefix + " REQUEST", Logs.LEVEL_TRACE, undefined, Logs.TYPE_VK_PAYMENTS);

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

        let tid, params;
        tid = getOne();

        callbacks[tid] = callback;

        let body = '', buyPrefix = 'standalone_buy';

        Logs.log(buyPrefix + " tid:" + tid + " REQUEST", Logs.LEVEL_TRACE, undefined, Logs.TYPE_VK_PAYMENTS);

        /** Собираем тело */
        request.on('data', function (data) {
            body += data;
        });

        /** Завершили сбор тела */
        request.on('end', function () {
            params = QUERYSTRING.parse(request.url.substr(request.url.indexOf('?') + 1));

            Logs.log(JSON.stringify(params));

            Kafka.sendToGameplay({
                socNetType: SocNet.TYPE_STANDALONE,

                receiver_id: parseInt(params.receiver_id),
                order_id: parseInt(params.order_id),
                item_price: parseInt(params.item_price),

                tid: tid
            }, null, Kafka.TYPE_DO_ORDER_CHANGE_RQ_DTO);
        });
    };

    this.doOrderChangeCallbackAnswer = function (answer) {
        callbacks[answer.tid].call(null, JSON.stringify(answer));
        callbacks[answer.tid] = null;
    }

    let onVKbuyReady = function (url, body, params, tid, callback, buyPrefix) {

        Logs.log(buyPrefix + " tid:" + tid + " REQUEST BODY READY", Logs.LEVEL_TRACE, {
            url: url, body: body, params: params
        }, Logs.TYPE_VK_PAYMENTS);

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
            Logs.log(buyPrefix + " tid:" + tid + " Не все аргументы.", Logs.LEVEL_ERROR, params, Logs.TYPE_VK_PAYMENTS);
            return callback(vkErrorCommon);
        }
        app_id = parseInt(params.app_id);
        receiver_id = parseInt(params.receiver_id);
        sig = params.sig;
        order_id = parseInt(params.order_id);
        item_price = parseInt(params.item_price);
        notification_type = params.notification_type;

        /** Проверка id приложения */
        if (Config.SocNet.VK.appId !== app_id) {
            Logs.log(buyPrefix + " tid:" + tid + " Не верный appId. Ожидался: " + Config.SocNet.VK.appId, Logs.LEVEL_ERROR, params, Logs.TYPE_VK_PAYMENTS);
            return callback(vkErrorCommon);
        }
        /** Проверка сигнатуры */
        if (!self.checkVKSign(sig, params)) {
            Logs.log(buyPrefix + " tid:" + tid + " Не верная сигнатура подписи. ", Logs.LEVEL_ERROR, params, Logs.TYPE_VK_PAYMENTS);
            return callback(vkErrorSign);
        }
        /** Проверка типа запроса */
        if (notification_type === 'order_status_change' || notification_type === 'order_status_change_test') {
            if (!params.status || params.status !== 'chargeable') {
                Logs.log(buyPrefix + " tid:" + tid + " Ошибка статуса", Logs.LEVEL_ERROR, params, Logs.TYPE_VK_PAYMENTS);
                return callback(vkErrorCommon);
            }
            Kafka.sendToGameplay({
                receiver_id: parseInt(params.receiver_id),
                order_id: parseInt(params.order_id),
                item_price: parseInt(params.item_price),
                tid: tid,
                socNetType: SocNet.TYPE_VK
            }, null, Kafka.TYPE_DO_ORDER_CHANGE_RQ_DTO);
        } else {
            Logs.log(buyPrefix + " tid:" + tid + " Ошибка типа запроса `notification_type` ", Logs.LEVEL_ERROR, params, Logs.TYPE_VK_PAYMENTS);
            return callback(vkErrorCommon);
        }
    };

    this.checkVKSign = function (sig, params) {
        return (sig === self.calcVKSign(params, 0)) ||
            (sig === self.calcVKSign(params, 1));
    };

    this.calcVKSign = function (params, i) {
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
        str += Config.SocNet.VK.secretKey[i];
        return MD5(str);
    };
};

LogicPayments = new LogicPayments();
