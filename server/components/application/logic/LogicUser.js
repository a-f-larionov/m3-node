//@todo не работает ...
//let  nodemailer = require('nodemailer');
LogicUser = function () {
    let self = this;
    let userToCntx = {};
    let userToCntxCount = 0;

    this.init = function (afterInitCallback) {
        ApiRouter.addOnDisconnectCallback(onDisconnectOrFailedSend);
        ApiRouter.addOnFailedSendCallback(onDisconnectOrFailedSend);
        Logs.log("LogicUser inited.", Logs.LEVEL_NOTIFY);
        afterInitCallback();
    };

    /**
     * Авторизация пользователя из соц сети вКонтакте.
     * @param socNetUserId
     * @param authParams
     * @param cntx
     */
    this.authorizeByVK = function (socNetUserId, authParams, cntx) {
        let socNetTypeId = SocNet.TYPE_VK;
        socNetUserId = parseInt(socNetUserId);
        if (isNaN(socNetUserId)) {
            Logs.log("LogicUser: cant auth, SocNet.checkAuth failed. (VK), socNetUserId is not a number", Logs.LEVEL_WARNING, {
                socNeUserId: socNetUserId,
                authParams: authParams
            });
            return;
        }
        let checkResult = SocNet(socNetTypeId).checkAuth(socNetUserId, authParams);
        if (!checkResult) {
            Logs.log("LogicUser: cant auth, SocNet.checkAuth failed. (VK)", Logs.LEVEL_WARNING, {
                socNetUserId: socNetUserId,
                authParams: authParams
            });
            return;
        }
        if (!checkResult) return;
        let prid = Profiler.start(Profiler.ID_AUTH_VK);
        /* get from db */
        DataUser.getBySocNet(socNetTypeId, socNetUserId, function (user) {
            authorizeOrCreate(user, socNetTypeId, socNetUserId, cntx, prid, Profiler.ID_AUTH_VK);
        });
    };

    /**
     * @todo authorization is equal authorizeByVK! is it reusable code
     * @param socNetUserId {int}
     * @param authParams {Object}
     * @param cntx {Object}
     */
    this.authorizeByStandalone = function (socNetUserId, authParams, cntx) {
        let socNetTypeId = SocNet.TYPE_STANDALONE;
        socNetUserId = parseInt(socNetUserId);
        if (isNaN(socNetUserId)) {
            Logs.log("LogicUser: cant auth, SocNet.checkAuth failed. (VK), socNetUserId is not a number", Logs.LEVEL_WARNING, {
                socNeUserId: socNetUserId,
                authParams: authParams
            });
            return;
        }
        let checkResult = SocNet(socNetTypeId).checkAuth(socNetUserId, authParams);
        if (!checkResult) {
            Logs.log("LogicUser: cant auth, SocNet.checkAuth failed.(Standalone)", Logs.LEVEL_WARNING, {
                socNetUserId: socNetUserId,
                authParams: authParams
            });
        }
        if (!checkResult) return;
        let prid = Profiler.start(Profiler.ID_AUTH_STANDALONE);
        /* get from db */
        DataUser.getBySocNet(socNetTypeId, socNetUserId, function (user) {
            authorizeOrCreate(user, socNetTypeId, socNetUserId, cntx, prid, Profiler.ID_AUTH_STANDALONE);
        });
    };

    let authorizeOrCreate = function (user, socNetTypeId, socNetUserId, cntx, prid, profilerType) {
        /* if not exists create user */
        if (!user) {
            createUser(socNetTypeId, socNetUserId, function (user) {
                authorizeSendSuccess(user, cntx, prid, profilerType);
            })
        } else {
            authorizeSendSuccess(user, cntx, prid, profilerType);
        }
    };

    /**
     * Создаёт юзера по данным социальной сети.
     * @param socNetTypeId {Number} id социальной сети, LogicUser.SocNet.TYPE_*.
     * @param socNetUserId {Number} id юзера в социальной сети.
     * @param callback {Function} будет вызван после создания пользователя.
     */
    let createUser = function (socNetTypeId, socNetUserId, callback) {
        DataUser.createFromSocNet(socNetTypeId, socNetUserId, function (user) {
            callback(user);
        });
    };

    /**
     * Отправить уведомомление клиенту, что авторизация прошла успешно.
     * @param user {Object} инфо пользователя.
     * @param cntx {Object} контекст соединения.
     * @param prid {int} id профелируйщего таймера
     * @param profilerType {int} id профайлера.
     * @todo prid and profilerType conflited by means..
     */
    let authorizeSendSuccess = function (user, cntx, prid, profilerType) {
        /* тут мы запомним его connectionId раз и на всегда */
        Statistic.add(user.id, Statistic.ID_AUTHORIZE);
        userAddConn(user, cntx);
        DataUser.updateLastLogin(user.id);
        CAPIUser.authorizeSuccess(user.id, user);
        Profiler.stop(profilerType, prid);
    };

    /**
     * Отправить пользователю данные
     * @param userId {int} id пользователя.
     * @param group {string} группу апи.
     * @param method {string} метод апи.
     * @param arguments {Array} аргументы апи.
     */
    this.sendToUser = function (userId, group, method, arguments) {
        let cntxList = userGetConns(userId);
        ApiRouter.executeRequest(group, method, arguments, cntxList);
    };

    /**
     * Отправить всем.
     * @param capiFunction {Function} CAPI-функция, CAPI{groupName}.{functionName}.
     * @param arg1 {*} любой параметр, будет передан в CAPI-функцию 1-ым.
     * @param arg2 {*} любой параметр, будет передан в CAPI-функцию 2-ым.
     * @param arg3 {*} любой параметр, будет передан в CAPI-функцию 3-ым.
     * @param arg4 {*} любой параметр, будет передан в CAPI-функцию 4-ым.
     * @param arg5 {*} любой параметр, будет передан в CAPI-функцию 5-ым.
     * @param arg6 {*} любой параметр, будет передан в CAPI-функцию 6-ым.
     * @param arg7 {*} любой параметр, будет передан в CAPI-функцию 7-ым
     * @param arg8 {*} любой параметр, будет передан в CAPI-функцию 8-ым.
     */
    this.sendToAll = function () {
        let prid = Profiler.start(Profiler.ID_LOGIC_SEND_TO_ALL);
        let args = [];
        args = Array.prototype.slice.call(arguments);
        capiFunction = args.shift();
        args.unshift(0);
        for (let userId in userToCntx) {
            args[0] = userId;
            capiFunction.apply(null, args);
        }
        Profiler.stop(Profiler.ID_LOGIC_SEND_TO_ALL, prid);
    };

    this.getOnlineUserIds = function () {
        let list;
        list = {};
        for (let userId in userToCntx) {
            list[userId] = parseInt(userId);
        }
        return list;
    };

    /**
     * Является ли пользователь онлайн.
     * @param userId {int} id пользователя.
     * @returns {boolean}
     */
    this.isUserOnline = function (userId) {
        return !!userGetConns(userId);
    };

    /**
     * Добавить пользователю контекст соединения.
     * Так же создаст контекст пользователя, если его нет.
     * @param user
     * @param cntx
     */
    let userAddConn = function (user, cntx) {
        if (!userToCntx[user.id]) {
            Logs.log("CREATE user context. uid:" + user.id + ", cid:" + cntx.connectionId, Logs.LEVEL_DETAIL);
            userToCntx[user.id] = {
                conns: {},
                user: {
                    id: user.id
                },
                connsCount: 0
            };
            userToCntxCount++;
        }
        Logs.log("ADD user conn", Logs.LEVEL_DETAIL);
        cntx.userId = user.id;
        cntx.isAuthorized = true;
        cntx.user = userToCntx[user.id].user;
        userToCntx[user.id].conns[cntx.connectionId] = cntx;
        userToCntx[user.id].connsCount++;
    };

    /**
     * Возвращает массив контекстов соединения пользователя.
     * @param userId
     * @returns {*}
     */
    let userGetConns = function (userId) {
        return userToCntx[userId] ? userToCntx[userId].conns : null;
    };

    /**
     * Удаляет контекст соединения для пользователя.
     * Так же удалит контекст пользователя, если в результате удаления не останется ни одного соединения.
     * @param cntx
     */
    let userDeleteConn = function (cntx) {
        let userId = cntx.userId;
        Logs.log("DELETE user conn", Logs.LEVEL_DETAIL);
        delete userToCntx[userId].conns[cntx.connectionId];
        userToCntx[userId].connsCount--;
        if (userToCntx[userId].connsCount == 0) {
            Logs.log("DELETE user Context", Logs.LEVEL_DETAIL);
            delete userToCntx[userId];
            userToCntxCount--;
        }
    };

    /**
     * Действия при выходе игрока из игры.
     * @param userId {Number} id пользователя.
     */
    let onLogout = function (userId) {
        Logs.log("User logout. user.id=" + userId, Logs.LEVEL_DETAIL);
        Statistic.add(userId, Statistic.ID_LOGOUT);
        DataUser.updateLastLogout(userId);
    };

    /**
     * это каллбек для определения что соедиение разорвано.
     * и на случай если мы пытаемся отправить данные отконектившемуся клиенту,
     * мы попробуем удалить соединение из контекста пользователя.
     * @param cntx
     */
    let onDisconnectOrFailedSend = function (cntx) {
        if (cntx && cntx.userId) {
            onLogout(cntx.userId);
            userDeleteConn(cntx);
        }
    };

    /**
     * Отправка информации о пользователе.
     * @param toUserId {Number} кому отправляем.
     * @param userId {Number} данные о каком пользователе.
     */
    this.sendUserInfo = function (userId, toUserId) {
        DataUser.getById(userId, function (user) {
            if (user) {
                user.online = self.isUserOnline(user.id);
                CAPIUser.updateUserInfo(toUserId, user);
            } else {
                Logs.log("LogicUser.sendUserInfo. User not found: id=" + userId, Logs.LEVEL_WARNING);
            }
        });
    };

    /**
     * Отправка информации о пользователе.
     * @param toUserId {Number} кому отправляем.
     * @param ids {Number} данные о каком пользователе.
     */
    this.sendUserListInfo = function (ids, toUserId) {
        DataUser.getList(ids, function (list) {
            if (list) {
                CAPIUser.updateUserListInfo(toUserId, list);
            } else {
                Logs.log(arguments.callee.name + " Users not found: id=" + ids, Logs.LEVEL_WARNING);
            }
        });
    };
};

/**
 * Константный класс.
 * @type {LogicUser}
 */
LogicUser = new LogicUser();

LogicUser.depends = ['Logs', 'Profiler', 'DB', 'DataUser', 'Statistic', 'SocNet'];