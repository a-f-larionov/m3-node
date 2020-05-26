/**
 * @type {DataShop}
 * @constructor
 */
let DataShop = function () {

    this.getGoldProductByPrice = function (price) {
        let product;
        product = false;
        DataShop.gold.forEach(function (element) {
            if (element.votes === price) product = element;
        });
        return product;
    };
};

DataShop = new DataShop();

/* @see LogicPayments.doOrderChange */
DataShop.gold = [
    {
        votes: 1,
        quantity: 10
    },
    {
        votes: 5,
        quantity: 70
    },
    {
        votes: 10,
        quantity: 1000
    }
];

DataShop.hummers = [
    {
        gold: 10,
        quantity: 3,
        imageSrc: 'hummer-big.png',
    },
    {
        gold: 15,
        quantity: 6,
        imageSrc: 'hummer-big.png',
    },
    {
        gold: 30,
        quantity: 9,
        imageSrc: 'hummer-big.png',
    }
];

DataShop.shuffle = [
    {
        gold: 10,
        quantity: 3,
        imageSrc: 'shuffle-big.png',
    },
    {
        gold: 15,
        quantity: 6,
        imageSrc: 'shuffle-big.png',
    },
    {
        gold: 30,
        quantity: 9,
        imageSrc: 'shuffle-big.png',
    }
];


DataShop.lightning = [
    {
        gold: 10,
        quantity: 3,
        imageSrc: 'lightning-big.png',
    },
    {
        gold: 15,
        quantity: 6,
        imageSrc: 'lightning-big.png',
    },
    {
        gold: 30,
        quantity: 9,
        imageSrc: 'lightning-big.png',
    }
];


DataShop.healthGoldPrice = 100;

/** Для кросс-сайдных компонент */
if (CONST_IS_SERVER_SIDE) {
    global['DataShop'] = DataShop;
}