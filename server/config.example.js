Config = {
    Project: {
        usePngquant: false,
        name: "name",
        shutdownSkipKey: true,
        zeroOnlineDowntimeout: false,
        develop: true,
        maintance: false,
        obfuscate: false,
        minifyCode: false,
        useSprite: false,
        spriteSkip: ["oblojka.png"]
    },
    DB: {
        host: "mysql",
        username: "local_user",
        password: "local_password",
        database: "local_database",
        charset: "UTF8",
    },
    Statistic: {
        checkInterval: 100,
        cacheLimit: 1000
    },
    Logs: {
        triggerLevel: 1,
    },
    WebSocketServer: {
        cacheCode: false,
        cacheImages: false,
        clientSource: "../client/",
        imagesPath: "../public/images/",
        port: 3200
    },
    SocNet: {
        VK: {
            appId: 123,
            secretKey: ["secretKey"]
        }
    },
    VKWidgetComments: {
        width: 777,
        height: 400,
    }
};
