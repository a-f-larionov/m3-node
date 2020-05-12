window.onload = function () {
    /** Эмуляция совместимости клиентского и серверного кода. */
    //let global = window;
    let process = {};
    process.exit = function () {
        console.log("Unexpected termination of work!");
        document.body.innerHTML = 'server is broken!';
        throw new Error("server is broken!");
    };

    /** Передаем управление вхдоной точки. */
    LogicMain = new LogicMain();
    LogicMain.main();
};
