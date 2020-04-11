Animate = {
    anim: function (animClass, context) {
        let args, animObj, counter, timerId;
        counter = 0;
        animObj = new animClass();
        for (let name in context) {
            if (context.hasOwnProperty(name)) {
                animObj[name] = context[name];
            }
        }

        args = Array.from(arguments);
        args.shift();
        args.shift();

        animObj.init.apply(animObj, args);

        if (!animObj.skipAnimLock) AnimLocker.lock();

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
            if (animObj.skipAnimLock) {
            } else {
                AnimLocker.release();
            }
            if (context.onFinish) context.onFinish();
        };

        iterate();
        return function () {
            stopAnim();
        };
    }
};