/**
 * @type {OnIdle}
 * @constructor
 */
let OnIdle = function () {
    let self = this;

    this.stack = [];

    this.init = function (callbackAfterInit) {
        setTimeout(OnIdle.iterate, Config.OnIdle.animateInterval * 15);
        callbackAfterInit();
    };

    this.register = function (func) {
        self.stack.push(func);
    };

    this.iterate = function () {

        for (let i in self.stack) {
            self.stack[i]();
        }
        setTimeout(OnIdle.iterate, Config.OnIdle.animateInterval);
    };

};

OnIdle = new OnIdle;