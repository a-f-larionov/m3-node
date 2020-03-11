var FS, PATH;
if (CONST_IS_SERVER_SIDE) {
    FS = require('fs');
    PATH = require('path');
}

/**
 * ApiRouter
 * Cross-side component.
 * @constructor
 */
ApiRouter = new (function () {
    let self = this;

    let map;

    let connections = {};
    let onDisconnectCallbacks = [];
    let onFailedSendCallbacks = [];

    /**
     * Set API Map
     * @param newMap
     */
    this.setMap = function (newMap) {
        map = newMap;
    };

    /**
     * Process requests.
     * @param packet {string} пакет данных, фомат:JSON, {group:string, method:string, args:[...]}
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
        if (typeof packet !== 'object') {
            Logs.log("Wrong data: packet must be 'object'", Logs.LEVEL_WARNING, packet);
            return;
        }
        if (packet.group === undefined) {
            Logs.log("Wrong data: packet must have .group", Logs.LEVEL_WARNING, packet);
            return;
        }
        if (typeof packet.group !== 'string') {
            Logs.log("Wrong data: packet.group must have type 'string'", Logs.LEVEL_WARNING, packet);
            return;
        }
        if (packet.method === undefined) {
            Logs.log("Wrong data: packet must have .method", Logs.LEVEL_WARNING, packet);
            return;
        }
        if (typeof packet.method !== 'string') {
            Logs.log("Wrong data: packet.method must have type 'string'", Logs.LEVEL_WARNING, packet);
            return;
        }
        if (packet.args === undefined) {
            Logs.log("Wrong data: packet must have .args", Logs.LEVEL_WARNING, packet);
            return;
        }
        if (typeof packet.args !== 'object') {
            Logs.log("Wrong data: packet.args must have type 'object'", Logs.LEVEL_WARNING, packet);
            return;
        }

        group = packet.group;
        method = packet.method;
        args = packet.args;

        if (map[group] === undefined) {
            Logs.log("Wrong data: group not found " + group, Logs.LEVEL_WARNING, packet);
            return;
        }
        if (map[group][method] === undefined) {
            Logs.log("Wrong data: method not found " + method, Logs.LEVEL_WARNING, packet);
            return;
        }
        // добавим к аргументам контекст соединения.
        args.unshift(connections[id]);
        // выполним запрашиваемый метод.
        let connectionsKey;
        connectionsKey = '';
        if (id) connectionsKey = id;

        Logs.log(id + " " + ">> " + group + "." + method + ':' + JSON.stringify(args), Logs.LEVEL_DETAIL);

        /* group_method.counter ++ */
        map[group][method].apply(self, args);
    };

    this.onConnect = function (id) {
        Logs.log("connection created: id=" + id, Logs.LEVEL_DETAIL);
        connections[id] = {
            connectionId: id
        };
    };

    this.onDisconnect = function (id) {
        Logs.log("connection close: id=" + id, Logs.LEVEL_DETAIL);
        for (let i in onDisconnectCallbacks) {
            onDisconnectCallbacks[i].call(self, connections[id]);
        }
        delete connections[id];
    };

    this.executeRequest = function (group, method, args, cntxList) {
        let connectionsKey, i;
        /* Convert object to array. */
        args = Array.prototype.slice.call(args);

        if (!cntxList) {
            cntxList = [{connectionId: null}];
        }
        connectionsKey = '';
        for (i in cntxList) {
            connectionsKey += cntxList[i].connectionId;
        }
        Logs.log(connectionsKey + " " + "<< " + group + "." + method + ':' + args.join(','), Logs.LEVEL_DETAIL);

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

    /**
     * авто-код для клиента.
     * @returns {string}
     */
    this.getSAPIJSCode = function () {
        let code, group, method;
        code = '';
        let pureData;
        pureData = {};
        if (!map) {
            map = getSAPIMap();
        }
        for (group in map) {
            for (method in global[group]) {
                if (typeof global[group][method] !== 'function') continue;
                if (!pureData[group]) {
                    pureData[group] = {};
                }
                pureData[group][method] = true;
            }
        }
        for (group in pureData) {
            code += "" + group + " = function(){\r\n";
            for (method in pureData[group]) {
                code += "\tthis." + method + " = function(){\r\n";
                code += "\t\tApiRouter.executeRequest('" + group + "' ,'" + method + "', arguments);\r\n";
                code += "\t};\r\n";
            }
            code += "};\r\n";
            code += group + " = new " + group + "();\r\n";
        }
        // api router map для клиента CAPI : CAPI

        code += 'ApiRouter.map2 = {\r\n';
        for (group in pureData) {
            code += '\t' + group + ' : ' + group + ',\r\n';
        }
        // remove last symbol
        code = code.substr(0, code.length - 1);
        code += '};\r\n';
        return code;
    };


    /* Generators part */
    this.generate = function () {

        generateCAPIComponents(getCAPIMap());

        return generateSAPIMapCode(getSAPIMap());
    };

    this.generateClient = function () {
        let groupName, map;

        map = getCAPIMap();
        // for client
        // формирование карты для ApiRouter. { CAPI*: CAPI*, ... }
        let code2 = '';
        code2 += 'ApiRouter.map = {\r\n';
        for (groupName in map) {
            code2 += '\t' + groupName + ' : ' + groupName + ',\r\n';
        }
        // remove last symbol
        code2 = code2.substr(0, code2.length - 1);
        code2 += '};\r\n';
        code2 = 'document.addEventListener("DOMContentLoaded", function() {' + code2 + '})';
    };

    /**
     * Generate capi map from exist code.
     * @returns {*}
     */
    let getCAPIMap = function () {
        let path, list, groupName, methodName, map, tmp;
        path = CONST_DIR_CLIENT + 'components/application/capi/';
        list = FS.readdirSync(path);
        map = {};
        for (let i in list) {
            /**@todo .js extenstion must be */
            if (list[i] === '.gitkeep') continue;
            if (list[i] === '.gitignore') continue;
            groupName = getComponentNameFromPath(path + list[i]);
            tmp = null;
            if (global[groupName]) {
                tmp = global[groupName];
            }
            require(path + list[i]);
            map[groupName] = [];
            for (methodName in global[groupName]) {
                if (typeof global[groupName][methodName] === 'function') {
                    map[groupName][methodName] = true;
                }
            }
            if (tmp) {
                global[groupName] = tmp;
            }
        }
        return map;
    };

    /**
     * Generate sapi map from exist code.
     * @returns {*}
     */
    let getSAPIMap = function () {
        let path, list, groupName, methodName, map;
        path = CONST_DIR_COMPONENTS + '/application/sapi/';
        list = FS.readdirSync(path);
        map = {};
        for (let i in list) {
            /**@todo .js extenstion must be */
            if (list[i] == '.gitkeep') continue;
            if (list[i] == '.gitignore') continue;
            groupName = getComponentNameFromPath(path + list[i]);
            require(path + list[i]);
            map[groupName] = [];
            for (methodName in global[groupName]) {
                if (typeof global[groupName][methodName] === 'function') {
                    map[groupName][methodName] = true;
                }
            }
        }
        return map;
    };

    let getComponentNameFromPath = function (path) {
        return PATH.basename(path).replace('.js', '');
    };

    /**
     *
     * @param map
     */
    let generateSAPIMapCode = function (map) {
        let groupName, code;
        code = '';
        code += ' ApiRouter.setMap({\r\n';
        for (groupName in map) {
            code += "\t" + groupName + ":" + groupName + ",\r\n";
        }
        code += "});\r\n";
        return code;
    };

    /**
     *
     */
    let generateCAPIComponents = function (map) {
        let groupName, methodName;
        let code = '';
        for (groupName in map) {
            /*@todo must .js extension*/
            if (groupName == '.gitkeep') continue;
            if (groupName == '.gitignore') continue;
            code = '';
            code += groupName + ' = function(){\r\n\r\n';
            for (methodName in map[groupName]) {
                code += '\tthis.' + methodName + ' = function(){\r\n\r\n';
                code += '\t\tlet args, toUserId;\r\n';
                code += '\t\targs = Array.prototype.slice.call(arguments);\r\n';
                code += '\t\ttoUserId = args.shift();\r\n';
                code += '\t\tLogicUser.sendToUser(toUserId, "' + groupName + '", "' + methodName + '", args);\r\n';
                code += '\t};\r\n\r\n';
            }
            code += '};\r\n';
            code += groupName + ' = new ' + groupName + '();\r\n';
            FS.writeFileSync(CONST_DIR_COMPONENTS + 'generated/' + groupName + '.js', code);
        }
    };
})();