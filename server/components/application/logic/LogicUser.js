const {KafkaModule} = require("../../base/Kafka.js");
const {DataUser} = require("../data/DataUser.js");
/**
 * @type {LogicUser}
 */
var LogicUser = function () {
    let self = this;
    let userToCntx = {};
    let userToCntxCount = 0;

    let cntxLastId = 1;

    this.init = function (afterInitCallback) {
        ApiRouter.addOnDisconnectCallback(onDisconnectOrFailedSend);
        ApiRouter.addOnFailedSendCallback(onDisconnectOrFailedSend);
        Logs.log("LogicUser inited.", Logs.LEVEL_DEBUG);
        afterInitCallback();
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
        let args = [];
        args = Array.prototype.slice.call(arguments);
        capiFunction = args.shift();
        args.unshift(0);
        for (let userId in userToCntx) {
            args[0] = userId;
            capiFunction.apply(null, args);
        }
    };

    this.getOnlineUserIds = function () {
        let list;
        list = [];
        for (let userId in userToCntx) {
            list.push(userId);
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

    this.userAddConn = function (userId, socNetUserId, cntx) {
        userAddConn({
            id: userId,
            socNetUserId: socNetUserId
        }, cntx);
    }

    /**
     * Добавить пользователю контекст соединения.
     * Так же создаст контекст пользователя, если его нет.
     * @param user
     * @param cntx
     */
    let userAddConn = function (user, cntx) {
        if (!userToCntx[user.id]) {
            Logs.log("CREATE user context. uid:" + user.id + ", cid:" + cntx.cid, Logs.LEVEL_TRACE);
            userToCntx[user.id] = {
                conns: {},
                user: {
                    id: user.id,
                    socNetUserId: user.socNetUserId
                },
                connsCount: 0
            };
            userToCntxCount++;
        }
        Logs.log("ADD user conn", Logs.LEVEL_TRACE);
        cntx.userId = user.id;
        cntx.isAuthorized = true;
        cntx.user = userToCntx[user.id].user;
        userToCntx[user.id].conns[cntx.cid] = cntx;
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
        Logs.log("DELETE user conn", Logs.LEVEL_TRACE);
        delete userToCntx[userId].conns[cntx.cid];
        userToCntx[userId].connsCount--;
        if (userToCntx[userId].connsCount == 0) {
            Logs.log("DELETE user Context", Logs.LEVEL_TRACE);
            delete userToCntx[userId];
            userToCntxCount--;
        }
    };

    /**
     * Действия при выходе игрока из игры.
     * @param userId {Number} id пользователя.
     */
    let onLogout = function (userId) {
        Logs.log("User logout. user.id=" + userId, Logs.LEVEL_TRACE);
        Statistic.write(userId, Statistic.ID_LOGOUT);
        Kafka.sendToUsers({userId: userId}, userId, "UpdateLastLogoutRqDto");
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
     * @param ids {Number} данные о каком пользователе.
     * @param prid
     */
    this.sendUserListInfo = function (ids, toUserId, prid) {
        DataUser.getList(ids, function (list) {
            if (list) {
                list = list.map(function (user) {
                    return [
                        user.id,
                        user.nextPointId,
                        user.socNetUserId,
                        user.fullRecoveryTime,
                    ];
                });
                CAPIUser.updateUserListInfo(toUserId, list);
                pFinish(prid);
            } else {
                Logs.log(arguments.callee.name + " Users not found: id=" + ids, Logs.LEVEL_WARN);
                pFinish(prid);
            }
        });
    };
};

LogicUser = new LogicUser();
LogicUser.depends = ['Logs', 'Profiler', 'DB', 'DataUser', 'Statistic', 'SocNet'];
global["LogicUser"] = LogicUser;
module.exports = {LogicUser}