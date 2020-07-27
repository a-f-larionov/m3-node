/**
 * @type {OnIdle}
 * @constructor
 */
let OnIdle = function () {
    let self = this;

    this.stack = [];

    this.init = function (callbackAfterInit) {
        setTimeout(OnIdle.iterate, Config.OnIdle.animateInterval);
        callbackAfterInit();
    };

    this.register = function (func) {
        self.stack.push(func);
    };

    this.iterate = function () {
        self.stack.forEach(function (f) {
            f();
        });
        setTimeout(OnIdle.iterate, Config.OnIdle.animateInterval);
    };

};

OnIdle = new OnIdle;