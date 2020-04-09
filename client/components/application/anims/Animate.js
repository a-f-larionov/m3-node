Animate = {
    anim: function (animClass, context) {
        let args, animObj, counter, timerId;
        counter = 0;
        animObj = new animClass();
        log(animObj);
        for (let name in context) {
            if (context.hasOwnProperty(name)) {
                animObj[name] = context[name];
            }
        }

        args = Array.from(arguments);
        args.shift();
        args.shift();

        animObj.init.apply(animObj, args);

        if (!animObj.noAnimLock) AnimLocker.lock();

        let iterate = function () {
            if (animObj.iterate(counter++)) {
                timerId = setTimeout(iterate, Config.OnIdle.animateInterval);
            } else {
                stopAnim();
            }
        };
        let stopAnim = function () {
            clearTimeout(timerId);

            if (animObj.finish) animObj.finish();

            if (!animObj.noAnimLock) {
                AnimLocker.release();
                if (AnimLocker.free()) {
                    if (context.redraw) context.redraw();
                    if (context.run) context.run();
                }
            } else {
                if (context.redraw) context.redraw();
            }
        };

        iterate();
        return function () {
            stopAnim();
        };
    }
};