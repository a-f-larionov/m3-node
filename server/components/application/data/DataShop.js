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

DataShop.healthGoldPrice = 300;

/** @see LogicPayments.doOrderChange */
DataShop.gold = [
    {votes: 6, quantity: 300},
    {votes: 26, quantity: 1500},
    {votes: 48, quantity: 3000}
];
DataShop.hummers = [
    {gold: 900, quantity: 3, imageSrc: 'hummer-big.png',},
    {gold: 1600, quantity: 6, imageSrc: 'hummer-big.png',},
    {gold: 2100, quantity: 9, imageSrc: 'hummer-big.png',}
];
DataShop.shuffle = [
    {gold: 1200, quantity: 3, imageSrc: 'shuffle-big.png',},
    {gold: 2100, quantity: 6, imageSrc: 'shuffle-big.png',},
    {gold: 2800, quantity: 9, imageSrc: 'shuffle-big.png',}
];
DataShop.lightning = [
    {gold: 1500, quantity: 3, imageSrc: 'lightning-big.png',},
    {gold: 2700, quantity: 6, imageSrc: 'lightning-big.png',},
    {gold: 3600, quantity: 9, imageSrc: 'lightning-big.png',}
];

/** Для кросс-сайдных компонент */
if (CONST_IS_SERVER_SIDE) {
    global['DataShop'] = DataShop;
}