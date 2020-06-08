(function _() {
    let uids = [];
    //limit for APIS 1000
    for (let i = 1; i < 1000 / 2.1; i++) {
        uids.push(444400000 + i);
        uids.push(i);
    }

    let closeOnLoad = function (wnd) {
        wnd.addEventListener("DOMContentLoaded", function () {
            wnd.close();
        });
    };

    let getPid = function () {
        return Math.ceil(Math.random() * 54);
    };

    let getUid = function () {
        return Math.ceil(Math.random() * 123456789);
    };

    let openGame = function () {

        SAPITimeServer.sendMeTime();
        SAPIStuff.sendMeStuff();
        SAPIUser.sendMeScores(
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
            uids
        );
        SAPIMap.sendMeMapInfo(Math.ceil(Math.random() * 3));
        SAPIUser.sendMeUserInfo(getUid());

        SAPIUser.sendMeUserIdsBySocNet(uids);
        if (prid) SAPILogs.clientLoaded(prid);
        SAPIUser.sendMeTopUsers(uids);
        SAPIUser.sendMeMapFriends(Math.ceil(Math.random() * 3), uids);
        SAPIUser.sendMeUserListInfo(uids);
    };

    let openClient = function () {

        let wnd = window.open('https://local.host/service/client-standalone?soc-net-user-id=' + Math.random() * 123456789);
        closeOnLoad(wnd);
    };

    let buyAll = function () {
        let wnd1 = window.open(SocNetStandalone.getBuyOrderUrl(DataShop.gold[Math.floor(Math.random(3))].votes));
        closeOnLoad(wnd1);
        let wnd2 = window.open(SocNetStandalone.getBuyOrderUrl(DataShop.gold[Math.floor(Math.random(3))].votes));
        closeOnLoad(wnd2);
        let wnd3 = window.open(SocNetStandalone.getBuyOrderUrl(DataShop.gold[Math.floor(Math.random(3))].votes));
        closeOnLoad(wnd3);
        let wnd4 = window.open(SocNetStandalone.getBuyOrderUrl(DataShop.gold[Math.floor(Math.random(3))].votes));
        closeOnLoad(wnd4);
        let wnd5 = window.open(SocNetStandalone.getBuyOrderUrl(DataShop.gold[Math.floor(Math.random(3))].votes));
        closeOnLoad(wnd5);

        SAPIStuff.buyHummer(Math.ceil(Math.random() * 3));
        SAPIStuff.buyLightning(Math.ceil(Math.random() * 3));
        SAPIStuff.buyShuffle(Math.ceil(Math.random() * 3));

        SAPIStuff.buyHealth();
    };

    let playOne = function () {
        //click on point
        let score, pid, chunks;
        score = 0;
        pid = getPid();
        chunks = 1;

        SAPIMap.sendMePointTopScore(score, pid, uids, chunks);
        SAPIUser.sendMeScores([getPid()], [
            LogicUser.getCurrent().id,
            Math.ceil(Math.random() * 1234567),
            Math.ceil(Math.random() * 1234567),
            Math.ceil(Math.random() * 1234567)
        ]);
        SAPIUser.sendMeUserListInfo(
            [getUid(), getUid(), getUid()]
        );

        SAPIUser.onStart();
        SAPIMap.onFinish(getPid(), Math.random() * 10000, Math.ceil(getPid() / 3))
        SAPIUser.onFinish();

        SAPIStuff.usedHummer();
        SAPIStuff.usedLightning();
        SAPIStuff.usedShuffle();
    };
    openGame();
    openClient();
    buyAll();
    playOne();
})();