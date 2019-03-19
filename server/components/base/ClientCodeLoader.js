var FS = require('fs');
var OS = require('os');
var PATH = require('path');
var IMAGE_SIZE = require('image-size');
var UGLIFYJS = require('uglify-js');
var SPRITESMITH = require('spritesmith');

ClientCodeLoader = function () {

    var self = this;
    /**
     * @type {string}
     */
    var imagesPrefix = '/images/';

    /**
     * @type {boolean}
     */
    var reloadClientCodeEveryRequest = null;

    /**
     * Перезагружать ли код картинок каждый раз.
     * @type {boolean}
     */
    var reloadClientImageCodeEveryRequest = null;

    /**
     * Use Sprite image by SpriteSmith
     * @type {boolean}
     */
    var useSpritedImage = true;

    /**
     * Client code VK.
     * @type {string}
     */
    var clientCodeVK = '';

    /**
     * Client code Standalone.
     * @type {string}
     */
    var clientCodeStandalone = '';

    /**
     * Client code for images
     * @type {string}
     */
    var clientImageCode = '';

    var imagesPath;
    /**
     * Инитиализация
     * @type {string}
     */
    var clientCodePath = null;

    var generateImageSpriteResult = null;

    /**
     * Учитвая что SSL Сертификат это тот еще геморой, легче использовать один домен
     * @type {string}
     */
    var projectPrefix = '';

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
            loadClientCodeVK();
            loadClientCodeStandalone();
            callback();
        });
    };

    this.getClientCodeVK = function (callback) {
        if (Config.Project.maintance) {
            var html;
            html = '';
            html += '\<!DOCTYPE html>\
            <html>\
                <head><meta charset=utf-8></head>\
            <div style="text-align:center;">Игра на техническом обслуживании, пожалуйста зайдите немного позже.</div>\
            </html>\
                ';
            callback(html);
        }
        if (reloadClientCodeEveryRequest) {
            loadClientCodeVK();
            //reloadMainClientCode();
        }
        callback(clientCodeVK);
    };

    this.getClientCodeStandalone = function (callback) {
        if (Config.Project.maintance) {
            var html;
            html = '';
            html += '\<!DOCTYPE html>\
            <html>\
                <head><meta charset=utf-8></head>\
            <div style="text-align:center;">Игра на техническом обслуживании, пожалуйста зайдите немного позже.</div>\
            </html>\
                ';
            callback(html);
        }
        if (reloadClientCodeEveryRequest) {
            loadClientCodeStandalone();
            //reloadMainClientCode();
        }
        callback(clientCodeStandalone);
    };

    this.getVKCommentsWidget = function (callback) {
        var VKCommentsWidgetCode = "" +
            "<html>" +
            "<head>" +
            "<script type='text/javascript' src='//vk.com/js/api/openapi.js?116'></script>" +
            "<script>VK.init({apiId: " + Config.SocNet.appId + ", onlyWidgets: true});</script>" +
            "</head>" +
            "<body style='margin:0px;'>" +
            "<div id='vk_comments'></div>" +
            "<script type='text/javascript'>" +
            "VK.Widgets.Comments('vk_comments', {limit: 5, height: " + (Config.VKCommentWidget.height).toString() + ", width: " + (Config.VKCommentWidget.width).toString() + ", attach: '*', pageUrl: 'http://vk.com/app" + Config.SocNet.appId + "'});" +
            "</script>" +
            "</body>" +
            "</html>";
        callback(VKCommentsWidgetCode);
    };

    this.reloadClientCode = function (callback) {
        reloadMainClientCode();
        loadClientCodeVK();
        loadClientCodeStandalone();
        callback('<pre>' + "Reload Client Code executed!" + new Date().getTime() + '</pre>');
    };

    var loadClientCodeVK = function () {
        var code;
        Logs.log("Load vk client code.");
        //@todo сделать тут HTML5
        code = "";
        code += "<HTML>\r\n";
        code += "<HEAD>\r\n";
        code += "<meta charset='utf-8' />\r\n";
        code += "<script src='//vk.com/js/api/xd_connection.js?2' type='text/javascript'></script>\r\n";
        code += "<script>window.PLATFORM_ID = 'VK';</script>";
        code += "<script type='text/javascript' src=" + projectPrefix + "/js/MainClientCode.js?t=" + (new Date().getTime()).toString() + "'></script>\r\n";
        code += "</HEAD><BODY style='margin:0px;'>\r\n";
        code += getClientImageCode();
        /* application div */
        code += "<div style='" +
            "height:" + Config.Project.applicationAreaHeight + "px;" +
            "width:" + Config.Project.applicationAreaWidth + "px;" +
            "position:absolute;" +
            "top:10px;' " +
            "id='applicationArea' ></div>\r\n";

        /* comments div */
        code += "<div style='top:" + Config.Project.applicationAreaHeight + "px;position:absolute;'>";
        code += "<iframe src='" + projectPrefix + "/service/VKCommentsWidget' style='border:none; height: " + (Config.VKCommentWidget.height + 44) + "px; width:" + Config.VKCommentWidget.width + ";'></iframe>";
        code += "</div>\r\n";
        code += "</BODY></HTML>";
        clientCodeVK = code;
    };

    /**
     * Загрузка клиенсткого кода для стэндэлон версии.
     */
    var loadClientCodeStandalone = function () {
        Logs.log("Load standalone client code.");
        var code;
        code = "";
        code += "<!doctype html>";
        code += "<html>";
        code += "<head>";
        code += "<style type='text/css'>*{padding:0px;margin:0px;}</style>";
        code += "<meta charset='utf-8' />";
        code += "<script>window.PLATFORM_ID = 'STANDALONE';</script>";
        code += "<script src='" + projectPrefix + "/js/MainClientCode.js?t=" + (new Date().getTime()).toString() + "'></script>\r\n";
        code += "</head>";
        code += "<body>";
        code += "<div style='" +
            "height:" + Config.Project.applicationAreaHeight + "px;" +
            "width:" + Config.Project.applicationAreaWidth + "px;" +
            "position:absolute;' " +
            "id='applicationArea' ></div>\r\n";
        code += getClientImageCode();
        code += "</body>";
        code += "</html>";

        clientCodeStandalone = code;
    };

    /**
     * Перезагрузка основного кода клиента.
     */
    var reloadMainClientCode = function () {
        var mainClientJSCode;
        mainClientJSCode = getMainClientJSCode();
        //@todo path to JS move to Config file

        //@todo LogicClintCodeloader.config?
        if (Config.WebSocketServer.compressJSClientCode) {
            mainClientJSCode = 'function ___(){ ' + mainClientJSCode + ' };___();';
            var result = UGLIFYJS.minify(mainClientJSCode);
            if (result.code) {
                mainClientJSCode = result.code;
            }
            else {
                Logs.log("no code minimized", Logs.LEVEL_WARNING);
            }
        }
        //@todo path to JS move to Config file
        FS.writeFileSync(CONST_DIR_ROOT + '/public/js/MainClientCode.js', mainClientJSCode);
        Logs.log("Main client code writed", Logs.LEVEL_DETAIL);
    };

    /**
     * @param files[]
     */
    var clientCodePrepareCode = function (files) {
        var path, file_content, name, code;
        code = '';
        for (var i in files) {
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
    var getMainClientJSCode = function () {
        var jsFiles, hostname, clientConfigPath, code;
        jsFiles = [];
        jsFiles = jsFiles.concat(getFileListRecursive(clientCodePath + 'core/'));
        jsFiles = jsFiles.concat(getFileListRecursive(clientCodePath + 'components/'));
        /* Include Config file. */
        hostname = OS.hostname();
        var parentFolderName = (function () {
            var cwd;
            cwd = process.cwd().split(PATH.sep);
            cwd.pop();
            return cwd.pop();
        })();
        clientConfigPath = clientCodePath + 'config.' + hostname + '.' + parentFolderName + '.js';
        Logs.log("Generate client code(MainClientCode). The config file: " + clientConfigPath, Logs.LEVEL_NOTIFY);
        jsFiles.push(clientConfigPath);
        jsFiles.push(clientCodePath + '/run.js');
        code = clientCodePrepareCode(jsFiles);
        /* generate sapi */
        code += ApiRouter.getSAPIJSCode();
        code += getGUIGeneratedCode();
        return code;
    };

    var getClientImageCode = function () {
        if (useSpritedImage) {
            return getClientImageCodeSprited();
        } else {
            return getClientImageCodeImageList();
        }
    };

    var getClientImageCodeSprited = function () {
        var imageCode, path, timePostfix, demension;
        var spritePath = '../public/images/sprite.png.json';
        if (!reloadClientImageCodeEveryRequest && clientImageCode) {
            return clientImageCode;
        }
        if (generateImageSpriteResult === true) {
            imageCode = FS.readFileSync(spritePath);
        } else {
            imageCode = "<script>";
            imageCode += "imagesData = {};";
            timePostfix = "?t=" + new Date().getTime();
            for (var i in generateImageSpriteResult.coordinates) {
                path = i.replace('../public', '');
                imageCode += "\r\nimagesData['" + path + "']={" + "" +
                    "path:'" + projectPrefix + '/images/sprite.png' + timePostfix + "'," +
                    "w:" + generateImageSpriteResult.coordinates[i].width + "," +
                    "h:" + generateImageSpriteResult.coordinates[i].height + "," +
                    "x:" + generateImageSpriteResult.coordinates[i].x + "," +
                    "y:" + generateImageSpriteResult.coordinates[i].y + "" +
                    "};";
            }
            imageCode += "</script>";
            imageCode += "<div style='display:none;'>";
            imageCode += "<img src='" + projectPrefix + "/images/sprite.png" + timePostfix + "'>";
            imageCode += "</div>";
            FS.writeFileSync(spritePath, imageCode);
            // cache it
            clientImageCode = imageCode;
        }
        return imageCode;
    };

    /**
     * Формирует Js-код картинок.
     */
    var getClientImageCodeImageList = function () {
        var imageFiles, imageCode, path, timePostfix, demension;
        if (!reloadClientImageCodeEveryRequest && clientImageCode) {
            return clientImageCode;
        }
        imageFiles = getFileListRecursive(imagesPath);
        imageCode = "<script>";
        imageCode += "imagesData = {};";
        timePostfix = "?t=" + new Date().getTime();
        for (var i in imageFiles) {
            path = imagesPrefix + imageFiles[i].substr(imagesPath.length);
            demension = IMAGE_SIZE(imageFiles[i]);
            imageCode += "\r\nimagesData['" + path + "']={path:'" + path + timePostfix + "',w:" + demension.width + ",h:" + demension.height + "};";
        }
        imageCode += "</script>";
        imageCode += "<div style='display:none;'>";
        for (var i in imageFiles) {
            path = imagesPrefix + imageFiles[i].substr(imagesPath.length);
            imageCode += "\r\n<img src='" + path + timePostfix + "'>";
        }
        imageCode += "</div>";
        // cache it
        clientImageCode = imageCode;
        return imageCode;
    };

    var getFileListRecursive = function (basePath) {
        var dirList, path, files;
        files = [];
        dirList = FS.readdirSync(basePath);
        for (var i in dirList) {
            /**@todo .js extenstion must be */
            if (dirList[i] == '.gitkeep')continue;
            if (dirList[i] == '.gitignore')continue;
            if (dirList[i] == 'sprite.png.json')continue;
            path = basePath + dirList[i];
            if (FS.statSync(path).isDirectory()) {
                files = files.concat(getFileListRecursive(path + '/'));
            } else {
                files.push(path);
            }
        }
        return files;
    };

    var generateImageSpriteLoaded = false;

    var generateImageSprite = function (callback) {
        var sprites, spritePath;

        if (generateImageSpriteLoaded) return;
        generateImageSpriteLoaded = true;
        spritePath = '../public/images/sprite.png';

        if (FS.existsSync(spritePath)) {
            FS.unlink(spritePath);
            callback(true);
        }

        sprites = getFileListRecursive(imagesPath);

        Logs.log("SPRITESMITH BEGIN", Logs.LEVEL_NOTIFY);

        SPRITESMITH.run({src: sprites}, function handleResult(err, result) {
            // result.image; // Buffer representation of image
            // result.coordinates; // Object mapping filename to {x, y, width, height} of image
            // result.properties; // Object with metadata about spritesheet {width, height}
            if (err) {
                console.log(err);
            }
            // coordinates: ['../public/images/buttons/addFriendActive.png': { x: 75, y: 1353, width: 75, height: 80 },
            //'../public/images/buttons/addFriendHover.png': { x: 150, y: 1353, width
            var fsResult = FS.writeFileSync(spritePath, result.image, 'binary');
            Logs.log("SPRITESMITH Complete", Logs.LEVEL_NOTIFY);
            callback(result);
        });
    };

    var getGUIGeneratedCode = function () {

        /*
         1 - get PageBlock folder files
         2 - for each generate add block code
         */
        var files, guiCode, pageBlocks, name;
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
    }
};

ClientCodeLoader = new ClientCodeLoader;

ClientCodeLoader.depends = ['Logs', 'Profiler', 'SocNet', 'WebSocketServer'];