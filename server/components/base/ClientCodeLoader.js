let FS = require('fs');
let OS = require('os');
let PATH = require('path');
let IMAGE_SIZE = require('image-size');
let UGLIFYJS = require('uglify-es');
let SPRITESMITH = require('spritesmith');
let CRYPTO = require('crypto');
let JavaScriptObfuscator = require('javascript-obfuscator');
let cp = require('child_process');

ClientCodeLoader = function () {

    let minifyOptions = {
        compress: {
            drop_console: !Config.Project.develop,
            drop_debugger: !Config.Project.develop,
            hoist_funs: true,
            keep_fargs: false,
            keep_infinity: false,
            passes: 10000,
            pure_funcs: null,// may helpfull for CAPI SAPI
        },
        mangle: {
            keep_fnames: false,
            toplevel: true,
            properties: false,
            keep_classnames: false,
        },
        keep_fnames: false,
        toplevel: true,
        warnings: false,
    };

    let obfuscateOptions =
        {
            compact: true,
            controlFlowFlattening: false,
            controlFlowFlatteningThreshold: 0.75,
            deadCodeInjection: false,
            deadCodeInjectionThreshold: 0.4,
            debugProtection: false,
            debugProtectionInterval: false,
            disableConsoleOutput: false,
            domainLock: [],
            identifierNamesGenerator: 'mangled',
            identifiersDictionary: [],
            identifiersPrefix: '',
            inputFileName: '',
            log: false,
            renameGlobals: true,
            reservedNames: [],
            reservedStrings: [],
            rotateStringArray: true,
            seed: 1,
            selfDefending: false,
            shuffleStringArray: true,
            sourceMap: false,
            sourceMapBaseUrl: '',
            sourceMapFileName: '',
            sourceMapMode: 'separate',
            splitStrings: false,
            splitStringsChunkLength: 10,
            stringArray: true,
            stringArrayEncoding: 'base64',
            stringArrayThreshold: 0.75,
            target: 'browser',
            transformObjectKeys: false,
            unicodeEscapeSequence: false,
        };

    let self = this;
    /**
     * @type {string}
     */
    let imagesPrefix = '/images/';

    /**
     * @type {boolean}
     */
    let cacheCode = true;

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

    let spriteMap = false;

    this.init = function (callback) {
        //@todo is it no WebSocketServer config , but is it LogicClientCodeLoader component config.
        cacheCode = Config.WebSocketServer.cacheCode;
        cacheImages = Config.WebSocketServer.cacheImages;
        clientSource = Config.WebSocketServer.clientSource;
        imagesPath = Config.WebSocketServer.imagesPath;
        useSprite = Config.Project.useSprite;
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

    this.getClientVK = function (callback) {
        //@todo save ip on login
        Logs.log("User request the client code.", Logs.LEVEL_DETAIL, null, null, false);
        let prid = pStart(Profiler.ID_CLIENT_LOAD_VK);
        if (Config.Project.maintance) return callback(htmlMaintaince);
        if (!cacheCode) {
            reloadHTMLVK();
            reloadClientJS();
        }
        callback(codeVK + '<script>prid=' + prid + '</script>');
    };

    this.getClientStandalone = function (callback) {
        let prid = pStart(Profiler.ID_CLIENT_LOAD_STANDALONE);
        if (Config.Project.maintance) return callback(htmlMaintaince);
        if (!cacheCode) {
            reloadHTMLStandalone();
            reloadClientJS();
        }
        callback(codeStandalone + '<script>prid=' + prid + '</script>');
    };

    this.getVKWidgetComments = function (callback) {
        let code = "" +
            "<html>" +
            "<head>" +
            "<script type='text/javascript' src='//vk.com/js/api/openapi.js?116'></script>" +
            "<script>VK.init({apiId: " + Config.SocNet.VK.appId + ", onlyWidgets: true});</script>" +
            "</head>" +
            "<body style='margin:0px;'>" +
            "<div id='vk_comments'></div>" +
            "<script type='text/javascript'>" +
            "VK.Widgets.Comments('vk_comments', {limit: 5," +
            "height: " + (Config.VKWidgetComments.height).toString() + "," +
            "width: " + (Config.VKWidgetComments.width - 50 + 33).toString() + "," +
            "attach: '*'," +
            "pageUrl: 'http://vk.com/app" + Config.SocNet.VK.appId + "'});" +
            "</script>" +
            "</body>" +
            "</html>";
        callback(code);
    };

    this.reloadClient = function (callback) {
        reloadClientJS();
        reloadHTMLVK();
        reloadHTMLStandalone();
        callback('<pre>' + "Reload Client Code executed!" + Date.now() + '</pre>');
    };


    let time = Date.now().toString();

    let getTimeKey = function () {
        return Config.Project.develop ? "" : "?t=" + time;
    };

    let getClientHTML = function (socNetCode) {
        let code = '';

        let demension = IMAGE_SIZE(imagesPath + '/sprite.png');

        code += "<!doctype html>";
        code += "<html style=\"background:white;\">\r\n";
        code += "<head>\r\n";
        code += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no\" />\r\n";
        code += "<style type='text/css'>*{padding:0px;margin:0px;}</style>";
        code += "<meta charset='utf-8' />\r\n";
        code += "<style> body span { background-size: "
            + translate2X(demension.width) + "px "
            + translate2X(demension.height) + "px; " +
            "}</style>";

        code += "<script>window.PLATFORM_ID = '" + socNetCode + "';</script>";
        code += "<script>window.useSprite = " + Config.Project.useSprite + ";</script>";
        if (Config.Project.useSprite) {
            code += "<script>window.spriteSize = {" +
                "width: " + translate2X(demension.width) + ", " +
                "height:" + translate2X(demension.height) + "" +
                "};</script>";
        }
        code += "</head>";
        code += "<body>";

        code += "<div id='loading' style='" +
            "  display: flex;\n" +
            "  justify-content: center;\n" +
            "  align-items: center;\n" +
            "  font-family: arial,sans-serif,\"Marvin\",Tahoma,\"Geneva CY\",sans-serif;\n" +
            "  color: grey;" +
            "  font-size: 24px;" +
            "  background-color:rgba(103, 77, 56, 1.0);" +
            //"  background-color: grey;" +
            " background-size:contain;" +
            "  height:" + DataCross.app.height + "px;\n" +
            "'>Загрузка...</div>";

        code += "<img id=\"img\" src='/images/oblojka.png" + getTimeKey() + "'" +
            " style='display:none; " +
            "height:" + DataCross.app.height + "px;" +
            "' " +
            "document.getElementById(\"img\").style.display=\"block\";" +
            "document.getElementById(\"loading\").remove(); " +
            "' " +
            "/>";


        /** Application div */
        code += "<div style='" +
            "height:" + DataCross.app.height + "px;" +
            "width:" + DataCross.app.width + "px;" +
            "position:absolute;top:0px;' " +
            "id='appArea' ></div>\r\n";
        /** Wizard canvas */
        code += "<canvas style='" +
            "height:" + DataCross.app.height + "px;" +
            "width:" + DataCross.app.width + "px;" +
            "position:absolute;top:0px;z-index:2000;' " +
            "id='wizardArea' ></canvas>\r\n";
        code += getClientImageCode();

        code += "<script type='text/javascript' src='/js/client." +
            (Config.Project.minifyCode ? 'min' : 'source') +
            ".js" + getTimeKey() + "'></script>\r\n";


        if (socNetCode === 'VK') {
            /** @see https://vk.com/dev/Javascript_SDK */
            code += "<script src='//vk.com/js/api/xd_connection.js?2' type='text/javascript'></script>\r\n";

            /** Сomments div */
            code += "<div id='vk_comments' style='" +
                "top:" + DataCross.app.height + "px;position:absolute;'>";
            code += "<iframe src='/service/vk-widget-comments' style='border:none; " +
                "width:" + Config.VKWidgetComments.width + "px;" +
                "height: " + (Config.VKWidgetComments.height) + "px;" +
                "'></iframe>";
            code += "</div>\r\n";
            //code += "<iframe src='" + projectPrefix + "/service/VKCommentsWidget'
            // style='border:none; height: " + (Config.VKWidgetComments.height + 44) +
            // "px; width:" + Config.VKWidgetComments.width + ";'></iframe>";
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
        let cache, sTime, result, js, jsHash;
        cache = (FS.existsSync(CONST_DIR_ROOT + '/cache.js')
            && JSON.parse(FS.readFileSync(CONST_DIR_ROOT + '/cache.js').toString()))
            || {};

        js = getClientJS();
        jsHash = CRYPTO.createHash('md5')
            .update(js +
                JSON.stringify(minifyOptions) +
                JSON.stringify(Config) +
                JSON.stringify(obfuscateOptions)
            )
            .digest('hex');

        if (cache.jsHash && cache.jsHash == jsHash) {
            Logs.log("Use cached js with hash:" + jsHash, Logs.LEVEL_NOTIFY);
            return;
        }
        cache.jsHash = jsHash;

        FS.writeFileSync(CONST_DIR_ROOT + '/public/js/client.source.js', js);
        Logs.log("ClientJS source code writed. Size: " + js.length, Logs.LEVEL_DETAIL);

        if (Config.Project.obfuscate) {
            sTime = mtime();
            js = JavaScriptObfuscator.obfuscate(js, obfuscateOptions).getObfuscatedCode();

            FS.writeFileSync(CONST_DIR_ROOT + '/public/js/client.source.obfuscated.js', js);
            Logs.log("ClientJS obfuscated (writen)." +
                " Size: " + js.length.toString() +
                " Time: " + (mtime() - sTime).toString()
                , Logs.LEVEL_DETAIL);
        }

        FS.writeFileSync(CONST_DIR_ROOT + '/cache.js', JSON.stringify(cache));

        //@todo LogicClintCodeloader.config?
        if (Config.Project.minifyCode) {

            let reserved = [
                'cookie',
                'addEventListener',
                'location',
                'getElementById',
                'elementFromPoint',
                'getElementsByTagName',
                'createElement',
                'appendChild',
                'i_d',
            ];

            sTime = mtime();
            result = UGLIFYJS.minify({js: "{" + js + "}"}, JSON.parse(JSON.stringify(minifyOptions)));
            if (result.code) {
                js = result.code;
                FS.writeFileSync(CONST_DIR_ROOT + '/public/js/client.min.js', js);
                Logs.log("ClientJS minified success(writen)." +
                    " Size: " + js.length.toString() +
                    " Time: " + (mtime() - sTime).toString()
                    , Logs.LEVEL_DETAIL);
            } else {
                Logs.log("ClientJS minified [FAILED], because some error.", Logs.LEVEL_ERROR, result);
            }
            if (result.warnings) Logs.log("code minify warnings", Logs.LEVEL_WARNING, result.warnings);
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
        jsFiles.push(clientSource + '/run.js');
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
        Logs.log("Generate client code(client). The config file: " + clientConfigPath, Logs.LEVEL_DETAIL);
        jsFiles.push(clientConfigPath);

        code = clientCodePrepareCode(jsFiles);
        /** Generate sapi */
        code += CodeGenerator.getSAPIJSCode();
        code += getGUIGeneratedCode();

        if (!Config.Project.develop) {
            code = 'function _(window){' + code + ' }; _(window);';
        }
        code = '"use strict";\r\n' + code;

        return code;
    };

    let getClientImageCode = function () {
        return useSprite ? getImageCodeSprited() : getImageCodeList();
    };

    let getImageCodeSprited = function () {
        let imgData, path;
        let imgJsonPath = spritePathPhysic + '.cache.js';
        if (cacheImages && codeImages) return codeImages;

        if (cacheImages && FS.existsSync(imgJsonPath)) {
            imgData = FS.readFileSync(imgJsonPath);
        } else {
            imgData = "<script>";
            imgData += "i_d = {};";
            for (let i in spriteMap.coordinates) {
                path = i.replace('../public/images/', '');
                imgData += "\r\ni_d['" + path + "']={" + "" +
                    "w:" + translate2X(spriteMap.coordinates[i].width) + "," +
                    "h:" + translate2X(spriteMap.coordinates[i].height) + "," +
                    "x:" + translate2X(spriteMap.coordinates[i].x) + "," +
                    "y:" + translate2X(spriteMap.coordinates[i].y) + "" +
                    "};";
            }
            imgData += "for(let i in i_d){ i_d[i].path = '/images/sprite.png" + getTimeKey() + "';};";
//@todo auto it!
            imgData += "\r\ni_d['oblojka.png']={" +
                "path: '/images/oblojka.png" + getTimeKey() + "'" +
                "};";
            imgData += "</script>";
            imgData += "<div style='display:none;'>";
            imgData += "<img src='/images/sprite.png" + getTimeKey() + "'>";
            imgData += "</div>";
            Logs.log("Write img data cache", Logs.LEVEL_DETAIL);
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

        imageFiles = getFileList(imagesPath, Config.spriteSkip);
        imageCode = "<script>";
        imageCode += "i_d = {};";
        imageFiles.forEach(function (image) {
            path = imagesPrefix + image.substr(imagesPath.length);
            path = path.replace('/images/', '');

            demension = IMAGE_SIZE(image);
            imageCode += "\r\ni_d['" + path + "']=" +
                "{w:" + translate2X(demension.width) +
                ",h:" + translate2X(demension.height) + "};";
        });

        imageCode += "for(let i in i_d){ " +
            "   i_d[i].path = '/images/' + i + '" + getTimeKey() + "';" +
            "   i_d[i].x = 0;" +
            "   i_d[i].y = 0;" +
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

    let getFileList = function (basePath, skipArrAdd) {
        let dirList, path, files, skip, skipArr;
        files = [];
        skipArr = [
            '.gitkeep',
            '.gitignore',
            'sprite.png',
            'sprite.png.cache.js',
        ];
        if (skipArrAdd) skipArr = skipArr.concat(skipArrAdd);
        dirList = FS.readdirSync(basePath);
        dirList.forEach(function (dirRow) {
            if (dirRow.indexOf('tmp$$') !== -1) return 5;
            if (skipArr.indexOf(dirRow) !== -1) return 10;

            path = basePath + dirRow;
            if (FS.statSync(path).isDirectory()) {
                files = files.concat(getFileList(path + '/', skipArrAdd));
            } else {
                files.push(path);
            }
        });
        return files;
    }

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

        list = getFileList(imagesPath, Config.spriteSkip);

        SPRITESMITH.run({src: list}, function handleResult(err, result) {
            let fsResult;
            // result.image; // Buffer representation of image
            // result.coordinates; // Object mapping filename to {x, y, width, height} of image
            // result.properties; // Object with metadata about spritesheet {width, height}
            if (err) console.log(err);
            // coordinates: ['../publicbuttons/addFriendActive.png': { x: 75, y: 1353, width: 75, height: 80 },
            //'../publicbuttons/addFriendHover.png': { x: 150, y: 1353, width
            if (!err) {
                if (FS.existsSync(spritePathPhysic)) FS.unlinkSync(spritePathPhysic);
                fsResult = FS.writeFileSync(spritePathPhysic, result.image, 'binary');
            }
            Logs.log("SPRITESMITH Complete `" + spritePathPhysic + "`" + result.image.length, Logs.LEVEL_NOTIFY);
            spriteMap = result;

            let sTime = mtime();
            if (Config.Project.usePngquant) {
                Logs.log('Pngquant begin. Sprite size:' + FS.statSync("../public/images/sprite.png")['size'], Logs.LEVEL_ALERT);
                cp.exec(
                    "cd ../public/images/ && pngquant *.png  --ext '.png' --force --verbose  --speed 1",
                    function () {
                        Logs.log('Pngquant finish' +
                            " time: " + (mtime() - sTime).toString() +
                            " size: " + FS.statSync("../public/images/sprite.png")['size'], Logs.LEVEL_ALERT);
                        //@todo run service under www-data user
                        cp.exec(' cd ../public/images/ && chmod 777 *');
                        callback();
                    });
            } else {
                callback();
            }
        });
    };

    this.reloadSprite = function () {
        makeSprite(function () {
            reloadHTMLVK();
            reloadHTMLStandalone();
        })
    }

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
        return Math.ceil(value / 2);
    };
}

ClientCodeLoader = new ClientCodeLoader();

ClientCodeLoader.depends = ['Logs', 'Profiler', 'SocNet', 'WebSocketServer'];