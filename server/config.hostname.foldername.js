/**
 * Файл конфигурации.
 * @type {Object}
 */
Config = {
    Logs: {
        triggerLevel: 2  // notify
    },
    DB: {
        host: 'localhost',
        username: 'username',
        password: 'password',
        database: 'databasename',
        charset: 'UTF8'
    },
    SocNet: {
        VK: {
            secretKey: 'vk-application-secret-key',
            appId: 1/*vk-application-id*/,
        }
    },
    ApiRouterMetric: {
        reportTimeout: 1000 * 60 * 60 * 5// five hours
    },
    Profiler: {
        reportTimeout: 1000 * 60 * 60 * 5, // five hours
        saveToDBTimeout: 1000 * 60 * 10// five hours
    },
    UrlCache: {
        lifeTime: 1000 * 60 * 30 * 12 // 12 hours
    },
    WebSocketServer: {
        reloadClientCodeEveryRequest: false,
        compressJSClientCode: true,
        port: 1234,
        clientCodePath: '../client/',
        imagesPath: '../public/images/',
        useSpritedImage: true
    },
    SAPUUser: {
        postsPath: '/var/www/node-framework/other/posts/'
    },
    Statistic: {
        checkInterval: 1000,
        cacheLimit: 1000
    },
    Project: {
        maintance: false
    },
    VKCommentWidget: {
        // 125 - is it Adv
        height: 570 + 125,
        width: 788
    }
};
