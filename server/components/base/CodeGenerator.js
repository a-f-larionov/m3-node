var FS, PATH;
if (CONST_IS_SERVER_SIDE) {
    FS = require('fs');
    PATH = require('path');
}

CodeGenerator = function () {

    this.generate = function () {
        generateCAPIComponents(getCAPIMap());

        return generateSAPIMapCode(this.getSAPIMap());
    };

    /**
     * Generate capi map from exist code.
     * @returns {*}
     * @todo move out
     */
    let getCAPIMap = function () {
        let path, list, capiName, methodName, map, capiObject, file_content;
        path = CONST_DIR_CLIENT + 'components/application/capi/';
        list = FS.readdirSync(path);
        map = {};
        list.forEach(function (fileName) {
            /**@todo .js extenstion must be */
            if (fileName === '.gitkeep') return;
            if (fileName === '.gitignore') return;
            capiName = getComponentNameFromPath(path + fileName);

            file_content = FS.readFileSync(path + fileName).toString();

            capiObject = eval(file_content.toString());

            map[capiName] = [];

            for (let methodName in capiObject) {
                if (!capiObject.hasOwnProperty(methodName)) return

                if (typeof capiObject[methodName] === 'function') {
                    map[capiName][methodName] = true;
                }
            }
        });
        return map;
    };

    /**
     * @todo move out
     */
    let generateCAPIComponents = function (map) {
        let groupName, methodName;
        let code = '';
        for (groupName in map) {
            /*@todo must .js extension*/
            if (groupName === '.gitkeep') continue;
            if (groupName === '.gitignore') continue;
            code = '';
            code += groupName + ' = function(){\r\n\r\n';
            for (methodName in map[groupName]) {
                code += '\tthis.' + methodName + ' = function(){\r\n\r\n';
                code += '\t\tlet args, toUserId;\r\n';
                code += '\t\targs = Array.prototype.slice.call(arguments);\r\n';
                code += '\t\ttoUserId = args.shift();\r\n';
                code += '\t\tLogicConnection.sendToUser(toUserId, "' + groupName + '", "' + methodName + '", args);\r\n';
                code += '\t};\r\n\r\n';
            }
            code += '};\r\n';
            code += groupName + ' = new ' + groupName + '();\r\n';
            FS.writeFileSync(CONST_DIR_COMPONENTS + 'generated/' + groupName + '.js', code);
        }
    };

    /**
     * @todo move out
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
     * Generate sapi map from exist code.
     * @returns {*}
     * @todo move out
     */
    this.getSAPIMap = function () {
        let path, list, groupName, methodName, map;
        path = CONST_DIR_COMPONENTS + '/application/sapi/';
        list = FS.readdirSync(path);
        map = {};
        for (let i in list) {
            /**@todo .js extenstion must be */
            if (list[i] === '.gitkeep') continue;
            if (list[i] === '.gitignore') continue;
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

    /**
     *      * @todo move out
     * @param path
     * @returns {void | string | *}
     */
    let getComponentNameFromPath = function (path) {
        return PATH.basename(path).replace('.js', '');
    };

    let map;

    /**
     * авто-код для клиента.
     * @returns {string}
     * @todo moveout
     */
    this.getSAPIJSCode = function () {
        let code, group, method;
        code = '';
        let pureData;
        pureData = {};
        if (!map) {
            map = CodeGenerator.getSAPIMap();
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
            code += "let " + group + " = function(){\r\n";
            for (method in pureData[group]) {
                code += "\tthis." + method + " = function(){\r\n";
                code += "\t\tApiRouter.executeRequest('" + group + "' ,'" + method + "', arguments);\r\n";
                code += "\t};\r\n";
            }
            code += "};\r\n";
            code += group + " = new " + group + "();\r\n";
        }
        // api router map для клиента CAPI : CAPI

        /*code += 'ApiRouter.map2 = {\r\n';
        for (group in pureData) {
            code += '\t' + group + ' : ' + group + ',\r\n';
        }
        // remove last symbol
        code = code.substr(0, code.length - 1);
        code += '};\r\n';

         */
        return code;
    };
};

CodeGenerator = new CodeGenerator();