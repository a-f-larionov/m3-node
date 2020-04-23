/**
 * Блок диалогов
 * @constructor
 */
let PageBlockZDialogs = function PageBlockZDialogs() {
    let self = this;

    /**
     * Показывать ли страницу.
     * @type {boolean}
     */
    let showed = false;

    /**
     * Массив всех элементов страницы.
     * @type {Array}
     */
    this.elements = [];

    /** @type {DialogMoneyShop}  */
    this.dialogMoneyShop = null;

    /** @type {DialogHealthShop} */
    this.dialogHealthShop = null;

    /** @type {DialogGoals} */
    this.dialogGoals = null;

    /** @type {DialogStuffShop} */
    this.dialogStuffShop = null;

    /** @type {DialogGoalsReached} */
    this.dialogGoalsReached = null;

    /** @type {DialogTurnLoose} */
    this.dialogTurnsLoose = null;

    /** @type {DialogJustQuit} */
    this.dialogJustQuit = null;

    /** @type {DialogPointInfo} */
    this.dialogPointInfo = null;

    /** @type {DialogChestNeedStars} */
    this.dialogChestNeedStars = null;

    /** @type {DialogChestYouWin} */
    this.dialogChestYouWin = null;

    this.init = function () {

        this.dialogMoneyShop = GUI.createElement(DialogMoneyShop, {});
        self.elements.push(this.dialogMoneyShop);

        this.dialogHealthShop = GUI.createElement(DialogHealthShop, {});
        self.elements.push(this.dialogHealthShop);

        this.dialogGoals = GUI.createElement(DialogGoals);
        self.elements.push(this.dialogGoals);

        this.dialogGoalsReached = GUI.createElement(DialogGoalsReached);
        self.elements.push(this.dialogGoalsReached);

        this.dialogTurnsLoose = GUI.createElement(DialogTurnLoose);
        self.elements.push(this.dialogTurnsLoose);

        this.dialogJustQuit = GUI.createElement(DialogJustQuit);
        self.elements.push(this.dialogJustQuit);

        this.dialogStuffShop = GUI.createElement(DialogStuffShop);
        self.elements.push(this.dialogStuffShop);

        this.dialogPointInfo = GUI.createElement(DialogPointInfo);
        self.elements.push(this.dialogPointInfo);

        this.dialogChestNeedStars = GUI.createElement(DialogChestNeedStars);
        self.elements.push(this.dialogChestNeedStars);

        this.dialogChestYouWin = GUI.createElement(DialogChestYouWin);
        self.elements.push(this.dialogChestYouWin);
    };

    /**
     * Покажем все элементы на странице.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        self.preset();
        for (let i in self.elements) {
            self.elements[i].show();
        }
        self.redraw();
    };

    /**
     * Спрачем все элементы на странице.
     */
    this.hide = function () {
        if (!showed) return;
        showed = false;
        for (let i in self.elements) {
            self.elements[i].hide();
        }
    };

    /**
     * Настройка перед отрисовкой.
     */
    this.preset = function () {

    };

    /**
     * Обновляем онлайн индикатор и индикатор очков.
     */
    this.redraw = function () {
        if (!showed) return;
        self.preset();
        self.elements.forEach(function (el) {
            el.redraw();
        });
    };
};

/**
 * @type {PageBLockZDialogs}
 */
PageBlockZDialogs = new PageBlockZDialogs();

PBZDialogs = PageBlockZDialogs;