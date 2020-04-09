let FS = require('fs');
let OS = require('os');
let PATH = require('path');
let IMAGE_SIZE = require('image-size');
let UGLIFYJS = require('uglify-js');
let SPRITESMITH = require('spritesmith');

ClientCodeLoader = function () {

    let self = this;
    /**
     * @type {string}
     */
    let imagesPrefix = '/images/';

    /**
     * @type {boolean}
     */
    let reloadClientCodeEveryRequest = null;

    /**
     * Перезагружать ли код картинок каждый раз.
     * @type {boolean}
     */
    let reloadClientImageCodeEveryRequest = null;

    /**
     * Use Sprite image by SpriteSmith
     * @type {boolean}
     */
    let useSpritedImage = true;

    /**
     * Client code VK.
     * @type {string}
     */
    let clientCodeVK = '';

    /**
     * Client code Standalone.
     * @type {string}
     */
    let clientCodeStandalone = '';

    /**
     * Client code for images
     * @type {string}
     */
    let clientImageCode = '';

    let imagesPath;
    /**
     * Инитиализация
     * @type {string}
     */
    let clientCodePath = null;

    let generateImageSpriteResult = null;

    /**
     * Учитвая что SSL Сертификат это тот еще геморой, легче использовать один домен
     * @type {string}
     */
    let projectPrefix = '';

    this.init = function (callback) {
        projectPrefix = Config.Project.name ? '/' + Config.Project.name : '';
        reloadClientCodeEveryRequest = Config.WebSocketServer.reloadClientCodeEveryRequest;
        reloadClientImageCodeEveryRequest = Config.WebSocketServer.reloadClientImageCodeEveryRequest;
        clientCodePath = Config.WebSocketServer.clientCodePath;
        //@todo is it no WebSocketServer config , but is it LogicClientCodeLoader component config.
        imagesPath = Config.WebSocketServer.imagesPath;
        useSpritedImage = Config.WebSocketServer.useSpritedImage;
        // check before after init
        if (typeof reloadClientCodeEveryRequest !== 'boolean') {
            Logs.log("reloadClientCodeEveryRequest given by .setup, must be boolean", Logs.LEVEL_FATAL_ERROR, reloadClientCodeEveryRequest);
        }
        if (typeof clientCodePath !== 'string') {
            Logs.log("clientCodePath given by .setup, must be string", Logs.LEVEL_FATAL_ERROR, clientCodePath);
        }
        if (typeof imagesPath !== 'string') {
            Logs.log("imagesPath given by .setup, must be string", Logs.LEVEL_FATAL_ERROR, imagesPath);
        }
        if (typeof useSpritedImage !== 'boolean') {
            Logs.log("useSpritedImage given by .setup, must be boolean", Logs.LEVEL_FATAL_ERROR, useSpritedImage);
        }
        /* Обновим клиентский код. */
        generateImageSprite(function (result) {
            generateImageSpriteResult = result;
            reloadMainClientCode();
            generateClientCodeVK();
            loadClientCodeStandalone();
            callback();
        });
    };

    this.getClientCodeVK = function (callback) {
        if (Config.Project.maintance) {
            let html;
            html = '';
            html += '\<!DOCTYPE html>\
            <html style="background:white;">\
                <head><meta charset=utf-8></head>\
            <div style="text-align:center;">Игра на техническом обслуживании, пожалуйста зайдите немного позже.</div>\
            </html>\
                ';
            callback(html);
        }
        if (reloadClientCodeEveryRequest) {
            generateClientCodeVK();
            reloadMainClientCode();
        }
        callback(clientCodeVK);
    };

    this.getClientCodeStandalone = function (callback) {
        if (Config.Project.maintance) {
            let html;
            html = '';
            html += '\<!DOCTYPE html>\
            <html style="background:white;">\
                <head><meta charset=utf-8></head>\
            <div style="text-align:center;">Игра на техническом обслуживании, пожалуйста зайдите немного позже.</div>\
            </html>\
                ';
            callback(html);
        }
        if (reloadClientCodeEveryRequest) {
            loadClientCodeStandalone();
            reloadMainClientCode();
        }
        callback(clientCodeStandalone);
    };

    this.getVKCommentsWidget = function (callback) {
        let VKCommentsWidgetCode = "" +
            "<html>" +
            "<head>" +
            "<script type='text/javascript' src='//vk.com/js/api/openapi.js?116'></script>" +
            "<script>VK.init({apiId: " + Config.SocNet.VK.appId + ", onlyWidgets: true});</script>" +
            "</head>" +
            "<body style='margin:0px;'>" +
            "<div id='vk_comments'></div>" +
            "<script type='text/javascript'>" +
            "VK.Widgets.Comments('vk_comments', {limit: 5, height: " + (Config.VKCommentWidget.height).toString() + ", width: " + (Config.VKCommentWidget.width).toString() + ", attach: '*', pageUrl: 'http://vk.com/app" + Config.SocNet.VK.appId + "'});" +
            "</script>" +
            "</body>" +
            "</html>";
        callback(VKCommentsWidgetCode);
    };

    this.reloadClientCode = function (callback) {
        reloadMainClientCode();
        generateClientCodeVK();
        loadClientCodeStandalone();
        callback('<pre>' + "Reload Client Code executed!" + new Date().getTime() + '</pre>');
    };

    let getClientCodeCommonPart = function (socNetCode) {
        let code = '', getParams = '';

        let demension = IMAGE_SIZE('../public/images/sprite.png');

        code += "<!doctype html>";
        code += "<html style=\"background:white;\">\r\n";
        code += "<head>\r\n";
        code += "<style type='text/css'>*{padding:0px;margin:0px;}</style>";
        code += "<meta charset='utf-8' />\r\n";
        code += "<style> body div { background-size: "
            + translate2X(demension.width / 2) + "px "
            + translate2X(demension.height / 2) + "px; " +
            "}</style>";
        code += "<script>window.PLATFORM_ID = '" + socNetCode + "';</script>";
        getParams += Config.Project.develop ? "?" : "?t=" + (new Date().getTime()).toString();
        code += "<script type='text/javascript' src=" + projectPrefix + "/js/client.js" + getParams + "'></script>\r\n";
        code += "</head>";
        code += "<body>";
        /** Application div */
        code += "<div style='" +
            "height:" + DataCross.application.height + "px;" +
            "width:" + DataCross.application.width + "px;" +
            "position:absolute;" +
            "top:0px;' " +
            "id='applicationArea' ></div>\r\n";
        /** Wizard div */
        code += "<canvas style='" +
            "height:" + DataCross.application.height + "px;" +
            "width:" + DataCross.application.width + "px;" +
            "position:absolute;" +
            "top:0px;' " +
            "id='wizardArea' ></canvas>\r\n";
        code += getClientImageCode();

        if (socNetCode === 'VK') {
            /** @see https://vk.com/dev/Javascript_SDK */
            code += "<script src='//vk.com/js/api/xd_connection.js?2' type='text/javascript'></script>\r\n";

            /** comments div */
            code += "<div id='vk_comments' style='top:" + DataCross.application.height + "px;position:absolute;'>";
            code += "<iframe src='" + projectPrefix + "/service/VKCommentsWidget' style='border:none; height: " + (Config.VKCommentWidget.height + 44) + "px; width:" + Config.VKCommentWidget.width + ";'></iframe>";
            code += "</div>\r\n";
        }

        code += "</body>";
        code += "</html>";
        return code;
    };

    let generateClientCodeVK = function () {
        Logs.log("Load VK client code.");
        clientCodeVK = getClientCodeCommonPart('VK');
    };

    /**
     * Загрузка клиенсткого кода для стэндэлон версии.
     */
    let loadClientCodeStandalone = function () {
        Logs.log("Load standalone client code.");
        clientCodeStandalone = getClientCodeCommonPart('STANDALONE');
    };

    /**
     * Перезагрузка основного кода клиента.
     */
    let reloadMainClientCode = function () {
        let mainClientJSCode;
        mainClientJSCode = getMainClientJSCode();
        //@todo path to JS move to Config file

        //@todo LogicClintCodeloader.config?
        if (Config.WebSocketServer.compressJSClientCode) {
            mainClientJSCode = 'function ___(){ ' + mainClientJSCode + ' };___();';
            let result = UGLIFYJS.minify(mainClientJSCode);
            if (result.code) {
                mainClientJSCode = result.code;
            } else {
                Logs.log("no code minimized", Logs.LEVEL_WARNING);
            }
        }
        //@todo path to JS move to Config file
        FS.writeFileSync(CONST_DIR_ROOT + '/public/js/client.js', mainClientJSCode);
        Logs.log("Main client code writed", Logs.LEVEL_DETAIL);
    };

    /**
     * @param files[]
     */
    let clientCodePrepareCode = function (files) {
        let path, file_content, name, code;
        code = '';
        for (let i in files) {
            path = files[i];
            file_content = FS.readFileSync(path);
            if (file_content == 'ClientServerCompliant') {
                path = path.replace(clientCodePath, '');
                file_content = FS.readFileSync(path);
            }
            code += "\r\n/* " + path + " */\r\n";
            code += file_content;
            name = PATH.basename(path, '.js');
            code += 'if(window["' + name + '"] != undefined){' + 'window["' + name + '"].__path="' + path + '"};\r\n';
        }
        return code;
    };

    /**
     * Собирает основной JS код клиента.
     * Этот код одинаков для всех социальных сетей(платформ).
     */
    let getMainClientJSCode = function () {
        let jsFiles, hostname, clientConfigPath, code;
        jsFiles = [];
        jsFiles = jsFiles.concat(getFileListRecursive(clientCodePath + 'core/'));
        jsFiles = jsFiles.concat(getFileListRecursive(clientCodePath + 'components/'));
        /* Include Config file. */
        hostname = OS.hostname();
        let parentFolderName = (function () {
            let cwd;
            cwd = process.cwd().split(PATH.sep);
            cwd.pop();
            return cwd.pop();
        })();
        clientConfigPath = clientCodePath + 'config.' + hostname + '.' + parentFolderName + '.js';
        Logs.log("Generate client code(client). The config file: " + clientConfigPath, Logs.LEVEL_NOTIFY);
        jsFiles.push(clientConfigPath);
        jsFiles.push(clientCodePath + '/run.js');
        code = clientCodePrepareCode(jsFiles);
        /* generate sapi */
        code += ApiRouter.getSAPIJSCode();
        code += getGUIGeneratedCode();
        return code;
    };

    let getClientImageCode = function () {
        if (useSpritedImage) {
            return getClientImageCodeSprited();
        } else {
            return getClientImageCodeImageList();
        }
    };

    let getClientImageCodeSprited = function () {
        let imageCode, path, timePostfix;
        let spriteJsonPath = '../public/images/sprite.png.json';
        if (!reloadClientImageCodeEveryRequest && clientImageCode) {
            return clientImageCode;
        }
        if (generateImageSpriteResult === true) {
            imageCode = FS.readFileSync(spriteJsonPath);
        } else {
            imageCode = "<script>";
            imageCode += "imagesData = {};";
            //@todo remove it! fo production
            timePostfix = "?t=1";// + new Date().getTime();
            for (let i in generateImageSpriteResult.coordinates) {
                path = i.replace('../public', '');
                imageCode += "\r\nimagesData['" + path + "']={" + "" +
                    "path:'" + projectPrefix + '/images/sprite.png' + timePostfix + "'," +
                    "w:" + translate2X(generateImageSpriteResult.coordinates[i].width) + "," +
                    "h:" + translate2X(generateImageSpriteResult.coordinates[i].height) + "," +
                    "x:" + translate2X(generateImageSpriteResult.coordinates[i].x) + "," +
                    "y:" + translate2X(generateImageSpriteResult.coordinates[i].y) + "" +
                    "};";
            }
            imageCode += "</script>";
            imageCode += "<div style='display:none;'>";
            imageCode += "<img src='" + projectPrefix + '/images/sprite.png' + timePostfix + "'>";
            imageCode += "</div>";
            FS.writeFileSync(spriteJsonPath, imageCode);
            // cache it
            clientImageCode = imageCode;
        }
        return imageCode;
    };

    /**
     * Формирует Js-код картинок.
     */
    let getClientImageCodeImageList = function () {
        let imageFiles, imageCode, path, timePostfix, demension;
        if (!reloadClientImageCodeEveryRequest && clientImageCode) {
            return clientImageCode;
        }
        imageFiles = getFileListRecursive(imagesPath);
        imageCode = "<script>";
        imageCode += "imagesData = {};";
        timePostfix = "?t=" + new Date().getTime();
        //@todo remove it! fo production
        timePostfix = "?t=1";
        for (let i in imageFiles) {
            path = imagesPrefix + imageFiles[i].substr(imagesPath.length);
            demension = IMAGE_SIZE(imageFiles[i]);
            imageCode += "\r\nimagesData['" + path + "']=" +
                "{path:'" + projectPrefix + path + timePostfix + "'" +
                ",w:" + translate2X(demension.width) +
                ",h:" + translate2X(demension.height) +
                ",x:" + 0 +
                ",y:" + 0 +
                "};";
        }
        imageCode += "</script>";
        imageCode += "<div style='display:none;'>";
        for (let i in imageFiles) {
            path = imagesPrefix + imageFiles[i].substr(imagesPath.length);
            imageCode += "\r\n<img src='" + projectPrefix + path + timePostfix + "'>";
        }
        imageCode += "</div>";
        // cache it
        clientImageCode = imageCode;
        return imageCode;
    };

    let getFileListRecursive = function (basePath) {
        let dirList, path, files;
        files = [];
        dirList = FS.readdirSync(basePath);
        for (let i in dirList) {
            /**@todo .js extenstion must be */
            if (dirList[i] === '.gitkeep') continue;
            if (dirList[i] === '.gitignore') continue;
            if (dirList[i] === 'sprite.png') continue;
            if (dirList[i] === 'sprite.png.json') continue;
            path = basePath + dirList[i];
            if (FS.statSync(path).isDirectory()) {
                files = files.concat(getFileListRecursive(path + '/'));
            } else {
                files.push(path);
            }
        }
        return files;
    };

    let generateImageSpriteLoaded = false;

    let generateImageSprite = function (callback) {
        let sprites, spritePath;

        if (generateImageSpriteLoaded) return;
        generateImageSpriteLoaded = true;
        spritePath = '../public/images/sprite.png';

        sprites = getFileListRecursive(imagesPath);

        if (!Config.WebSocketServer.useSpritedImage) {
            Logs.log("SPRITESMITH SKIP", Logs.LEVEL_NOTIFY);
            callback(false);
            return;
        }

        Logs.log("SPRITESMITH BEGIN", Logs.LEVEL_NOTIFY);

        /**
         *@todo
         * Calculate hash, if no changes - skip it!
         */

        SPRITESMITH.run({src: sprites}, function handleResult(err, result) {
            // result.image; // Buffer representation of image
            // result.coordinates; // Object mapping filename to {x, y, width, height} of image
            // result.properties; // Object with metadata about spritesheet {width, height}
            if (err) {
                console.log(err);
            }
            // coordinates: ['../public/images/buttons/addFriendActive.png': { x: 75, y: 1353, width: 75, height: 80 },
            //'../public/images/buttons/addFriendHover.png': { x: 150, y: 1353, width
            if (FS.existsSync(spritePath)) {
                FS.unlink(spritePath);
            }

            let fsResult = FS.writeFileSync(spritePath, result.image, 'binary');
            Logs.log("SPRITESMITH Complete", Logs.LEVEL_NOTIFY);
            callback(result);
        });
    };

    let getGUIGeneratedCode = function () {

        /*
         1 - get PageBlock folder files
         2 - for each generate add block code
         */
        let files, guiCode, pageBlocks, name;
        guiCode = '';
        guiCode += 'GUI.init();' + "\r\n";
        pageBlocks = [];
        // page-blocks
        files = getFileListRecursive(clientCodePath + 'components/application/page_blocks/');
        files.forEach(function (filePath) {
            name = PATH.basename(filePath, '.js');
            if (name.substr(0, 9) === 'PageBlock') {
                pageBlocks.push(name);
            }
        });
        guiCode += ' PageController.addBlocks([' + pageBlocks.join(',') + ']);' + "\r\n";
        // pages
        files = getFileListRecursive(clientCodePath + 'components/application/pages/');
        files.forEach(function (filePath) {
            name = PATH.basename(filePath, '.js');
            if (name.substr(0, 4) === 'Page') {
                guiCode += ' ' + name + '.init();' + "\r\n";
            }

        });

        return 'document.addEventListener("DOMContentLoaded", function() {' + guiCode + '});';
    };

    let translate2X = function (value) {
        return value / 2;
    };
};

ClientCodeLoader = new ClientCodeLoader;

ClientCodeLoader.depends = ['Logs', 'Profiler', 'SocNet', 'WebSocketServer'];