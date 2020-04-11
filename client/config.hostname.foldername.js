let Config = {
    Logs: {
        triggerLevel: Logs.LEVEL_DETAIL
    },
    WebSocketClient: {
        host: 'hostname',
        port: 443,
        url: '/service'
    },
    SocNet: {
        /** VK applicafiton id*/
        appId: 1234567
    },
    OnIdle: {
        /** 1000 ms / 30 fps = 33.3*/
        animateInterval: 1000 / 50,
        second: -1
    }
};

Config.OnIdle.second = Config.OnIdle.animateInterval * 50;
