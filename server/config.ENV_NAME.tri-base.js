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
        username: "tri_base",
        password: "tri_base",
        database: "tri_base",
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
            appId: "",
            secretKey: []
        }
    },
    VKWidgetComments: {
        height: 100,
        widht: 100
    },
    Telegramm: {
        chatId: "-1000000000000",
        agent: "",
        token: "bot123:aa-ZZ"
    }
};