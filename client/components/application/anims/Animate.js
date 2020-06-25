let Animate = {
    anim: function (animClass, context) {
        let args, animObj, t, requestId;
        t = 0;
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
            t += Config.OnIdle.animStep;
            if (animObj.iterate(t)) {
                requestId = requestAnimationFrame(iterate);
            } else {
                stopAnim();
            }
        };
        let stopAnim = function () {
            cancelAnimationFrame(requestId);
            if (animObj.finish) animObj.finish();
            if (animObj.skipAnimLock) {
            } else {
                AnimLocker.release();
            }
            if (context.onFinish) context.onFinish();
        };

        iterate();
        return stopAnim;
    },

    getFrameUrl: function (urlStart, position, max) {
        return urlStart + (Math.floor((position) % max) + 1) + '.png';
    }
};

Animate.settings = {
    fallVelocity: 5
};