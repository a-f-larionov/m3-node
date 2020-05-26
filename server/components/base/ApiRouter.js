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
        let group, method, args;
        try {
            packet = JSON.parse(packet);
        } catch (e) {
            log("Wrong data:parse error", Logs.LEVEL_WARNING, packet);
            return;
        }
        if (typeof packet !== 'object') return Logs.log("Wrong data: packet must be 'object'", Logs.LEVEL_WARNING, packet);

        if (packet.group === undefined) return Logs.log("Wrong data: packet must have .group", Logs.LEVEL_WARNING, packet);

        if (typeof packet.group !== 'string') return Logs.log("Wrong data: packet.group must have type 'string'", Logs.LEVEL_WARNING, packet);

        if (packet.method === undefined) return Logs.log("Wrong data: packet must have .method", Logs.LEVEL_WARNING, packet);

        if (typeof packet.method !== 'string') return Logs.log("Wrong data: packet.method must have type 'string'", Logs.LEVEL_WARNING, packet);

        if (packet.args === undefined) return Logs.log("Wrong data: packet must have .args", Logs.LEVEL_WARNING, packet);

        if (typeof packet.args !== 'object') return Logs.log("Wrong data: packet.args must have type 'object'", Logs.LEVEL_WARNING, packet);

        group = packet.group;
        method = packet.method;
        args = packet.args;

        if (map[group] === undefined) return Logs.log("Wrong data: group not found " + group, Logs.LEVEL_WARNING, packet);

        if (map[group][method] === undefined) return Logs.log("Wrong data: method not found " + method, Logs.LEVEL_WARNING, packet);


        Logs.log((CONST_IS_SERVER_SIDE ? id + " " + ">> " : '') + group + "." + method, Logs.LEVEL_DETAIL, args);


        /** Добавим к аргументам контекст соединения. */
        args.unshift(connections[id]);
        /** Group_method.counter ++ **/

        stats[group][method]++;

        map[group][method].apply(self, args);
    };

    this.onConnect = function (id) {
        Logs.log("ApiRouter.onConnect: id=" + id, Logs.LEVEL_DETAIL);
        connections[id] = {
            connectionId: id
        };
    };

    this.onDisconnect = function (id) {
        Logs.log("connection close: id=" + id, Logs.LEVEL_WARNING);
        for (let i in onDisconnectCallbacks) {
            onDisconnectCallbacks[i].call(self, connections[id]);
        }
        delete connections[id];
        //@todo не очень это выглядиты
        prid = null;
    };

    this.executeRequest = function (group, method, args, cntxList) {
        let connectionsKey, i;
        /** Convert object to array. */
        args = Array.prototype.slice.call(args);

        if (!cntxList) cntxList = [{connectionId: null}];

        connectionsKey = '';
        for (i in cntxList) connectionsKey += cntxList[i].connectionId;

        if (CONST_IS_SERVER_SIDE) {
            /** Server */
            Logs.log(connectionsKey + " " + "<< " + group + "." + method + ':' + args.join(','), Logs.LEVEL_DETAIL);
        } else {
            /** Client */
            Logs.log(group + "." + method, Logs.LEVEL_DETAIL, args);
        }

        let packet = {
            group: group,
            method: method,
            args: args
        };
        packet = JSON.stringify(packet);
        let cntxListLength = 0;
        for (i in cntxList) {
            if (!this.sendData(packet, cntxList[i].connectionId)) {
                Logs.log("ApiRouter.failedToSend", Logs.LEVEL_WARNING, {packet: packet, cntx: cntxList[i]});
                for (let j in onFailedSendCallbacks) {
                    onFailedSendCallbacks[j].call(self, cntxList[j]);
                }
            }
            cntxListLength++;
        }
        if (cntxListLength === 0) {
            Logs.log("ApiRouter. Try send to empty contextlist.", Logs.LEVEL_WARNING, {
                packet: packet,
                cntxList: cntxList
            });
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

})();

global['ApiRouter'] = ApiRouter;
