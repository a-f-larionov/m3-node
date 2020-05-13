/**
 * Компонент для работы с социальной сетью.
 * @type {SocNetVK}
 * @constructor
 */
let SocNetVK = function () {

    let getParams = {};

    // для вконтакте

    // ------------- CLIENT
    let parseSocNetURL = function () {
        getParams = {
            viewer_id: getQueryVariable('viewer_id'),
            api_id: getQueryVariable('api_id'),
            auth_key: getQueryVariable('auth_key'),
            secret: getQueryVariable('secret'),
            access_token: getQueryVariable('access_token')
        };
        /* Other possible GET params from VK
         api_url:http://api.vk.com/api.php
         api_id:4467180
         api_settings:8199
         viewer_id:12578187
         viewer_type:0
         sid:c57ce42cb7fefaf59d1456800cdc86a9c732b7d9e99a84cc6e00147150fd3d34532c97317c695edfdcb7c
         secret:3704c9427d
         access_token:4fe7830d6ecd2eeac26cc5a3d009fa1dcf6cb268765347fcda81f97405817420835122f29cf5834afbedf
         user_id:0
         group_id:0
         is_app_user:1
         auth_key:1bb91dabd1b8e7913c3ebb052f7d2a39
         language:0
         parent_language:0
         ad_info:ElsdCQBeRFJsBAxcAwJSXHt5C0Q8HTJXUVBBJRVBNwoIFjI2HA8E
         is_secure:0
         ads_app_id:4467180_e18d649ad35faed323
         referrer:unknown
         lc_name:fe8f8c15
         hash:;
         */
    };

    this.getAuthParams = function () {
        /*	auth_key = md5(app_id+'_'+viewer_id+'_'+app_secret); */
        return {
            authKey: getParams.auth_key,
            appId: getParams.api_id
        };
    };

    /**
     * Возвращает url на профиль пользователя в социальной сети.
     * @param socNetTypeId {Number} id социальной сети SocNet.TYPE_*
     * @param socNetUserId {Number} id пользователя в соц.сети.
     * @returns {string} url на профиль пользователя в соц.сети.
     */
    this.getUserProfileUrl = function (socNetTypeId, socNetUserId) {
        return 'http://vk.com/id' + socNetUserId;
    };

    /**
     * Открыть диалог приглашения друзей.
     * @returns {boolean}
     */
    this.openInviteFriendDialog = function () {
        VK.callMethod('showInviteBox');
    };

    this.openOrderDialog = function (votes) {
        VK.callMethod('showOrderBox', {
            type: 'votes',
            votes: votes
        });
    };

    this.getFriendIds = function (callback) {
        VK.api('friends.getAppUsers', {}, function (data) {
            callback(data.response)
        });
    };

    this.getUserInfo = function (id, callback) {
        VK.api('users.get', {
            user_ids: id,
            fields: 'photo_50,photo_100'
        }, function (data) {
            callback(data.response);
        });
    };

    /**
     * Права доступа: wall
     * @see wall.post
     */
    this.post = function (params) {
        console.log(params);
        VK.api('wall.post',
            {
                owner_id: params.userId,
                message: params.message,
                attachments: 'photo-194995832_457239017'

            }, function () {
                console.log(arguments);
            });
    };

    /**
     * Инициализация VK.
     * @see WebSocketServer : let loadClientCode {Function}
     */
    this.init = function () {
        let onSuccess, onFail;
        onSuccess = function () {
            Logs.log("VK client API inited.", Logs.LEVEL_NOTIFY);
        };
        onFail = function () {
            alert('Произошла ошибка доступа к вКонтакте, обратитесь к автору приложения.');
            Logs.log("SocNetVK Fail", Logs.LEVEL_FATAL_ERROR);
        };
        VK.init(onSuccess, onFail, '5.95');
        parseSocNetURL();
    };

    this.getSocNetUserId = function () {
        return getParams.viewer_id;
    };

    this.detectIsItThat = function () {
        if (window.PLATFORM_ID == 'VK') return true;
        return false;
    }

};
/**
 * Статичный класс.
 * @type {SocNetVK}
 */
SocNetVK = new SocNetVK();
