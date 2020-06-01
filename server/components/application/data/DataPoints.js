/**
 * @type {DataPoints}
 * @constructor
 */
DataPoints = function () {

    this.FIELD_MAX_WIDTH = 10;
    this.FIELD_MAX_HEIGHT = 11;

    this.BLOCK_WIDTH = 50;
    this.BLOCK_HEIGHT = 50;

    let tableName = 'users_points';

    /**
     * conversions:
     * @see CAPIMap.convertFieldData
     * @type {{}}
     */
    let wayPoints = {};

    let fromDBToData = function (data) {
        if (!data) return data;
        if (data.userId) data.userId = parseInt(data.userId);
        if (data.pointId) data.pointId = parseInt(data.pointId);
        if (data.score) data.score = parseInt(data.score);
        return data;
    };

    wayPoints[1] = {
        id: 1, turns: 10, score1: 100, score2: 200, score3: 300,
        goals: [
            {id: DataObjects.OBJECT_RED, count: 9}
        ],
        layers: {
            mask: [
                "     ",
                "     ",
                "     ",

                "□□□□□",
                "□□□□□",
                "□□□□□",
                "□□□□□",
            ], gems: [            /** WizardFirstStart_1 */
                "RRGRR",
                "GBRBG",
                "RGBRG",

                "YRPRR",
                "BYBPB",
                "RPRBR",
                "YRBRB",
            ],
        }
    };

    wayPoints[2] = {
        id: 2, turns: 15, score1: 100, score2: 200, score3: 300,
        goals: [
            {id: DataObjects.OBJECT_PURPLE, count: 12}
        ],
        layers: {
            mask: [
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",

                " □□□□□□ ",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                " □□□□□□ ",
            ], gems: [             /** WizardLevel_2 lightning */
                "BRGPPBGR",
                "RGBPPRGP",
                "RGBBRRGP",
                "GPYPPYPP",
                "RGRPPRGB",

                "RGBPPRGB",
                "PRPPRPRG",
                "RPPBGPGR",
                "GPYPPYPG",
                "BYPGPPBB",
            ]
        }
    };

    wayPoints[3] = {
        id: 3, turns: 8, score1: 100, score2: 200, score3: 600,
        goals: [
            {id: DataObjects.OBJECT_GREEN, count: 12},
        ],
        layers: {
            mask: [
                "         ",
                "         ",
                "         ",
                "         ",
                "         ",
                "  □□□□□  ",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",

            ], gems: [ /** WizardLevel_3 polycolor gem */
                "RBYYYPPBB",
                "GPRBGRPRG",
                "BRGYRBBGB",
                "RBYYYPPBB",
                "GPRBGRPRG",
                "BRGYRBBGB",
                "GPRBGGPRG",
                "GRPPBPPGR",
                "BGBYPGYPG",
                "RBYYGYPBB",
            ]
        },
    };

    wayPoints[4] = {
        id: 4, turns: 10, score1: 500, score2: 1500, score3: 2000,
        goals: [
            {id: DataObjects.OBJECT_GOLD, count: 4}
        ],
        layers: {
            mask: [
                "",
                "",
                "",
                "",
                "",

                "□□□□□□",
                "□□□□□□",
                "□□□□□□",
                "□□□□□□",
                "□□□□□□",

            ], gems: [  /** WizardLevel_4 gold*/
                "BRGYRBBGB",
                "GPRBGGPRG",
                "GRPPBPPGR",
                "BGBYPGYPG",
                "RBYYGYPBB",

                "RBYYGPPBB",
                "PPRPRGPRG",
                "BRGYRBBGB",
                "RBYYPPPBB",
                "GPRBGRPRG",
            ],
            special: [
                "",
                "",
                "",
                "",
                "",

                "      ",
                " $  $ ",
                "   ⭥  ",
                " $  $ ",
                "      ",
            ],
        },
    };

    wayPoints[5] = {
        id: 5, turns: 18, score1: 1000, score2: 1500, score3: 8000,
        goals: [
            {id: DataObjects.OBJECT_GOLD, count: 17}
        ], layers: {
            mask: [
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
            ], special: [
                "$     $",
                " $ $ $ ",
                "   $   ",
                " $$$$$ ",
                "   $   ",
                " $ $ $ ",
                "$     $",
            ],
        }
    };

    wayPoints[6] = {
        id: 6, turns: 15, score1: 500, score2: 1000, score3: 2000,
        goals: [
            {id: DataObjects.OBJECT_GOLD, count: 6}
        ],
        layers: {
            mask: [
                "□□□□□□",
                "□□□□□□",
                "□□□□□□",
                "□□□□□□",
                "□□□□□□",
                "□□□□□□",
                "□□□□□□",
            ], special: [
                "      ",
                " $  $ ",
                "      ",
                " $  $ ",
                "      ",
                " $  $ ",
                "      ",
            ],
        }
    };

    wayPoints[7] = {
        id: 7, turns: 25, score1: 100, score2: 3000, score3: 5000,
        goals: [
            {id: DataObjects.OBJECT_GOLD, count: 9},
            {id: DataObjects.OBJECT_RED, count: 33},
        ],
        layers: {
            mask: [
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
            ], special: [
                "        ",
                "        ",
                "   $    ",
                "   $    ",
                " $$$$$  ",
                "   $    ",
                "   $    ",
                "        ",
            ],
        }
    };

    wayPoints[8] = {
        id: 8, turns: 15, score1: 100, score2: 1000, score3: 5000,
        goals: [
            {id: DataObjects.OBJECT_GOLD, count: 12},
            {id: DataObjects.OBJECT_RED, count: 10},
            {id: DataObjects.OBJECT_GREEN, count: 10}
        ],
        layers: {
            mask: [
                "  □□□□  ",
                " □□□□□□ ",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "  □□□□  ",
                "  □□□□  ",
            ], special: [
                "       ",
                "  $$$$ ",
                "  $  $ ",
                "  $  $ ",
                "  $$$$ ",
                "       ",
                "       ",
            ],
        }
    };

    wayPoints[9] = {
        id: 9, turns: 25, score1: 1000, score2: 2000, score3: 3500,
        goals: [
            {id: DataObjects.OBJECT_GOLD, count: 8},
        ],
        layers: {
            mask: [
                "",
                "",

                "",
                "",
                "□□□□□□",
                "□□□□□□",
                "□□□□□□",
                "□□□□□□",
                "□□□□□□",
                "□□□□□□",
            ], gems: [ /** WizardLevel9_1 Взорви камни рядом с ящиком.*/
                "RGBYPG",
                "GBRPYP",

                "PPGRBP",
                "YGYGYP",
                "GBRBRB",
                "RRPRYP",
                "BGRYPR",
                "BPPYRP",
                "GBRBRB",
                "GPBRPB",
            ],
            special: [[
                "",
                "",
                "",

                "",
                "",
                "",
                "■■■■■■",
                "■■■■■■",
                "",
                "",
            ], [
                "",
                "",
                "",

                "",
                "",
                "",
                "$$  $$",
                " $$$$ ",
                "",
                "",
            ]]
        }
    };

    wayPoints[10] = {
        id: 10, turns: 25, score1: 1000, score2: 2000, score3: 2500,
        goals: [
            {id: DataObjects.OBJECT_GOLD, count: 4},
            {id: DataObjects.OBJECT_RED, count: 9},
        ],
        layers: {
            mask: [
                "□     □ ",
                "□     □ ",
                "□□□□□□□ ",
                "□□□□□□□ ",
                "□ □□□ □ ",
                "□ □□□ □ ",
                "□ □□□ □ ",
                "□□□□□□□ ",
            ], special: [[
                "",
                "",
                "",
                "  ■ ■ ",
                "  ■■■ ",
                "   ■",
                "   ■",
            ], [
                "",
                "",
                "",
                "$ $ $ $",
                " ",
                "",
                "",
            ]]
        }
    };

    wayPoints[11] = {
        id: 11, turns: 40, score1: 500, score2: 1500, score3: 2000,
        goals: [
            {id: DataObjects.OBJECT_BLUE, count: 40},
            {id: DataObjects.OBJECT_RED, count: 40},
            {id: DataObjects.OBJECT_YELLOW, count: 40},
        ],
        layers: {
            mask: [
                "        ",
                "        ",

                "□□□□□□□ ",
                "□     □ ",
                "□□□□□□□ ",
                "□□□□□□□ ",
                "□□□□□□□ ",
                "□□□□□□□ ",
                "□     □ ",
                "□□□□□□□ ",
            ],
            gems__: [
                "GBRPYPY",
                "GPBRPBG",

                "RRPRYPB",
                "BGRYPRR",
                "BRPYRPB",
                "GBRBRBR",
                "YPYGYPG",
                "PPBRBPY",
                "GGRBRBP",
                "GBPBYBP",
            ],
            special: [[
                "",
                "",

                "",
                "",
                " ■■■■■ ",
                "",
                "",
                " ■■■■■ ",
                "",
                "",
            ]]
        }
    };

    wayPoints[12] = {
        id: 12, turns: 15, score1: 100, score2: 500, score3: 800,
        goals: [
            {id: DataObjects.OBJECT_BETA, count: 4},
        ],
        layers: {
            mask: [
                "",
                "",

                "□□□□□",
                "□□□□□",
                "□□□□□",
                "□□□□□",
                "□□□□□",
            ], gems: [ /** WizardLevel_12 Собирай пауков, взрывая камни на которых они сидят. */
                "GBRPYPY",
                "GPBRPBG",

                "PPBRBPY",
                "RRPRYPB",
                "YPYGYYG",
                "BRPYRPB",
                "GBRBRBR",
                "BGRYPRR",
            ],
            special: [[
                "",
                "",

                "",
                " β β ",
                "     ",
                " β β ",
                "",
                "",
            ]]
        }
    };

    wayPoints[13] = {
        id: 13, turns: 15, score1: 100, score2: 1000, score3: 1500,
        goals: [
            {id: DataObjects.OBJECT_BETA, count: 8}
        ],
        layers: {
            mask: [
                "□ □ □ □",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□ □ □ □",
            ], special: [[
                "β β β β",
                "",
                "",
                "",
                "",
                "",
                "β β β β",
            ]]
        }
    };

    wayPoints[14] = {
        id: 14, turns: 15, score1: 500, score2: 1000, score3: 1500,
        goals: [
            {id: DataObjects.OBJECT_BETA, count: 8},
            {id: DataObjects.OBJECT_GOLD, count: 8},
        ],
        layers: {
            mask: [
                "",
                "",

                "  □□□  ",
                "□□□□□□□",
                " □□□□□ ",
                " □□□□□ ",
                "□□□□□□□",
                "□□□□□□□",
                "  □□□  ",
            ], gems: [ /** WizardLevel_14 Взорви камни, что бы снять цепь.*/
                "GBRPYPY",
                "GPBRPBG",

                "GRGYGPG",
                "BGRRPRR",
                "YPYGPYB",
                "YRPRYPP",
                "PPBRBPY",
                "GBGBGBG",
                "GRPRYPG",
            ],
            special: [[
                "",
                "",

                "  βββ  ",
                "       ",
                "  βββ  ",
                "       ",
                "       ",
                "  β β  ",
                "       ",
            ], [
                "",
                "",

                "       ",
                "       ",
                "  ■■■  ",
                "       ",
                "       ",
                "  ■■■  ",
                "       ",
            ], [
                "",
                "",

                "       ",
                "  $ $  ",
                "  $$$  ",
                "       ",
                "       ",
                "  $$$  ",
                "       ",
            ]]
        }
    };

    wayPoints[15] = {
        id: 15, turns: 30, score1: 1000, score2: 2000, score3: 35000,
        goals: [
            {id: DataObjects.OBJECT_BETA, count: 5},
            {id: DataObjects.OBJECT_RED, count: 12},
            {id: DataObjects.OBJECT_GREEN, count: 12},
        ],
        layers: {
            mask: [
                "  □ □ □ ",
                "□ □□□□□ □",
                "□ □□□□□ □",
                "□□□□□□□□□ ",
                "□□□□□□□□□",
                "□□□□□□□□□ ",
                "□□□□□□□□□",
            ],
            special: [[
                "  β β β  ",
                "β       β",
                "         ",
                "bbbbbbbbb",
                "b       b",
                "b       b",
                "b       b",
                "b       b",
                "bbbbbbbbb",
            ], [
                "",
                "",
                "",
                "╱  XXX  ╲",
            ],
            ]
        }
    };

    wayPoints[16] = {
        id: 16, turns: 15, score1: 500, score2: 1000, score3: 3500,
        goals: [
            {id: DataObjects.OBJECT_GOLD, count: 8},
            {id: DataObjects.OBJECT_BETA, count: 8}
        ],
        layers: {
            mask: [
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□  □□□",
                "□□□  □□□",
                "□□□  □□□",
                "□□□□□□□□",
                "□□□□□□□□",
            ],
            special: [[
                "ββββββββ",
                "$$    $$",
                "       ",
                "       ",
                "$$    $$",
                "       ",
                "       ",
            ],
            ]
        }
    };

    wayPoints[17] = {
        id: 17, turns: 35, score1: 500, score2: 2500, score3: 5500,
        goals: [
            {id: DataObjects.OBJECT_GOLD, count: 8},
            {id: DataObjects.OBJECT_BETA, count: 9},
            {id: DataObjects.OBJECT_BOX, count: 3},
        ],
        layers: {
            mask: [
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□ □□□□",
                "□□□□ □□□□",
                "□□□□ □□□□",

            ],
            special: [[
                "βββbbbβββ",
                "   βββ   ",
                "        ",
                "        ",
                "        ",
                "$$$$ $$$$",

            ], [
                "╱╲╱╲X╱╲╱╲",
                "╲       ╱",
                "╱       ╲",
                "╲       ╱",
                "╱       ╲",
            ]
            ]
        }
    };

    wayPoints[18] = {
        id: 18, turns: 15, score1: 500, score2: 1000, score3: 4000,
        goals: [
            {id: DataObjects.OBJECT_GOLD, count: 8},
            {id: DataObjects.OBJECT_BOX, count: 8}
        ],
        layers: {
            mask: [
                "",
                "",

                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "  □□□  ",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
            ],
            gems__: [
                "△⨀▭◆⨀▭△",
                "△▭◆▭◇⨀◇",

                "△▭△▭△▭△",
                "△◆△◇△⨀△",
                "▭△◆◇⨀◆◆",
                "△◆⨀◆◇⨀△",
                "◇◆⨀▭◇⨀⨀",
                "⨀⨀▭◆▭⨀◇",
                "◇⨀◇△⨀◇▭",
            ],
            special: [[
                "",
                "",

                "  ■■■  ",
                "  ■ ■  ",
                "       ",
                "  ■■■  ",
                "       ",
                "       ",
                "       ",
            ], [
                "",
                "",

                "  $$$  ",
                "  $ $  ",
                "       ",
                "  $$$  ",
                "       ",
                "       ",
                "       ",
            ],]
        }
    };

    wayPoints[19] = {
        id: 19, turns: 40, score1: 7000, score2: 7500, score3: 8000,
        goals: [
            {id: DataObjects.OBJECT_GOLD, count: 20},
        ],
        layers: {
            mask: [
                "□□□□□□□",
                " □□□□□ ",
                "□□□□□□□",
                "□□□□□□□ ",
                "□□□□□□□",
                "□□□□□□□ ",
                "□□□□□□□",
            ],
            special: [[
                "       ",
                "       ",
                "       ",
                "bbbbbbb",
                "b     b",
                "b     b",
                "b     b",
                "bbbbbbb",
            ], [
                "       ",
                "       ",
                "       ",
                "$$$$$$$",
                "$     $",
                "$     $",
                "$     $",
                "$$$$$$$",
            ], [
                "       ",
                "       ",
                "       ",
                "       ",
                " X   X ",
                "       ",
                " X   X ",
                "       ",
            ],
            ]
        }
    };

    wayPoints[20] = {
        id: 20, turns: 15, score1: 200, score2: 400, score3: 700,
        goals: [
            {id: DataObjects.OBJECT_BETA, count: 5},
        ],
        layers: {
            mask: [
                "",
                "",

                "",
                "",
                "□□□□□",
                "□□□□□",
                "□□□□□",
                "□□□□□",
                "",
            ], special: [[
                "",
                "",

                "      ",
                "      ",
                "      ",
                " β β  ",
                " β β  ",
                "  β   ",
                "      ",
            ], [
                "",
                "",

                "",
                "",
                "",
                " ╲ ╱  ",
                " ╱ ╲  ",
                "",
                "",
            ]]
        }
    };

    wayPoints[21] = {
        id: 21, turns: 35, score1: 500, score2: 1000, score3: 2000,
        goals: [
            {id: DataObjects.OBJECT_BETA, count: 5},
            {id: DataObjects.OBJECT_GOLD, count: 8},
        ],
        layers: {
            mask: [
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
            ], special: [[
                "        ",
                " β   β  ",
                "        ",
                "   β    ",
                "        ",
                " β   β  ",
                "        ",
            ], [
                "   $    ",
                "        ",
                " $   $  ",
                "  $ $   ",
                " $   $  ",
                "        ",
                "   $    ",
            ], [
                "        ",
                " ╲   ╱  ",
                "        ",
                "   X    ",
                "        ",
                " ╱   ╲  ",
                "        ",
            ]]
        }
    };

    wayPoints[22] = {
        id: 22, turns: 25, score1: 500, score2: 1000, score3: 1500,
        goals: [
            {id: DataObjects.OBJECT_BETA, count: 7},
            {id: DataObjects.OBJECT_BOX, count: 15}
        ],
        layers: {
            mask: [
                " □□ □□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                " □□ □□",
            ], special: [[
                " ββ ββ ",
                "β  β  β",
                "       ",
                "       ",
                "       ",
                "       ",
                "       ",
            ], [
                "       ",
                "       ",
                " ■■■■■",
                " ■■■■■",
                " ■■■■■",
                "       ",
                "       ",
            ], [
                "       ",
                "X  X  X",
                "       ",
                "       ",
                "       ",
                "       ",
                "       ",
            ]]
        }
    };

    wayPoints[23] = {
        id: 23, turns: 15, score1: 500, score2: 1000, score3: 1500,
        goals: [
            {id: DataObjects.OBJECT_ALPHA, count: 4},
        ],
        layers: {
            mask: [
                " □□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                " □□□□□□□ ",

            ],
            // WIZARD
            gems: [
                "RGBBPYRPR",
                "GRRGRBPYR",
                "BBαRGRαPR",
                "PRGBBRYRP",
                "YPαRBGαBY",
                "PPPYPRRGB",
            ],
            special: [[
                "         ",
                "         ",
                "         ",
                "■■■■■■■■■",
                "         ",
                "         ",
            ],
            ]
        }
    };

    wayPoints[24] = {
        id: 24, turns: 20, score1: 500, score2: 2500, score3: 5500,
        goals: [
            {id: DataObjects.OBJECT_RED, count: 20},
        ],
        layers: {
            mask: [
                "□□□□ □□□□",
                "□□□□ □□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□ □□□□",
                "□□□□ □□□□",
            ],
        }
    };

    wayPoints[25] = {
        id: 25, turns: 31 - 8, score1: 500, score2: 1500, score3: 5000,
        goals: [
            {id: DataObjects.OBJECT_YELLOW, count: 30},
            {id: DataObjects.OBJECT_PURPLE, count: 30},
            {id: DataObjects.OBJECT_BETA, count: 30},
        ],
        layers: {
            mask: [
                "□□□   □□□",
                "□□□   □□□",
                "□□□   □□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",

            ],
            special: [[
                "ββ     ββ",
                "         ",
                "β       β",
                "ββββ ββββ",
                "ββββ ββββ",
                "ββββ ββββ",
                "■■■■■■■■■  ",
            ], [
                "        ",
                "        ",
                "        ",
                "╱╲╱╲╱╲╱╲",
                "",
                "",
                "",
            ],]
        }
    };

    wayPoints[26] = {
        id: 26, turns: 30, score1: 500, score2: 5500, score3: 6000,
        goals: [
            {id: DataObjects.OBJECT_BETA, count: 28},
            {id: DataObjects.OBJECT_ALPHA, count: 8},
        ],
        layers: {
            mask: [
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",

            ],
            special: [[
                "         ",
                "  αα αα  ",
                " βββββββ ",
                " βββββββ ",
                "   ααα   ",
                " βββββββ ",
                " βββββββ ",
                "    α    ",
                "         ",
                "         ",
                //"* ╱ ╲ ■ □ ᥩ α β γ ",
            ], [
                "          ",
                "          ",
                " ╱╲╱╲╱╲╱ ",
                "         ",
                "          ",
                " ╱╲╱╲╱╲╱ ",
                "         ",
                "          ",
            ],]
        }
    };

    wayPoints[27] = {
        id: 27, turns: 8, score1: 500, score2: 2500, score3: 5500,
        goals: [
            {id: DataObjects.OBJECT_BOX, count: 12},
        ],
        layers: {
            mask: [
                "  □□□□",
                " □□□□□",
                "□□□□□□",
                "□□□□□□",
                "□□□□□ ",
                "□□□□  ",
            ],
            special: [[
                "      ",
                " ■■■■ ",
                " ■  ■ ",
                " ■  ■ ",
                " ■■■■ ",
                "  ",
                /** α β γ ■ ╱ ╲ Ξ ᥩ ‖ */
            ],
            ]
        }
    };

    wayPoints[28] = {
        id: 28, turns: 18, score1: 500, score2: 2500, score3: 5500,
        goals: [
            {id: DataObjects.OBJECT_BOX, count: 10},
        ],
        layers: {
            mask: [
                "  □□□□□ ",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "  □□□□□  ",

            ],
            special: [[
                "        ",
                "        ",
                "■■     ■■",
                "■       ■",
                "■■     ■■",
                "        ",
                /** α β γ ■ ╱ ╲ Ξ ᥩ ‖ */
            ],
            ]
        }
    };

    wayPoints[29] = {
        id: 29, turns: 15, score1: 500, score2: 2500, score3: 5500,
        goals: [
            {id: DataObjects.OBJECT_BOX, count: 20},
        ], layers: {
            mask: [
                "□□ □□ □□",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                " □□□□□□",
                " □□□□□□",
            ],
            special: [[
                "□□ □□ □□",
                "■■■■■■■■",
                "■□□□□□□■",
                "■■□□□□■■",
                " ■■■■■■ ",
                " □□□□□□ ",
                /** α β γ ■ ╱ ╲ Ξ ᥩ ‖ */
            ],
            ]
        }
    };

    wayPoints[30] = {
        id: 30, turns: 30, score1: 500, score2: 2500, score3: 5500,
        goals: [
            {id: DataObjects.OBJECT_BARREL, count: 2},
        ],
        layers: {
            mask: [
                "□□□□□□□□□",
                "□□ □□□□□□",
                "□□□□□□□□□",
                "□□ □□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
            ],
            special: [[
                "ᥩᥩ■■□□□□□",
                "□□ ■□□□□□",
                "□□■■□□□□□",
                "□□■■□□□□□",
                "■■■■□□□□□",
                "□□■■□□□□□",
                "□□■■□□□□□",
                /** α β γ ■ ╱ ╲ Ξ ᥩ ‖ */
            ],
            ]
        }
    };

    wayPoints[31] = {
        id: 31, turns: 31 - 8, score1: 500, score2: 1500, score3: 5000,
        goals: [
            {id: DataObjects.OBJECT_YELLOW, count: 30},
            {id: DataObjects.OBJECT_PURPLE, count: 30},
            {id: DataObjects.OBJECT_BETA, count: 30},
        ],
        layers: {
            mask: [
                "□□□   □□□",
                "□□□   □□□",
                "□□□   □□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",

            ],
            special: [[
                "ββ     ββ",
                "         ",
                "β       β",
                "ββββ ββββ",
                "ββββ ββββ",
                "ββββ ββββ",
                "■■■■■■■■■  ",
            ], [
                "        ",
                "        ",
                "        ",
                "╱╲╱╲╱╲╱╲",
                "",
                "",
                "",
            ],]
        }
    };

    wayPoints[32] = {
        id: 32, turns: 10, score1: 100, score2: 200, score3: 400,
        goals: [
            {id: DataObjects.OBJECT_BARREL, count: 2},
        ],
        //WIZARD
        layers: {
            mask: [
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",

            ],
            gems: [
                "PYRBGRBPY",
                "GRBPYBRGP",
                "RPGYPYBRP",
                "PGPBPYPYG",
                "GRPPYGBRP",
                "RPGRBPYPP",
                "BGPBPYGBR",
            ],
            special: [[
                "        ",
                "  ᥩ  ᥩ  ",
                "        ",
                "        ",
                "        ",
                "        ",
                //"* ╱ ╲ ■ □ ᥩ α β γ ",
            ],
            ]
        }
    };

    wayPoints[33] = {
        id: 33, turns: 35, score1: 500, score2: 8500, score3: 9000,
        goals: [
            {id: DataObjects.OBJECT_BETA, count: 9},
            {id: DataObjects.OBJECT_GOLD, count: 15},
        ],
        layers: {
            mask: [
                "        □",
                "       □□",
                "      □□□",
                "     □□□□",
                "    □□□□□",
                "   □□□□□□",
                "  □□□□□□□",
                " □□□□□□□□",
                "□□□□□□□□□",

            ],
            special: [[
                "          ",
                "          ",
                "          ",
                "          ",
                "    ββββ■",
                "    βββ■■",
                "    ββ■■■",
                "    β■■■■",
                "    ■■■■■",
                //"* ╱ ╲ ■ □ ᥩ α β γ ",
            ], [
                "          ",
                "          ",
                "          ",
                "          ",
                "        $",
                "       $$",
                "      $$$",
                "     $$$$",
                "    $$$$$",
            ]]
        }
    };

    wayPoints[34] = {
        id: 34, turns: 28 - 12, score1: 500, score2: 2500, score3: 2700,
        goals: [
            {id: DataObjects.OBJECT_BETA, count: 10},
            {id: DataObjects.OBJECT_ALPHA, count: 5},
        ],
        layers: {
            mask: [
                " □□□□□□□ ",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□ □□□□",
                "□□□□□□□□□",

            ],
            special: [[
                "  βββββ  ",
                "         ",
                "  ααααα  ",
                "         ",
                "         ",
                "  βββββ  ",
                //"* ╱ ╲ ■ □ ᥩ α β γ ",
            ],
            ]
        }
    };

    wayPoints[35] = {
        id: 35, turns: 30, score1: 1000, score2: 1500, score3: 2700,
        goals: [
            {id: DataObjects.OBJECT_BARREL, count: 4},
            {id: DataObjects.OBJECT_ALPHA, count: 6},
        ],
        layers: {
            mask: [
                " □□□□□□□ ",
                "□□□□ □□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                " □□□□□□□ ",
                //" □□□□□□□ ",
                //"□□□□□□□□□",

            ],
            special: [[
                " ᥩ ᥩ ᥩ ᥩ ",
                "α       α",
                "         ",
                "α       α",
                "         ",
                "α       α",
                //"* ╱ ╲ ■ □ ᥩ α β γ ",
            ],]
        }
    };

    wayPoints[36] = {
        id: 36, turns: 24 - 8, score1: 500, score2: 1500, score3: 2500,
        goals: [
            {id: DataObjects.OBJECT_BARREL, count: 2},
        ],
        layers: {
            mask: [
                "  □   □  ",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "  □□□□□  ",

            ],
            special: [[
                "  ᥩ   ᥩ  ",
                "         ",
                "■■■■■■■■■",
                "         ",
                "         ",
                "         ",
                "         ",
                "         ",
                //"* ╱ ╲ ■ □ ᥩ α β γ ",
            ],]
        }
    };

    wayPoints[37] = {
        id: 37, turns: 21, score1: 500, score2: 1000, score3: 1500,
        goals: [
            {id: DataObjects.OBJECT_ALPHA, count: 2},
            {id: DataObjects.OBJECT_BARREL, count: 4},
        ],
        layers: {
            mask: [
                "  □   □  ",
                "  □□□□□  ",
                " □□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",

            ],
            special: [[
                "  ᥩ   ᥩ  ",
                "  ᥩ   ᥩ  ",
                "  α   α  ",
                "         ",
                "         ",
                "         ",
                "         ",
                //"* ╱ ╲ ■ □ ᥩ α β γ ",

            ],
            ]
        }
    };

    wayPoints[38] = {
        id: 38, turns: 40, score1: 500, score2: 2500, score3: 5500,
        goals: [
            {id: DataObjects.OBJECT_BOX, count: 34},
        ],
        layers: {
            mask: [
                " □□□□□□□ ",
                "□□□□□□□□□",
                "□□□□ □□□□",
                "□□□   □□□",
                "□□□□ □□□□",
                "□□□□□□□□□",
                " □□□□□□□ ",

            ],
            special: [[
                " ■■■■■■■ ",
                "■□□□■□□□■",
                "■□□■ ■□□■",
                "■■■   ■■■",
                "■□□■ ■□□■",
                "■□□□■□□□■",
                " ■■■■■■■ ",
                /** α β γ ■ ╱ ╲ Ξ ᥩ ‖ */
            ],
            ]
        }
    };

    wayPoints[39] = {
        id: 39, turns: 30, score1: 500, score2: 2500, score3: 5500,
        goals: [
            {id: DataObjects.OBJECT_BARREL, count: 1},
        ],
        layers: {
            mask: [
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                //"□□□□□□□□□",
            ],
            special: [[
                "□□□ᥩ□□□□□",
                "■□□□□□□□□",
                "■■□□□□□□□",
                "■■■□□□□□□",
                "■■■■□□□□□",
                "■■■■■  ",
                "■■■■■■ ",
                "■■■■■■ ",
                "■■■■■■ ",
                "■■■■■■ ",
                /** α β γ ■ ╱ ╲ Ξ ᥩ ‖ */
            ], [
                // "□□□□□□□□□",
                //"X□□□□□□□□",
                //"XX□□□□□□□",
                //"XXX□□□□□□",
                //"XXXX□□□□□",
                //"XXXXX    ",
                //"XXXXXX   ",
                //"XXXXXX   ",
                //"XXXXXX   ",
            ]]
        }
    };

    wayPoints[40] = {
        id: 40, turns: 20, score1: 500, score2: 2500, score3: 3000,
        goals: [
            {id: DataObjects.OBJECT_BETA, count: 18},
            {id: DataObjects.OBJECT_ALPHA, count: 2},],
        layers: {
            mask: [
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
            ], special: [[
                "          ",
                "βββββββββ ",
                "   ααα    ",
                "βββββββββ ",
                "          ",
                //"* ╱ ╲ ■ □ ᥩ α β γ ",
            ], [
                "          ",
                " ╱╲╱╲╱╲╱╲╱ ",
                "           ",
                " ╲╱╲╱╲╱╲╱╲ ",
                "          ",
            ],]
        }
    };

    wayPoints[41] = {
        id: 41, turns: 20, score1: 500, score2: 2500, score3: 2200,
        goals: [
            {id: DataObjects.OBJECT_BARREL, count: 2},
        ],
        layers: {
            mask: [
                "",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
            ],
            //WIZARD BLOCKS
            gems: [
                "RGBYPBGBP",
                "GBYPBGBPY",
                "YPYGRGRGB",
                "GGYPGPBPY",
                "RGBBPRGBP",
                "GBYBRGBPY",
                "RGBYGRGBP",
                "GRGBYPRGB",
            ],
            special: [[
                "        ",
                "        ",
                "        ",
                "  ᥩ   ᥩ  ",
                "         ",
                "         ",
                "         ",
                "  ‖   ‖  ",
                "        ",
                /** α β γ ■ ╱ ╲ Ξ ᥩ ‖ */
            ],
            ]
        }
    };

    wayPoints[42] = {
        id: 42, turns: 25, score1: 500, score2: 2500, score3: 3300,
        goals: [
            {id: DataObjects.OBJECT_BARREL, count: 3},
        ],
        layers: {
            mask: [
                " □  □  □ ",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
            ],
            /* gems: [
             "RGBYPRGBY",
             "GRBBYPRGB",
             "BRGBYPRGB",
             "YGBGBYPRG",
             "PRRYYBYPB",
             "RGBGBYPRG",
             "GPYRGBYPR",
             "BBRRGBYPR",
             ],*/
            special: [[
                " ᥩ  ᥩ  ᥩ ",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□ ‖□□ ‖□",
                "□□□□□□□□□",
                "       ",
                /** α β γ ■ ╱ ╲ Ξ ᥩ ‖ */
            ], [
                "         ",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□ *□□□* ",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "       ",
            ]]
        }
    };

    wayPoints[43] = {
        id: 43, turns: 25, score1: 500, score2: 2500, score3: 2980,
        goals: [
            {id: DataObjects.OBJECT_BARREL, count: 2},
        ],
        layers: {
            mask: [
                "  □    □  ",
                " □□□□□□□□",
                //  "□□□□□□□□",
                " □□□□□□□□",
                " □□□□□□□□",
                " □□□□□□□□",
                " □□□□□□□□",
                " □□□□□□□□",
                "□□□□□□□□□□  ",
            ], special: [[
                "  ᥩ    ᥩ",
                "",
                //"□□□□□□□□",
                "",
                " ‖□‖  ‖□‖",
                "",
                "",
                "",
                /** α β γ ■ ╱ ╲ Ξ ᥩ ‖ */
            ], ["        ",
                "",
                //     "□□□□□□□□",
                "",
                "",
                " * *  * *",
                "",
                "",
                "",
            ]]
        }
    }

    wayPoints[44] = {
        id: 44, turns: 30, score1: 500, score2: 2500, score3: 2400,
        goals: [
            {id: DataObjects.OBJECT_BARREL, count: 5},
        ],
        layers: {
            mask: [
                "  □□□□□  ",
                "  □□□□□ ",
                "□□□ □ □□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
            ], special: [[
                "  ᥩᥩᥩᥩᥩ  ",
                "  □□□□□ ",
                "□□□ □ □□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                /** α β γ ■ ╱ ╲ Ξ ᥩ ‖ */
            ],]
        }
    };

    wayPoints[45] = {
        id: 45, turns: 15, score1: 500, score2: 2500, score3: 1000,
        goals: [
            {id: DataObjects.OBJECT_BARREL, count: 2},
        ],
        layers: {
            mask: [
                " □□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
            ],
            special: [[
                " ᥩ□□□□ᥩ",
                "‖      ‖",
                "*      *",
                "‖      ‖",
                "*      *",
                "‖      ‖",
                /** α β γ ■ ╱ ╲ Ξ ᥩ ‖ */
            ],]
        }
    };

    wayPoints[46] = {
        id: 46, turns: 5, score1: 500, score2: 2500, score3: 200,
        goals: [
            {id: DataObjects.OBJECT_SAND, count: 6},
        ],
        layers: {
            mask: [
                "□□□□□□",
                "□□□□□□",
                "□□□□□□",
                "□□□□□□",
                "□□□□□□",
                "□□□□□□",
            ], gems: [
                "RYGSGR",
                "YRSBYP",
                "RGRSBY",
                "GRRBSR",
                "YPYSBY",
                "PRSYRG",
            ],
        }
    };

    wayPoints[47] = {
        id: 47, turns: 40, score1: 500, score2: 2500, score3: 3300,
        goals: [
            {id: DataObjects.OBJECT_SAND, count: 9},
            {id: DataObjects.OBJECT_GREEN, count: 25},
        ],
        layers: {
            mask: [
                " □□□ □□□ ",
                " □□□ □□□ ",
                " □□□□□□□ ",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "  □□□□□  ",
            ],
            gems: [
                " PRS SPS ",
                " SBG RRP ",
                " BPSBGSG ",
                "YPRBRSPPY",
                "YPRGSYPSG",
                "YPGBRBPPY",
                //"PRBSPRGB",
                //"RBSBSGBP",
                "  GBRRG  ",
            ]
        }
    };

    wayPoints[48] = {
        id: 48, turns: 20, score1: 500, score2: 2500, score3: 1000,
        goals: [
            {id: DataObjects.OBJECT_RED, count: 18},
            {id: DataObjects.OBJECT_BLUE, count: 18},
        ],
        layers: {
            mask: [
                "  □   □  ",
                " □□□ □□□ ",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                " □□□□□□□ ",

            ],
            special: [[
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                /** α β γ ■ ╱ ╲ Ξ ᥩ ‖ */
            ],
            ]
        }
    };

    wayPoints[49] = {
        id: 49, turns: 30, score1: 500, score2: 2500, score3: 1200,
        goals: [
            {id: DataObjects.OBJECT_PURPLE, count: 20},
            {id: DataObjects.OBJECT_YELLOW, count: 20},
        ],
        //whites
        layers: {
            mask: [
                " □□□□□□ ",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□  □□□",
                "□□□  □□□",
                "□□□□□□□□",
                "□□□□□□□□",
                " □□□□□□",
            ], gems: [
                "????????",
                "S?S?S?S?",
                "????????",
                "S?S?S?S?",
                "????????",
                "S?S?S?S?",
                "????????",
                "S?S?S?S?",
                /** α β γ ■ ╱ ╲ Ξ ᥩ ‖ */
            ]
        }
    };

    wayPoints[50] = {
        id: 50, turns: 30, score1: 500, score2: 2500, score3: 4100,
        goals: [
            {id: DataObjects.OBJECT_SAND, count: 8},
            {id: DataObjects.OBJECT_BETA, count: 12},
            {id: DataObjects.OBJECT_BOX, count: 12},
        ],
        layers: {
            mask: [
                "   □□□□",
                "  □□□□□",
                " □□□□□□",
                "□□□□□□□",
                "□□□□□□ ",
                "□□□□□  ",
                "□□□□   ",
            ], special: [[
                "   □□□□",
                "  ■■■■□",
                " □■□□■□",
                "□□■□□■□",
                "□□■■■■ ",
                "□□□□□  ",
                "□□□□   ",
            ], [
                "   □□□□",
                "  □□□□□",
                " ββββ□□",
                "□β□□β□□",
                "□β□□β□ ",
                "□ββββ  ",
                "□□□□   ",
            ], [
                "   S□S□",
                "  □□S□□",
                " □□SS□□",
                "S□SSS□",
                "S□SS□□ ",
                "□S□□  ",
                "S□S□  ",
            ],
            ]
            /** α β γ ■ ╱ ╲ Ξ ᥩ ‖ */
        }
    };

    wayPoints[51] = {
        id: 51, turns: 10, score1: 500, score2: 2500, score3: 500,
        goals: [
            {id: DataObjects.OBJECT_GAMMA, count: 4},
        ],
        layers: {
            mask: [
                "□□□□□□",
                "□□□□□□",
                "□□□□□□",
                "□□□□□□",
                "□□□□□□",
                "□□□□□□",
            ], gems: [            //WIZARD GREEN-SPIDER-2
                "RGBRYP",
                "PYRBGY",
                "PYPPGP",
                "YGYYRP",
                "PPYRPG",
                "RGBGRP",
            ], special: [[
                "□□□□□□",
                "□□□□□□",
                "□□γγ□□",
                "□□γγ□□",
                "□□□□□□",
                "□□□□□□",
                /** α β γ ■ ╱ ╲ Ξ ᥩ ‖ */
            ],
            ]
        }
    };

    wayPoints[52] = {
        id: 52, turns: 40, score1: 500, score2: 2500, score3: 3100,
        goals: [
            {id: DataObjects.OBJECT_GAMMA, count: 14},
            {id: DataObjects.OBJECT_BARREL, count: 2},
        ],
        layers: {
            mask: [
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□   □□",
                "□□□□□□□",
                "□□□□□□□",
            ], special: [[
                "□□ᥩ□ᥩ□□",
                "□□‖□‖□□",
                "γγ*γ*γγ",
                "γ□   □γ",
                "γγγγγγγ",
                "□□□□□□□",
                /** α β γ ■ ╱ ╲ Ξ ᥩ ‖ */
            ],]
        }
    };

    wayPoints[53] = {
        id: 53, turns: 40, score1: 500, score2: 2500, score3: 5000,
        goals: [
            {id: DataObjects.OBJECT_GAMMA, count: 25},
            {id: DataObjects.OBJECT_BARREL, count: 4},
        ],
        layers: {
            mask: [
                " □ □ □ □ ",
                " □ □ □ □ ",
                " □ □ □ □ ",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "  □□□□□  ",
            ], special: [[
                " ᥩ ᥩ ᥩ ᥩ ",
                " □ □ □ □ ",
                " □ □ □ □ ",
                "□γγ□γ□γγ□",
                "□γγ□γ□γγ□",
                "□γγ□γ□γγ□",
                "□γγ□γ□γγ□",
                "  γγγγγ  ",
                /** α β γ ■ ╱ ╲ Ξ ᥩ ‖ */
            ],
            ]
        }
    };

    wayPoints[54] = {
        id: 54, turns: 25, score1: 500, score2: 2500, score3: 3000,
        goals: [
            {id: DataObjects.OBJECT_GAMMA, count: 20},
            {id: DataObjects.OBJECT_PURPLE, count: 20},
        ],
        layers: {
            mask: [
                "□□ □□□ □□",
                "□□ □□□ □□",
                "□□□□□□□□□",
                "□□□□□□□□□",
                "   □□□   ",
                "□□□□□□□□□",
            ], special: [[
                "□γ γγγ γ□",
                "□γ γγγ γ□",
                "□γ□γγγ□γ□",
                "□γ□γγγ□γ□",
                "   □□□   ",
                "□□□□□□□□□",
                /** α β γ ■ ╱ ╲ Ξ ᥩ ‖ */
            ],]
        }
    };

    this.getById = function (id) {
        return wayPoints[id];
    };

    this.getPointsByMapId = function (mapId) {
        let firstPointId, lastPointId, points;
        firstPointId = DataMap.getFirstPointId(mapId);
        lastPointId = DataMap.getLastPointId(mapId);

        points = [];
        for (let id = firstPointId; id <= lastPointId; id++) {
            points.push(this.getById(id));
        }
        return points;
    };

    this.getUsersInfo = function (mapId, userIds, callback) {
        let pointIds;
        pointIds = DataMap.getMapPointIds(mapId);
        DB.queryWhere(tableName, {
            pointId: [pointIds, DB.WHERE_IN],
            userId: [userIds, DB.WHERE_IN],
        }, function (rows, query) {
            for (let i in rows) {
                rows[i] = fromDBToData(rows[i]);
            }
            callback(rows || null, query);
        });
    };

    this.updateUsersPoints = function (userId, pointId, score, callback) {
        let query;
        query = "INSERT INTO users_points(userId, pointId, score) " +
            "VALUES (" + userId + "," + pointId + "," + score + ") " +
            "ON DUPLICATE KEY " +
            "UPDATE score = " + score;
        DB.query(query, callback);
    };

    this.getTopScore = function (userScore, pointId, fids, callback) {
        let query;
        query = "" +
            "SELECT * FROM users_points" +
            "   WHERE" +
            "       pointId = " + parseInt(pointId) +
            "   AND userId IN(" + fids.join(',') + ")" +
            "   AND score >= " + parseInt(userScore) +
            "   ORDER BY score DESC" +
            "   LIMIT 3";
        DB.query(query, function (rows) {
            callback(rows);
        });
    };

    this.getTopScoreUserPosition = function (userScore, pointId, fids, userId, callback) {
        let query;
        fids.push(userId);
        query = "" +
            "SELECT COUNT(*) as pos FROM users_points" +
            "   WHERE" +
            "       pointId = " + parseInt(pointId) +
            "   AND userId IN(" + fids.join(',') + ")" +
            "   AND score >= " + parseInt(userScore) +
            "   ORDER BY score DESC";
        DB.query(query, function (rows) {
            callback(rows[0].pos);
        });
    };

    this.getScore = function (pointId, userId, callback) {
        let query;
        query = "SELECT score FROM " +
            "   users_points " +
            "WHERE" +
            "       pointId = " + pointId +
            " AND   userId = " + userId;

        DB.query(query, function (rows) {
            callback(rows && rows[0] ? rows[0].score : 0);
        });
    }
};

/**
 * @type {DataPoints}
 */
DataPoints = new DataPoints;
