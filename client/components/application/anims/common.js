let animClouds = function () {

    let startP;
    let clouds;

    this.init = function (source) {
        this.skipAnimLock = true;
        clouds = source;
        startP = [];
        clouds.forEach(function (cloud, i) {
            cloud.vx = 0;
            cloud.vy = 0;
            startP[i] = {x: cloud.x, y: cloud.y};
        });
    };

    this.cycleIt = function (t) {

        let rV;
        rV = {
            x:  Math.random() - 0.5,
            y:  Math.random() - 0.5
        };

        clouds.forEach(function (cloud, i) {
            let sx, sy, s;
            sx = sy = s = 0;

            clouds.forEach(function (cloudfrom) {
                sx = cloudfrom.x - cloud.x;
                sy = cloudfrom.y - cloud.y;
                if (Math.abs(sx) < 10 || Math.abs(sy) < 10) return;
                s = Math.sqrt(Math.pow(sx, 2) + Math.pow(sy, 2));
            });


            if (t % 1000 === 1) {
                cloud.vx += rV.x;
                cloud.vy += rV.y;
            }
            cloud.vx += (Math.random() - 0.5) * 0.01;
            cloud.vy += (Math.random() - 0.5) * 0.01;

            let cR = 30;
            sx = cloud.x - startP[i].x;
            sy = cloud.y - startP[i].y;
            if (sx > cR) cloud.vx -= 1;
            if (sy > cR) cloud.vy -= 1;
            if (sx < -cR) cloud.vx += 1;
            if (sy < -cR) cloud.vy += 1;

            cloud.vx *= 0.9999;
            cloud.vy *= 0.95;
            cloud.x += cloud.vx / 10;
            cloud.y += cloud.vy / 10;
        });
    };


    this.iterate = function (t) {
        for (let i = 0; i < 1; i++)
            this.cycleIt(t);
        clouds.forEach(function (cloud) {
            cloud.redraw();
                    });

        return true;
    };

    this.onFinish = function () {

    }
};
