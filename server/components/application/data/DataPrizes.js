/**
 * @type {DataPrizes}
 * @constructor
 */
let DataPrizes = function () {
    let self = this;




    /*
    this.giveOutPrizes = function (userId, prizes) {
        prizes.forEach(function (prize) {
            self.giveOutPrize(userId, prize);
        })
    };

    this.giveOutPrize = function (userId, prize) {
        switch (prize.id) {
            case DataPrizes.PRIZE_STUFF_GOLD:
                DataStuff.giveAGold(userId, prize.count);
                break;
            case DataPrizes.PRIZE_STUFF_HUMMER:
                DataStuff.giveAHummer(userId, prize.count);
                break;
            case DataPrizes.PRIZE_STUFF_SHUFFLE:
                DataStuff.giveAShuffle(userId, prize.count);
                break;
            case DataPrizes.PRIZE_STUFF_LIGHTNING:
                DataStuff.giveAlightning(userId, prize.count);
                break;
        }
    };

     */
};

/** @type {DataPrizes} */
DataPrizes = new DataPrizes();

DataPrizes.PRIZE_HUMMER = 1;
DataPrizes.PRIZE_SHUFFLE = 2;
DataPrizes.PRIZE_LIGHTNING = 3;

DataPrizes.PRIZE_GOLD = 100;


/** Для кросс-сайдных компонент */
if (CONST_IS_SERVER_SIDE) {
    global['DataPrizes'] = DataPrizes;
}