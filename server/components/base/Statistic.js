Statistic = function () {

};

/**
 * Статичный класс.
 */
Statistic = new Statistic();

Statistic.depends = [];


Statistic.ID_AUTHORIZE_VK = 100;
Statistic.ID_AUTHORIZE_STANDALONE = 101;
Statistic.ID_LOGOUT = 102;

Statistic.ID_HUMMER_USE = 201;
Statistic.ID_LIGHTNING_USE = 202;
Statistic.ID_SHUFFLE_USE = 203;

Statistic.ID_BUY_VK_MONEY = 300;

Statistic.ID_BUY_HEALTH = 700;

Statistic.ID_BUY_HUMMER = 400;
Statistic.ID_BUY_LIGHTNING = 500;
Statistic.ID_BUY_SHUFFLE = 600;
Statistic.ID_BUY_LOOSE_TURNS = 610;

Statistic.ID_START_PLAY = 701;
Statistic.ID_FINISH_PLAY = 702;
Statistic.ID_EXIT_GAME = 703;
Statistic.ID_LOOSE_GAME = 704;

Statistic.ID_LEVEL_UP = 800;
Statistic.ID_OPEN_CHEST = 900;

Statistic.titles = {};
Statistic.titles[Statistic.ID_AUTHORIZE_VK] = "Зашел через ВК";
Statistic.titles[Statistic.ID_AUTHORIZE_STANDALONE] = "Зашел Стандале";
Statistic.titles[Statistic.ID_LOGOUT] = "Вышел из приложения";

Statistic.titles[Statistic.ID_HUMMER_USE] = "Использовал молоток ";
Statistic.titles[Statistic.ID_LIGHTNING_USE] = "Использовал молнию";
Statistic.titles[Statistic.ID_SHUFFLE_USE] = "Использовал вихрь";

Statistic.titles[Statistic.ID_BUY_VK_MONEY] = "Купил ВК голоса";

Statistic.titles[Statistic.ID_BUY_HEALTH] = "Купил жизни";

Statistic.titles[Statistic.ID_BUY_HUMMER] = "Купил молоток";
Statistic.titles[Statistic.ID_BUY_LIGHTNING] = "Купил молнию";
Statistic.titles[Statistic.ID_BUY_SHUFFLE] = "Купил вихрь";
Statistic.titles[Statistic.ID_BUY_LOOSE_TURNS] = "Купил +10 ходов";

Statistic.titles[Statistic.ID_START_PLAY] = "Начал уровень";
Statistic.titles[Statistic.ID_FINISH_PLAY] = "Выиграл уровень";
Statistic.titles[Statistic.ID_EXIT_GAME] = "Вышел на карту сам";
Statistic.titles[Statistic.ID_LOOSE_GAME] = "Проиграл";

Statistic.titles[Statistic.ID_LEVEL_UP] = "Перешел на следующий уровень";

Statistic.titles[Statistic.ID_OPEN_CHEST] = "Открыл сундук";
