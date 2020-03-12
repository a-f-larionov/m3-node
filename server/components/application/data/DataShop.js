DataShop = function () {

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
        quantity: 100
    }
];

DataShop.hummers = [
    {
        gold: 10,
        quantity: 3,
        imageSrc: '/images/shop-hummer-1.png',
    },
    {
        gold: 15,
        quantity: 6,
        imageSrc: '/images/shop-hummer-2.png',
    },
    {
        gold: 30,
        quantity: 9,
        imageSrc: '/images/shop-hummer-3.png',
    }
];

DataShop.shuffle = [
    {
        gold: 10,
        quantity: 3,
        imageSrc: '/images/shop-shuffle-1.png',
    },
    {
        gold: 15,
        quantity: 6,
        imageSrc: '/images/shop-shuffle-2.png',
    },
    {
        gold: 30,
        quantity: 9,
        imageSrc: '/images/shop-shuffle-3.png',
    }
];


DataShop.lighting = [
    {
        gold: 10,
        quantity: 3,
        imageSrc: '/images/shop-lighting-1.png',
    },
    {
        gold: 15,
        quantity: 6,
        imageSrc: '/images/shop-lighting-2.png',
    },
    {
        gold: 30,
        quantity: 9,
        imageSrc: '/images/shop-lighting-3.png',
    }
];

DataShop.health = [
    {
        gold: 10,
        quantity: 1,
        imageSrc: '/images/shop-health-1.png',
    },
    {
        gold: 15,
        quantity: 2,
        imageSrc: '/images/shop-health-2.png',
    },
    {
        gold: 30,
        quantity: 5,
        imageSrc: '/images/shop-health-3.png',
    }
];