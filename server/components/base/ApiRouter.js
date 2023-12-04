/**
 * ApiRouter
 * Cross-side component.
 * @constructor
 */
let ApiRouter = new (function ApiRouter() {
    let self = this;

    let map;

    let stats = {};
    this.stats = stats;

    let connections = {};
    let onDisconnectCallbacks = [];
    let onFailedSendCallbacks = [];

    /**
     * Set API Map
     * @param newMap
     */
    this.setMap = function (newMap) {
        map = newMap;
        for (let group in map) {
            stats[group] = {};
            for (let method in map[group]) {
                stats[group][method] = 0;
            }
        }
    };

    /**
     * Process requests.
     * @param packet {string} пакет данных, формат:JSON, {group:string, method:string, args:[...]}
     * @param id {Number} id соединения.
     */
    this.onData = function (packet, id) {
        let group, method, args, l;
        l = packet.length;
        try {
            packet = JSON.parse(packet);
        } catch (e) {
            log("Wrong data: parse error", Logs.LEVEL_WARN, packet);
            return;
        }
        if (typeof packet !== 'object') return Logs.log("Wrong data: packet must be 'object'" + packet, Logs.LEVEL_WARN);

        if (packet.group === undefined) return Logs.log("Wrong data: packet must have .group" + packet, Logs.LEVEL_WARN);

        if (typeof packet.group !== 'string') return Logs.log("Wrong data: packet.group must have type 'string'" + packet, Logs.LEVEL_WARN);

        if (packet.method === undefined) return Logs.log("Wrong data: packet must have .method" + packet, Logs.LEVEL_WARN);

        if (typeof packet.method !== 'string') return Logs.log("Wrong data: packet.method must have type 'string'" + packet, Logs.LEVEL_WARN);

        if (packet.args === undefined) return Logs.log("Wrong data: packet must have .args" + packet, Logs.LEVEL_WARN);

        if (typeof packet.args !== 'object') return Logs.log("Wrong data: packet.args must have type 'object'" + packet, Logs.LEVEL_WARN);

        group = packet.group;
        method = packet.method;
        args = packet.args;

        if (map[group] === undefined) return Logs.log("Wrong data: group not found " + group + " " + packet, Logs.LEVEL_WARN);

        if (map[group][method] === undefined) return Logs.log("Wrong data: method not found " + method + " " + packet, Logs.LEVEL_WARN);


        Logs.log((CONST_IS_SERVER_SIDE ?
            id + " " + ">> " : '') + group + "." + method + (l > 500 ? "(" + l + ")"
            : "") + args,
            Logs.LEVEL_TRACE);

        /** Добавим к аргументам контекст соединения. */
        args.unshift(connections[id]);
        /** Group_method.counter ++ **/

        stats[group][method]++;

        map[group][method].apply(self, args);
    };

    this.getConnectContext = function (cid) {
        return connections[cid];
    }

    this.onConnect = function (id) {
        Logs.log("ApiRouter.onConnect: id=" + id, Logs.LEVEL_TRACE);
        connections[id] = {cid: id};
    };

    this.onDisconnect = function (id) {
        let userId, count;
        for (let i in onDisconnectCallbacks) {
            onDisconnectCallbacks[i].call(self, connections[id]);
        }
        if (connections[id]) userId = connections[id].userId;
        delete connections[id];
        count = 0;
        for (let i in connections) count++;
        Logs.log("Connection close: id=" + id + " count:" + count + " userId:" + userId, Logs.LEVEL_TRACE);

        if (CONST_IS_CLIENT_SIDE) {
            //@todo не очень это выглядиты(да  и на сервере такой штуки нет)
            // @prid это глобальная переменная на клиенте
            prid = null;
        }

        if (CONST_IS_SERVER_SIDE && count === 0 && Config.Project.zeroOnlineDowntimeout) {
            setTimeout(function () {
                let count = 0;
                for (let i in connections) count++;
                if (count === 0) {
                    Logs.log("Zero clients - got down.", Logs.LEVEL_INFO);
                    LogicSystemRequests.shutdown(function () {
                    });
                }
            }, Config.Project.zeroOnlineDowntimeout);
        }
    };

    this.executeRequest = function (group, method, args, cntxList) {
        let connectionsKey, i;
        /** Convert object to array. */
        args = Array.prototype.slice.call(args);

        if (!cntxList) cntxList = [{cid: null}];

        connectionsKey = '';
        for (i in cntxList) connectionsKey += cntxList[i].cid;

        let packet = {
            group: group,
            method: method,
            args: args
        };
        packet = JSON.stringify(packet);

        if (CONST_IS_SERVER_SIDE) {
            /** Server */
            Logs.log(connectionsKey + " " + "<< " + group + "." + method + ':' + args.join(','), Logs.LEVEL_TRACE);
        } else {
            /** Client */
            Logs.log(
                group + "." + method +
                (packet.length > 500 ? "(" + packet.length + ")" : "")
                + args.join(",")
                , Logs.LEVEL_TRACE);
        }

        let cntxListLength = 0;
        for (i in cntxList) {
            if (!this.sendData(packet, cntxList[i].cid)) {
                Logs.log("ApiRouter.failedToSend" + {packet: packet, cntx: cntxList[i]},
                    Logs.LEVEL_WARN);
                for (let j in onFailedSendCallbacks) {
                    onFailedSendCallbacks[j].call(self, cntxList[j]);
                }
            }
            cntxListLength++;
        }
        if (cntxListLength === 0) {
            Logs.log("ApiRouter. Try send to empty contextlist."
                + JSON.stringify({
                    packet: packet,
                    cntxList: cntxList
                }),
                Logs.LEVEL_WARN);
        }
    };

    /**
     * Добавлить каллбэк дисконнекта.
     * Будет вызван при дисконнекте соедеинения.
     * @param callback
     * @todo move out
     */
    this.addOnDisconnectCallback = function (callback) {
        onDisconnectCallbacks.push(callback);
    };

    /**
     * Добавлить каллбэк неудачной отправки.
     * Будет вызван при неудачной отправки данных, в разорванное соединение.
     * @param callback
     */
    this.addOnFailedSendCallback = function (callback) {
        onFailedSendCallbacks.push(callback);
    };

})
();

global['ApiRouter'] = ApiRouter;
