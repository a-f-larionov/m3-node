/**
 * Loader:
 * 1 - declare core constants
 * 2 - declare core functions
 * 3 - include config file
 * 4 - call code-generators
 * 5 - include components
 * - - call .preInit()
 * - - call .init()
 * 6 - execute generated code
 * 7 - call main();
 */

/* Include nodeJS modules. */
let FS = require('fs');
let PATH = require('path');
let OS = require('os');

loader = new Loader();
console.log('step 1 - include constants');
/* step 1 - include constants */
loader.includeConstants();
console.log('step 2 - include functions');
/* step 2 - include functions */
loader.includeFunctions();
log('step 3 - include config file');
/* step 3 - include config file */
loader.includeConfig();
log('step 4 - include components');
/* step 4 - include components */
loader.includeComponents();
log('step 5 - call generators');
/* step 5 - call generators */
loader.callGenerators();
log('step 6 - call components preinit and init');
/* step 6 - call components preinit and init */
loader.initComponents(function () {
    log('step 7 - execute generated code');
    /* step 7 - execute generated code */
    loader.executeGeneratedCode();
    log('step 8 - call main function');
    /* step 8 - call main function */
    loader.callMainFunction();
});


/**
 * Определить имя компонента по пути к нему.
 * @param path путь к файлу компоненат.
 * @returns string имя компонента.
 */
function getComponentNameFromPath(path) {
    return PATH.basename(path).replace('.js', '');
}

function Loader() {

    let generatedCode = '';

    let componentsMap = '';

    this.includeConstants = function () {

        /* 1 - declare core constants */
        require('./constants.js');
    };

    this.includeFunctions = function () {

        /* 2 - declare code functions */
        require('./functions.js');
    };

    this.includeConfig = function () {
        let hostname = OS.hostname();
        let configPath = './../config.' + hostname + '.' + CONST_PROJECT_FOLDER_NAME + '.js';
        log("Config file: " + configPath);
        require(configPath);
    };

    this.includeComponents = function () {
        let componentsMap = loader.getComponentsMap();
        loader.includeComponentsByMap(componentsMap);
    };

    this.callGenerators = function () {
        let code, name;
        code = '';
        for (name in componentsMap) {
            if (global[name].generate) {
                code += global[name].generate();
            }
        }
        generatedCode = code;
    };

    this.executeGeneratedCode = function () {
        FS.writeFileSync(CONST_DIR_SERVER + '/core/generated.js', generatedCode);
        require(CONST_DIR_SERVER + '/core/generated.js');
    };

    this.callMainFunction = function () {

        /** Execute main function. */
        LogicMain.main();
    };

    this.getComponentsMap = function () {
        let map;
        map = [];
        /**
         * Рекурсивное подключение всех файлов.
         * @param path
         */
        let scanRecursive = function (path) {
            let list;
            list = FS.readdirSync(path);
            for (let i in list) {
                //@TODO *.js extension must be
                if (list[i] === '.gitkeep') continue;
                if (list[i] === '.gitignore') continue;
                if (FS.statSync(path + list[i]).isDirectory()) {
                    scanRecursive(path + list[i] + '/');
                } else {
                    map[getComponentNameFromPath(path + list[i])] = path + list[i];
                }
            }
        };
        scanRecursive(CONST_DIR_COMPONENTS);
        return map;
    };

    this.includeComponentsByMap = function (map) {
        let name;
        let mapLength = 0, newMapLength = 0;
        for (name in map) {
            mapLength++;
            this.includeComponentByPath(map[name]);
        }
        // sort by depends
        let dependsMap = [];
        while (mapLength !== newMapLength) {
            for (name in map) {

                if (dependsMap[name]) continue;

                if (global[name].depends) {
                    let depends, dependsAll, dependsInNewMap;
                    depends = global[name].depends;
                    dependsAll = global[name].depends.length;
                    dependsInNewMap = 0;
                    for (let i in depends) {
                        if (dependsMap[depends[i]]) {
                            dependsInNewMap++;
                        }
                    }
                    if (dependsInNewMap === dependsAll) {
                        dependsMap[name] = map[name];
                        newMapLength++;
                    }
                } else {
                    dependsMap[name] = map[name];
                    newMapLength++;
                }
            }
        }

        componentsMap = dependsMap;
    };

    /**
     * Подключение компонента по пути.
     * @param path путь к файлу компонента.
     */
    this.includeComponentByPath = function (path) {
        /**
         * Проверка компонента.
         * @param path {string} путь к файлу компонента.
         */
        let validateComponent = function (path) {
            let name;
            name = getComponentNameFromPath(path);
            if (!global[name]) {
                error("Файл компонента должен содержать определение компонента." +
                    "\r\nфайл: " + path + "" +
                    "\r\nкомпонент: " + name);
            }
            if (!(typeof global[name] == 'function' || typeof global[name] == 'object')) {
                error("Определение компонента должно иметь тип function." +
                    "\r\nфайл: " + path + "" +
                    "\r\nкомпонент: " + name);
            }
        };

        path = PATH.resolve(path);
        //@todo is it detail level
        //log("Include component:" + /*getComponentNameFromPath(path) +*/ '(' + path + ')');
        require(path);
        validateComponent(path);
        global[getComponentNameFromPath(path)].__path = path;
    };


    this.initComponents = function (callback) {
        let name;
        log('step 6.1 - call preInit');
        // preinit
        for (name in componentsMap) {
            if (global[name].preInit) {
                sequencedInit(global[name].preInit);
            }
        }
        sequencedInit(function (afterInitCallback) {
            Logs.log("Pre init finished.", Logs.LEVEL_NOTIFY);
            afterInitCallback();
        });
        log('step 6.2 - call init');
        // init
        for (name in componentsMap) {
            if (global[name].init) {
                sequencedInit(global[name].init);
            }
        }
        sequencedInit(function (afterInitCallback) {
            Logs.log("Server is running full.", Logs.LEVEL_ALERT);
            afterInitCallback();
            callback();
        });
    }
};
