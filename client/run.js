window.onload = function () {
    Logs.log('OnLoad raized', Logs.LEVEL_NOTIFY);
    /* Эмуляция совместимости клиентского и серверного кода. */
    global = window;
    process = {};
    process.exit = function () {
        console.log("Unexpected termination of work!");
        document.body.innerHTML = 'server is broken!';
        throw new Error("server is broken!");
    };


    /* Передаем управление вхдоной точки. */
    logicMain = new LogicMain();
    logicMain.main();

};
