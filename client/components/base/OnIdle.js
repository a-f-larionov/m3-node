OnIdle = function () {
    var self = this;

    this.stack = [];

    this.init = function (callbackAfterInit) {
        console.log('on idle init');
        setTimeout(OnIdle.iterate, 501);
        callbackAfterInit();
    };

    this.register = function (func) {
        self.stack.push(func);
    };

    this.iterate = function () {

        for (var i in self.stack) {
            self.stack[i]();
        }
        setTimeout(OnIdle.iterate, 33/3);
    };

};

OnIdle = new OnIdle;