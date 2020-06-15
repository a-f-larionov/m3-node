/**
 * Компонент для работы с социальной сетью.
 * @constructor
 */

let MD5 = require('md5');
let HTTPS = require('https');

SocNetVK = function () {

    let self = this;
    let baseHost = 'api.vk.com';
    let baseUrl = '/method/';

    let accessToken = null;


    // -------------- SERVER

    /**
     * Получить список друзей из соц сети.
     * @param socNetTypeId {Number} id социальной сети SoNet.TYPE_*
     * @param socNetUserId {Number} id юзера, в социальной сети.
     * @param callback {Function} is it array of friend ids
     */
    this.getFriends = function (socNetUserId, callback) {
        self.executeMethod('friends.get', {user_id: socNetUserId}, callback);
    };

    /**
     * Получит
     * @param socNetTypeId
     * @param socNetUserId
     * @param callback
     */
    this.getUserInfo = function (socNetUserId, callback) {
        self.executeMethod('users.get', {user_ids: socNetUserId, fields: 'photo_50,sex', https: 1}, function (source) {
                let info;
                info = {};
                info.firstName = source[0].first_name;
                info.lastName = source[0].last_name;
                info.photo50 = source[0].photo_50;
                switch (source[0].sex) {
                    case 1:
                        info.sex = SocNet.SEX_WOMAN;
                        break;
                    case 2:
                        info.sex = SocNet.SEX_MAN;
                        break;
                    default:
                        info.sex = SocNet.SEX_UNKNOWN;
                        break;
                }
                callback(info);
            }
        )
    };

    /**
     * Проверка авторизации
     * @param socNetUserId id в социальной сети.
     * @param authParams специфичные для соц.сети данные проверки м.
     * @returns {boolean} результат аутентификации.
     */
    this.checkAuth = function (socNetUserId, authParams) {
        let generatedAuthKey;
        /*	auth_key = md5(app_id+'_'+viewer_id+'_'+app_secret); */
        if (
            (self.calcSign(socNetUserId, authParams, 0) !== authParams.authKey) &&
            (self.calcSign(socNetUserId, authParams, 1) !== authParams.authKey)
        ) {
            Logs.log("auth key mismatch, generated:" + generatedAuthKey + " given:" + authParams.authKey);
            return false;
        }
        return true;
    };

    this.calcSign = function (socNetUserId, authParams, i) {
        return MD5(authParams.appId + '_' + socNetUserId + '_' + Config.SocNet.VK.secretKey[i]);
    };

    /**
     * Выполнить метод для соц сети. вКонтакте.
     * @param method {String}
     * @param params {Object}
     * @param callback {Function}
     */
    this.executeMethod = function (method, params, callback, isSecure) {
        let url, options, req, key, data;
        /* https://api.vk.com/method/'''METHOD_NAME'''?'''PARAMETERS'''&access_token='''ACCESS_TOKEN''' */
        url = baseUrl + method + '?';
        if (isSecure) {
            params.access_token = accessToken;
            params.client_secret = Config.SocNet.VK.secretKey;
        }
        for (let i in params) {
            url += '&' + i + '=' + encodeURIComponent(params[i]);
        }
        options = {};
        options.hostname = baseHost;
        options.port = 443;
        options.path = url;
        options.method = 'GET';
        Logs.log("https request: " + baseHost + url, Logs.LEVEL_DETAIL);
        key = baseHost + url;
        if (data = UrlCache.get(key)) {
            Logs.log("https answer(cached): " + data, Logs.LEVEL_DETAIL);
            callback(data);
            return;
        }
        /* Далее выполняем запрос */
        req = HTTPS.request(options, function (res) {
            res.on('data', function (data) {
                Logs.log("https answer: " + data, Logs.LEVEL_DETAIL);
                try {
                    data = JSON.parse(data);
                    data = data.response;
                    UrlCache.set(key, data);
                    callback(data);
                } catch (e) {
                    Logs.log("JSON.parse error", Logs.LEVEL_WARNING, {data: data, url: url});
                }
            });
        });
        req.on('error', function (e) {
            Logs.log("SocNet.executeMethod request error:", Logs.LEVEL_ERROR, {url: url, e: e});
        });
        req.end();
    };


    /**
     * oAuth авторизация на вКонтакте.
     * Выполнит запрос.
     * https:// oauth.vk.com /access_token ? client_id = appId & client_secret = secretKey & v = 5.29 [ & grant_type = client_credentials ]
     * @see http://vk.com/dev/auth_server
     * @see http://vk.com/dev/oauth_gettoken
     */
    this.oAuthorization = function (callback) {
        let url, options, req;

        url = "/access_token?client_id=" + Config.SocNet.VK.appId + "&client_secret=" + Config.SocNet.VK.secretKey + "&v=5.28&grant_type=client_credentials";
        host = 'oauth.vk.com';

        options = {};
        options.hostname = host;
        options.port = 443;
        options.path = url;
        options.method = 'GET';
        Logs.log("https request(oAuth): " + host + url, Logs.LEVEL_NOTIFY);
        /* Далее выполняем запрос */
        req = HTTPS.request(options, function (res) {
            res.on('data', function (data) {
                Logs.log("https answer(oAuth): " + data, Logs.LEVEL_NOTIFY);
                try {
                    data = JSON.parse(data.toString());
                    if (data.error) {
                        Logs.log("error (oAuth)", Logs.LEVEL_WARNING, data);
                    }
                    accessToken = data.access_token;
                    callback();
                } catch (e) {
                    Logs.log("JSON.parse error(oAuth)", Logs.LEVEL_WARNING, data);
                }
            });
        });
        req.on('error', function (e) {
            Logs.log("SocNet.executeMethod request error:", Logs.LEVEL_ERROR, e);
        });
        req.end();
    };

    this.init = function (afterInitCallback) {
        //self.oAuthorization();
        afterInitCallback();
    };
};
/**
 * Статичный класс.
 * @type {SocNetVK}
 */
SocNetVK = new SocNetVK();

