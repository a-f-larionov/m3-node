/**
 * @type {LogicChests}
 * @constructor
 */
let LogicChests = function () {

    let numberToStars = {1: 6 * 3, 2: 12 * 3, 3: 18 * 3};

    this.getStarsByNumber = function (number) {
        return numberToStars[number];
    };

    this.getNumberFromPointId = function (pointId) {
        return 3 % pointId;
    };

    this.onFinish = function (pointId, lastScore, newScore, forceChest) {
        let oldPointStars, newPointStars,
            oldMapStars, newMapStars,
            chestA, chestB, chestC,
            number, chestId;

        oldPointStars = DataPoints.countStars(null, null, lastScore);
        newPointStars = DataPoints.countStars(null, null, newScore);

        oldMapStars = DataMap.countStarsByMapId();
        newMapStars = oldMapStars + (newPointStars - oldPointStars);

        chestA = LogicChests.getStarsByNumber(1);
        chestB = LogicChests.getStarsByNumber(2);
        chestC = LogicChests.getStarsByNumber(3);

        number = 0;
        if ((oldMapStars < chestA && chestA === newMapStars) || forceChest === 1) {
            number = 1;
        }
        if ((oldMapStars < chestB && chestB === newMapStars) || forceChest === 2) {
            number = 2;
        }
        if ((oldMapStars < chestC && chestC === newMapStars) || forceChest === 3) {
            number = 3;
        }
        if (number) {
            chestId = LogicChests.getChestId(number);
            LogicChests.open(chestId);
            return chestId;
        }
        return 0;
    };

    this.open = function (chestId) {
        PBZDialogs.dialogChestYouWin.showDialog(chestId);
    };

    this.getChestId = function (number) {
        return (DataMap.getCurrent().id - 1) * 3 + number;
    };
};

/** @type {LogicChests} */
LogicChests = new LogicChests;