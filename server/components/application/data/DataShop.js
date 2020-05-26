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

let vK = 0.5;
let qK = 0.5;

DataShop.healthGoldPrice = 300 * qK;
/** @see LogicPayments.doOrderChange */
DataShop.gold = [
    {votes: 6 * vK, quantity: 300 * qK},
    {votes: 24 * vK, quantity: 1500 * qK},
    {votes: 44 * vK, quantity: 3000 * qK}
];
DataShop.hummers = [
    {gold: 900 * qK, quantity: 3, imageSrc: 'hummer-big.png',},
    {gold: 1300 * qK, quantity: 6, imageSrc: 'hummer-big.png',},
    {gold: 2000 * qK, quantity: 9, imageSrc: 'hummer-big.png',}
];
DataShop.shuffle = [
    {gold: 1100 * qK, quantity: 3, imageSrc: 'shuffle-big.png',},
    {gold: 2000 * qK, quantity: 6, imageSrc: 'shuffle-big.png',},
    {gold: 3000 * qK, quantity: 9, imageSrc: 'shuffle-big.png',}
];
DataShop.lightning = [
    {gold: 1200 * qK, quantity: 3, imageSrc: 'lightning-big.png',},
    {gold: 2500 * qK, quantity: 6, imageSrc: 'lightning-big.png',},
    {gold: 3000 * qK, quantity: 9, imageSrc: 'lightning-big.png',}
];

/** Для кросс-сайдных компонент */
if (CONST_IS_SERVER_SIDE) {
    global['DataShop'] = DataShop;
}