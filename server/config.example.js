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
