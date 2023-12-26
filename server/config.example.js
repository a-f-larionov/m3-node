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
    Logs: {
        triggerLevel: 1,
    },
    WebSocketServer: {
        cacheCode: false,
        cacheImages: false,
        clientSource: "../client/",
        imagesPath: "../public/images/v1/",
        port: 3200
    },
    SocNet: {
        VK: {
            appId: 123,
            secretKey: ["secretKey"]
        }
    },
    AppFrame: {
        height: 500,
        width: 777
    },
    VKWidgetComments: {
        height: 400,
        width: 777,
    }
};
