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
DataShop.healthGoldPrice = 200;
DataShop.looseTurnsPrice = 200;
DataShop.looseTurnsQuantity = 10;
DataShop.gold = [
    {votes: 1, quantity: 500},
    {votes: 2, quantity: 1100},
    {votes: 3, quantity: 1500}
];
DataShop.hummers = [
    {gold: 500, quantity: 3, imageSrc: 'hummer-big.png',},
    {gold: 1000, quantity: 6, imageSrc: 'hummer-big.png',},
    {gold: 1500, quantity: 9, imageSrc: 'hummer-big.png',}
];
DataShop.shuffle = [
    {gold: 500, quantity: 3, imageSrc: 'shuffle-big.png',},
    {gold: 1000, quantity: 6, imageSrc: 'shuffle-big.png',},
    {gold: 1500, quantity: 9, imageSrc: 'shuffle-big.png',}
];
DataShop.lightning = [
    {gold: 500, quantity: 3, imageSrc: 'lightning-big.png',},
    {gold: 1000, quantity: 6, imageSrc: 'lightning-big.png',},
    {gold: 1500, quantity: 9, imageSrc: 'lightning-big.png',}
];