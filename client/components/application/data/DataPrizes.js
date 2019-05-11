DataPrizes = function () {
    let self = this;

    this.giveOutPrizes = function (prizes) {
        prizes.forEach(function (prize) {
            self.giveOutPrize(prize);
        })
    };

    this.giveOutPrize = function (prize) {
        switch (prize.id) {
            case DataPrizes.PRIZE_STUFF_HUMMER:
                LogicStuff.giveAHummer(prize.count);
                break;
            case DataPrizes.PRIZE_STUFF_SHUFFLE:
                LogicStuff.giveAShuffle(prize.count);
                break;
            case DataPrizes.PRIZE_STUFF_LIGHTING:
                LogicStuff.giveALighting(prize.count);
                break;
        }
    };

    this.getImageFor = function (prize) {
        let src;
        switch (prize.id) {
            case DataPrizes.PRIZE_STUFF_HUMMER:
                src = '/images/button-hummer-rest.png';
                break;
            case DataPrizes.PRIZE_STUFF_SHUFFLE:
                src = '/images/button-shuffle-rest.png';
                break;
            case DataPrizes.PRIZE_STUFF_LIGHTING:
                src = '/images/button-lighting-rest.png';
                break;
        }
        return src;
    };
};

DataPrizes = new DataPrizes;

DataPrizes.PRIZE_STUFF_HUMMER = 1;
DataPrizes.PRIZE_STUFF_SHUFFLE = 2;
DataPrizes.PRIZE_STUFF_LIGHTING = 3;