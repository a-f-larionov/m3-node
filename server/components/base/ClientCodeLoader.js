let FS = require('fs');
let OS = require('os');
let PATH = require('path');
let IMAGE_SIZE = require('image-size');
let UGLIFYJS = require('uglify-es');
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
    let cacheCode = null;

    /**
     * Кэшировать картинки(код).
     * @type {boolean}
     */
    let cacheImages = true;

    /**
     * Use Sprite image by SpriteSmith
     * @type {boolean}
     */
    let useSprite = true;

    let htmlHeader = '<!doctype html>\
        <html style="background:white;">\
        <head><meta charset=utf-8></head>\
        <title></title>\
        <body>';

    let htmlMaintaince = htmlHeader + '\
            <div style="text-align:center;">Игра на техническом обслуживании, пожалуйста зайдите немного позже.</div>\
            </body>\
            </html>';

    /**
     * Sprite.PNG image path
     * @type {string}
     */
    let spritePathPublic = '/images/sprite.png';
    let spritePathPhysic = '../public/' + spritePathPublic;
    /**
     * Client code VK.
     * @type {string}
     */
    let codeVK = '';

    /**
     * Client code Standalone.
     * @type {string}
     */
    let codeStandalone = '';

    /**
     * Client code for images
     * @type {string}
     */
    let codeImages = '';

    let imagesPath;
    /**
     * Инитиализация
     * @type {string}
     */
    let clientSource = null;

    let spriteExists = false;

    this.init = function (callback) {
        //@todo is it no WebSocketServer config , but is it LogicClientCodeLoader component config.
        cacheCode = Config.WebSocketServer.cacheCode;
        cacheImages = Config.WebSocketServer.cacheImages;
        clientSource = Config.WebSocketServer.clientSource;
        imagesPath = Config.WebSocketServer.imagesPath;
        useSprite = Config.WebSocketServer.useSprite;
        // check before after init
        if (typeof cacheCode !== 'boolean') {
            Logs.log("cacheCode given by .setup, must be boolean", Logs.LEVEL_FATAL_ERROR, cacheCode);
        }
        if (typeof clientSource !== 'string') {
            Logs.log("clientSource given by .setup, must be string", Logs.LEVEL_FATAL_ERROR, clientSource);
        }
        if (typeof imagesPath !== 'string') {
            Logs.log("imagesPath given by .setup, must be string", Logs.LEVEL_FATAL_ERROR, imagesPath);
        }
        if (typeof useSprite !== 'boolean') {
            Logs.log("useSprite given by .setup, must be boolean", Logs.LEVEL_FATAL_ERROR, useSprite);
        }

        /** Обновим клиентский код. */
        makeSprite(function () {
            reloadClientJS();
            reloadHTMLVK();
            reloadHTMLStandalone();
            callback();
        });
    };

    let getMaintainceHtml = function () {

    }

    this.getClientVK = function (callback) {
        if (Config.Project.maintance) return callback(htmlMaintaince);
        if (!cacheCode) {
            reloadHTMLVK();
            reloadClientJS();
        }
        callback(codeVK);
    };

    this.getClientStandalone = function (callback) {
        if (Config.Project.maintance) return callback(htmlMaintaince);
        if (cacheCode) {
            reloadHTMLStandalone();
            reloadClientJS();
        }
        callback(codeStandalone);
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

    this.reloadClient = function (callback) {
        reloadClientJS();
        reloadHTMLVK();
        reloadHTMLStandalone();
        callback('<pre>' + "Reload Client Code executed!" + new Date().getTime() + '</pre>');
    };

    let getTimeKey = function () {
        return Config.Project.develop ? "" : "?t=" + (new Date().getTime()).toString();
    };

    let getClientHTML = function (socNetCode) {
        let code = '';

        //let demension = IMAGE_SIZE(spritePathPhysic);

        code += "<!doctype html>";
        code += "<html style=\"background:white;\">\r\n";
        code += "<head>\r\n";
        code += "<style type='text/css'>*{padding:0px;margin:0px;}</style>";
        code += "<meta charset='utf-8' />\r\n";
        /* code += "<style> body div { background-size: "
             + translate2X(demension.width / 2) + "px "
             + translate2X(demension.height / 2) + "px; " +
             "}</style>";
         */
        code += "<script>window.PLATFORM_ID = '" + socNetCode + "';</script>";
        code += "<script type='text/javascript' src='/js/client." +
            (Config.WebSocketServer.compressCode ? 'min' : 'source') +
            ".js" + getTimeKey() + "'></script>\r\n";
        code += "</head>";
        code += "<body>";

        /** Application div */
        code += "<div style='" +
            "height:" + DataCross.app.height + "px;" + "width:" + DataCross.app.width + "px;" +
            "position:absolute;top:0px;' " +
            "id='appArea' ></div>\r\n";
        /** Wizard canvas */
        code += "<canvas style='" +
            "height:" + DataCross.app.height + "px;" + "width:" + DataCross.app.width + "px;" +
            "position:absolute;top:0px;' " +
            "id='wizardArea' ></canvas>\r\n";
        code += getClientImageCode();

        if (socNetCode === 'VK') {
            /** @see https://vk.com/dev/Javascript_SDK */
            code += "<script src='//vk.com/js/api/xd_connection.js?2' type='text/javascript'></script>\r\n";

            /** Сomments div */
            code += "<div id='vk_comments' style='top:" + DataCross.app.height + "px;position:absolute;'>";
            code += "<iframe src='/service/VKCommentsWidget' style='border:none; height: " + (Config.VKCommentWidget.height + 44) + "px; width:" + Config.VKCommentWidget.width + ";'></iframe>";
            code += "</div>\r\n";
        }

        code += "</body>";
        code += "</html>";
        return code;
    };

    let reloadHTMLVK = function () {
        codeVK = getClientHTML('VK');
        Logs.log("Load VK client code. Size:" + codeVK.length);
    };

    /**
     * Загрузка клиенсткого кода для стэндэлон версии.
     */
    let reloadHTMLStandalone = function () {
        codeStandalone = getClientHTML('STANDALONE');
        Logs.log("Load standalone client code. Size: " + codeStandalone.length);
    };

    /**
     * Перезагрузка основного кода клиента.
     */
    let reloadClientJS = function () {
        let js;
        js = getClientJS();

        FS.writeFileSync(CONST_DIR_ROOT + '/public/js/client.source.js', js);
        Logs.log("ClientJS source code writed. Size: " + js.length, Logs.LEVEL_DETAIL);

        //@todo LogicClintCodeloader.config?
        if (Config.WebSocketServer.compressCode) {
            js = 'function _(window){ ' + js + ' };' +
                '_(window);' +
                '';
            let result = UGLIFYJS.minify(js);
            if (result.code) {
                js = result.code;
                FS.writeFileSync(CONST_DIR_ROOT + '/public/js/client.min.js', js);
                Logs.log("ClientJS minified success(writen). Size: " + js.length, Logs.LEVEL_DETAIL);
            } else {
                Logs.log("ClientJS minified [FAILED], because some error.", Logs.LEVEL_ERROR, result);
            }
        }
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
                path = path.replace(clientSource, '');
                file_content = FS.readFileSync(path);
            }
            code += "\r\n/** " + path + " */\r\n";
            code += file_content;
            name = PATH.basename(path, '.js');
            code += 'if(window["' + name + '"] !== undefined){' + 'window["' + name + '"].__path="' + path + '"};\r\n';
        }
        return code;
    };

    /**
     * Собирает JS код клиента.
     * Этот код одинаков для всех социальных сетей(платформ).
     */
    let getClientJS = function () {
        let jsFiles, hostname, clientConfigPath, code;
        jsFiles = [];
        jsFiles = jsFiles.concat(getFileList(clientSource + 'core/'));
        jsFiles = jsFiles.concat(getFileList(clientSource + 'components/'));
        /** Include Config file. */
        hostname = OS.hostname();
        let parentFolderName = (function () {
            let cwd;
            cwd = process.cwd().split(PATH.sep);
            cwd.pop();
            return cwd.pop();
        })();
        clientConfigPath = clientSource + 'config.' + hostname + '.' + parentFolderName + '.js';
        Logs.log("Generate client code(client). The config file: " + clientConfigPath, Logs.LEVEL_NOTIFY);
        jsFiles.push(clientConfigPath);
        jsFiles.push(clientSource + '/run.js');
        code = clientCodePrepareCode(jsFiles);
        /** Generate sapi */
        code += ApiRouter.getSAPIJSCode();
        code += getGUIGeneratedCode();
        return code;
    };

    let getClientImageCode = function () {
        return useSprite ? getImageCodeSprited() : getImageCodeList();
    };

    let getImageCodeSprited = function () {
        let imgData, path;
        let imgJsonPath = spritePathPhysic + '.cache.json';
        if (cacheImages && codeImages) return codeImages;

        if (spriteExists === true) {
            imgData = FS.readFileSync(imgJsonPath);
        } else {
            imgData = "<script>";
            imgData += "imagesData = {};";
            for (let i in spriteExists.coordinates) {
                path = i.replace('../public/images/', '');
                imgData += "\r\nimagesData['" + path + "']={" + "" +
                    "w:" + translate2X(spriteExists.coordinates[i].width) + "," +
                    "h:" + translate2X(spriteExists.coordinates[i].height) + "," +
                    "x:" + translate2X(spriteExists.coordinates[i].x) + "," +
                    "y:" + translate2X(spriteExists.coordinates[i].y) + "" +
                    "};";
            }
            imgData += "for(let i in imagesData){ imagesData[i].path = '/images/sprite.png" + getTimeKey() + "';};";
            imgData += "</script>";
            imgData += "<div style='display:none;'>";
            imgData += "<img src='/images/sprite.png" + getTimeKey() + "'>";
            imgData += "</div>";
            FS.writeFileSync(imgJsonPath, imgData);
            // cache it
            codeImages = imgData;
        }
        return imgData;
    };

    /**
     * Формирует Js-код картинок.
     */
    let getImageCodeList = function () {
        let imageFiles, imageCode, path, demension;
        if (cacheImages && codeImages) return codeImages;

        imageFiles = getFileList(imagesPath);
        imageCode = "<script>";
        imageCode += "imagesData = {};";
        for (let i in imageFiles) {
            path = imagesPrefix + imageFiles[i].substr(imagesPath.length);
            path = path.replace('/images/', '');

            demension = IMAGE_SIZE(imageFiles[i]);
            imageCode += "\r\nimagesData['" + path + "']=" +
                "{w:" + translate2X(demension.width) +
                ",h:" + translate2X(demension.height) + "};";
        }
        imageCode += "for(let i in imagesData){ " +
            "   imagesData[i].path = '/images/' + i + '" + getTimeKey() + "';" +
            "   imagesData[i].x = 0;" +
            "   imagesData[i].y = 0;" +
            "};";
        imageCode += "</script>";
        imageCode += "<div style='display:none;'>";
        for (let i in imageFiles) {
            path = imagesPrefix + imageFiles[i].substr(imagesPath.length);
            imageCode += "\r\n<img src='" + path + getTimeKey() + "'>";
        }
        imageCode += "</div>";
        // cache it
        codeImages = imageCode;
        return imageCode;
    };

    let getFileList = function (basePath) {
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
                files = files.concat(getFileList(path + '/'));
            } else {
                files.push(path);
            }
        }
        return files;
    };

    let makeSprite = function (callback) {
        let list;

        if (!useSprite) {
            Logs.log("SPRITESMITH [SKIPPED]", Logs.LEVEL_NOTIFY);
            callback();
            return;
        }

        Logs.log("SPRITESMITH BEGIN", Logs.LEVEL_NOTIFY);
        /**
         *@todo
         * Calculate hash, if no changes - skip it!
         */

        list = getFileList(imagesPath);

        SPRITESMITH.run({src: list}, function handleResult(err, result) {
            let fsResult;
            // result.image; // Buffer representation of image
            // result.coordinates; // Object mapping filename to {x, y, width, height} of image
            // result.properties; // Object with metadata about spritesheet {width, height}
            if (err) console.log(err);
            // coordinates: ['../publicbuttons/addFriendActive.png': { x: 75, y: 1353, width: 75, height: 80 },
            //'../publicbuttons/addFriendHover.png': { x: 150, y: 1353, width
            if (FS.existsSync(spritePathPhysic)) FS.unlink(spritePathPhysic);

            fsResult = FS.writeFileSync(spritePathPhysic, result.image, 'binary');
            Logs.log("SPRITESMITH Complete `" + spritePathPhysic + "`", Logs.LEVEL_NOTIFY);
            spriteExists = fsResult;
            callback();
        });
    };

    let getGUIGeneratedCode = function () {

        /**
         1 - get PageBlock folder files
         2 - for each generate add block code
         */
        let files, guiCode, pageBlocks, name;
        guiCode = '';
        guiCode += 'GUI.init();' + "\r\n";
        pageBlocks = [];
        // page-blocks
        files = getFileList(clientSource + 'components/application/page_blocks/');
        files.forEach(function (filePath) {
            name = PATH.basename(filePath, '.js');
            if (name.substr(0, 9) === 'PageBlock') {
                pageBlocks.push(name);
            }
        });
        guiCode += ' PageController.addBlocks([' + pageBlocks.join(',') + ']);' + "\r\n";
        // pages
        files = getFileList(clientSource + 'components/application/pages/');
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