DataPoints = function () {

    this.FIELD_MAX_WIDTH = 10;
    this.FIELD_MAX_HEIGHT = 10;

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
        id: 1,
        turns: 10,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_RED,
                count: 9
            }
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
            ],
            gems: [
                "RRGRR",
                "GBRBG",
                "RGBRG",

                "YRPRR",
                "BYBPB",
                "RPRBR",
                "YRBRB",
            ],
            special: [
                "*****",
            ],
        }
    };

    wayPoints[2] = {
        id: 2,
        turns: 15,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_PURPLE,
                count: 12
            }
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
            ],
            gems: [
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
            ],
            special: [[
                "********",
            ]],
        }
    };

    wayPoints[3] = {
        id: 3,
        turns: 8,
        score1: 100,
        score2: 200,
        score3: 600,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 12
            },
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

            ],
            gems: [
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
            ],
            special: [
                "********",
            ],
        },
    };

    wayPoints[4] = {
        id: 4,
        turns: 10,
        score1: 500,
        score2: 1500,
        score3: 2000,
        goals: [
            {
                id: DataObjects.OBJECT_TREASURES,
                count: 4
            }
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

            ],
            gems: [
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
            special: [[
                "********",
            ], [
                "",
                "",
                "",
                "",
                "",

                "      ",
                " $  $ ",
                "      ",
                " $  $ ",
                "      ",
            ]],
        },
    };

    wayPoints[5] = {
        id: 5,
        turns: 15,
        score1: 500,
        score2: 1000,
        score3: 2000,
        goals: [
            {
                id: DataObjects.OBJECT_TREASURES,
                count: 6
            }
        ],
        layers: {
            mask: [
                "      ",
                "      ",

                "□□□□□□",
                "□□□□□□",
                "□□□□□□",
                "□□□□□□",
                "□□□□□□",
                "□□□□□□",
                "□□□□□□",
            ],
            gems: [
                "GPRBGG",
                "GRPPBP",

                "BGBYPG",
                "RBYYGY",
                "RBYYGP",
                "PPRPRG",
                "BRGYRB",
                "RBYYPP",
                "GPRBGR",
            ],
            special: [
                "******",
                "      ",

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

    wayPoints[6] = {
        id: 6,
        turns: 18,
        score1: 1000,
        score2: 1500,
        score3: 8000,
        goals: [
            {
                id: DataObjects.OBJECT_TREASURES,
                count: 17
            }
        ],
        layers: {
            mask: [
                "",
                "",

                "",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
            ],
            gems: [
                "GPRBGGG",
                "GRPPBPG",

                "BGBYPGR",
                "RBYYGYG",
                "RBYYGPB",
                "PPRPRGP",
                "BRGYRBR",
                "RBYYPPY",
                "GPRBGRY",
                "RBYYPPY",
            ],
            special: [
                "*********",
                "      ",
                "      ",

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

    wayPoints[7] = {
        id: 7,
        turns: 15,
        score1: 100,
        score2: 1000,
        score3: 5000,
        goals: [
            {
                id: DataObjects.OBJECT_TREASURES,
                count: 12
            },
            {
                id: DataObjects.OBJECT_RED,
                count: 10
            },
            {
                id: DataObjects.OBJECT_GREEN,
                count: 10
            }
        ],
        layers: {
            mask: [
                "",
                "",
                "",

                "  □□□□  ",
                " □□□□□□ ",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "  □□□□  ",
                "  □□□□  ",
            ],
            gems: [
                "GPRBGGGR",
                "GRPPBPGB",
                "BGBYPGRG",

                "BRGYRBRG",
                "RBYYPPYB",
                "RBYYGPBY",
                "PPRPRGPG",
                "GPRBGRYR",
                "RBYYPPYG",
                "RBYYGYGP",
            ],
            special: [
                "*********",
                "",
                "",

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

    wayPoints[8] = {
        id: 8,
        turns: 25,
        score1: 100,
        score2: 3000,
        score3: 5000,
        goals: [
            {
                id: DataObjects.OBJECT_TREASURES,
                count: 9
            },
            {
                id: DataObjects.OBJECT_RED,
                count: 33
            }
        ],
        layers: {
            mask: [
                "",
                "",
                "",

                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
            ],
            gems: [
                "GPRBGGGR",
                "GRPPBPGB",
                "BGBYPGRG",

                "BRBYYPPY",
                "BRGYRBRG",
                "RBYGGPBY",
                "PPRPRGPG",
                "GPRBGRYR",
                "RBYYPPYG",
                "RBYYGYGP",
            ],
            special: [
                "*********",
                "",


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

    wayPoints[9] = {
        id: 9,
        turns: 25,
        score1: 1000,
        score2: 2000,
        score3: 3500,
        goals: [
            {
                id: DataObjects.OBJECT_TREASURES,
                count: 8
            }
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
            ],
            gems: [
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
                "*********"
            ], [
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
            ],
            ]
        }
    };

    wayPoints[10] = {
        id: 10,
        turns: 25,
        score1: 1000,
        score2: 2000,
        score3: 2500,
        goals: [
            {
                id: DataObjects.OBJECT_TREASURES,
                count: 4
            },
            {
                id: DataObjects.OBJECT_RED,
                count: 9
            },
        ],
        layers: {
            mask: [
                "        ",
                "        ",

                "□     □ ",
                "□     □ ",
                "□□□□□□□ ",
                "□□□□□□□ ",
                "□ □□□ □ ",
                "□ □□□ □ ",
                "□ □□□ □ ",
                "□□□□□□□ ",
            ],
            gems: [
                "GBRPYPY",
                "GPBRPBG",

                "RRPRYPB",
                "BGRYPRR",
                "YGYGYPG",
                "BPPYRPB",
                "GBRBRBR",
                "PPGRBPY",
                "GBRBRBP",
                "GBRBRBP",
            ],
            special: [[
                "*********"
            ], [
                "",
                "",

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

                "",
                "",
                "",
                "$ $ $ $",
                " ",
                "",
                "",
            ],
            ]
        }
    };

    wayPoints[11] = {
        id: 11,
        turns: 40,
        score1: 500,
        score2: 1500,
        score3: 2000,
        goals: [
            {
                id: DataObjects.OBJECT_BLUE,
                count: 40
            },
            {
                id: DataObjects.OBJECT_RED,
                count: 40
            },
            {
                id: DataObjects.OBJECT_YELLOW,
                count: 40
            }
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
            gems: [
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
                "*********"
            ], [
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
            ],
            ]
        }
    };

    wayPoints[12] = {
        id: 12,
        turns: 15,
        score1: 100,
        score2: 500,
        score3: 800,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN_SPIDER,
                count: 4
            }
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
            ],
            gems: [
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
                "*********"
            ], [
                "",
                "",

                "",
                " ᴥ ᴥ",
                "",
                " ᴥ ᴥ",
                "",
                "",
            ],
            ]
        }
    };

    wayPoints[13] = {
        id: 13,
        turns: 15,
        score1: 100,
        score2: 1000,
        score3: 1500,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN_SPIDER,
                count: 8
            }
        ],
        layers: {
            mask: [
                "",
                "",

                "□ □ □ □",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□□□□□□□",
                "□ □ □ □",
            ],
            gems: [
                "GBRPYPY",
                "GPBRPBG",

                "GRGYGPG",
                "PPBRBPY",
                "GRPRYPG",
                "YPYGPYB",
                "GRPRYPG",
                "BGRYPRR",
                "GBGBGBG",
            ],
            special: [[
                "*********"
            ], [
                "",
                "",

                "ᴥ ᴥ ᴥ ᴥ",
                "",
                "",
                "",
                "",
                "",
                "ᴥ ᴥ ᴥ ᴥ",
            ],
            ]
        }
    };

    wayPoints[14] = {
        id: 14,
        turns: 20,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 14
            },
            {
                id: DataObjects.OBJECT_RED,
                count: 12
            }
        ],
        layers: {
            mask: [
                "        ",
                "  □□□□  ",
                "  □□□□  ",
                " □□□□□□ ",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□  □□□",
            ],
            gems: [
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
            ],
            special: [
                "********",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
            ],
        }
    };

    wayPoints[15] = {
        id: 15,
        turns: 20,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_YELLOW,
                count: 12
            }
        ],
        layers: {
            mask: [
                "        ",
                "        ",
                "        ",
                " □□□□□□ ",
                " □□□□□□ ",
                " □□□□□□ ",
                " □□□□□□ ",
                " □□□□□□ ",
                " □□□□□□ ",
            ],
            gems: [
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
            ],
            special: [
                "********",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
            ],
        }
    };

    wayPoints[16] = {
        id: 16,
        turns: 25,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 12
            },
            {
                id: DataObjects.OBJECT_RED,
                count: 18
            },
            {
                id: DataObjects.OBJECT_YELLOW,
                count: 8
            },
        ],
        layers: {
            mask: [
                "        ",
                " □□□□□□ ",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                " □□□□□□ ",
                "        ",
                "        ",
            ],
            gems: [
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
            ],
            special: [
                "********",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
            ],
        }
    };

    wayPoints[17] = {
        id: 17,
        turns: 28,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 18
            },
            {
                id: DataObjects.OBJECT_RED,
                count: 18
            },
            {
                id: DataObjects.OBJECT_YELLOW,
                count: 18
            },
        ],
        layers: {
            mask: [
                "        ",
                " □□  □□ ",
                " □□□□□□ ",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                " □□□□□□ ",
                "  □□□□  ",
            ],
            gems: [
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
            ],
            special: [
                "********",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
            ],
        }
    };

    wayPoints[18] = {
        id: 18,
        turns: 24,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 14
            }
        ],
        layers: {
            mask: [
                "        ",
                "□□□  □□□",
                "□□□  □□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□  □□□",
                "□□□  □□□",
            ],
            gems: [
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
            ],
            special: [
                "********",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
            ],
        }
    };

    wayPoints[19] = {
        id: 19,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        layers: {
            mask: [
                "        ",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
            ],
            gems: [
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
            ],
            special: [
                "********",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
            ],
        },
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 10
            }
        ],
    };

    wayPoints[20] = {
        id: 20,
        turns: 15,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 3
            },
            {
                id: DataObjects.OBJECT_YELLOW,
                count: 3
            },
            {
                id: DataObjects.OBJECT_PURPLE,
                count: 3
            }
        ],
        layers: {
            mask: [
                "     ",
                " □□□ ",
                "□□□□□",
                "□□□□□",
                "□□□□□",
                " □□□ "
            ],
            gems: [
                "RR□□□",
                "□□R□□",
                "RGBYP",
                "?????",
                "□□□□□",
                " □□□ ",
            ],
            special: [
                " *** ",
                "*   *",
                "     ",
                "     ",
                "     ",
                "     ",
            ],
        }
    };

    wayPoints[21] = {
        id: 21,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 18
            },
            {
                id: DataObjects.OBJECT_RED,
                count: 18
            },
            {
                id: DataObjects.OBJECT_YELLOW,
                count: 18
            },
        ],
        layers: {
            mask: [
                "        ",
                " □□  □□ ",
                " □□□□□□ ",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                " □□□□□□ ",
                "  □□□□  ",
            ],
            gems: [
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
            ],
            special: [
                "********",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
            ],
        }
    };

    wayPoints[22] = {
        id: 22,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 18
            },
            {
                id: DataObjects.OBJECT_RED,
                count: 18
            },
            {
                id: DataObjects.OBJECT_YELLOW,
                count: 18
            },
        ],
        layers: {
            mask: [
                "        ",
                " □□  □□ ",
                " □□□□□□ ",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                " □□□□□□ ",
                "  □□□□  ",
            ],
            gems: [
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
            ],
            special: [
                "********",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
            ],
        }
    };

    wayPoints[23] = {
        id: 23,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 18
            },
            {
                id: DataObjects.OBJECT_RED,
                count: 18
            },
            {
                id: DataObjects.OBJECT_YELLOW,
                count: 18
            },
        ],
        layers: {
            mask: [
                "        ",
                " □□  □□ ",
                " □□□□□□ ",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                " □□□□□□ ",
                "  □□□□  ",
            ],
            gems: [
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
            ],
            special: [
                "********",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
            ],
        }
    };

    wayPoints[24] = {
        id: 24,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 18
            },
            {
                id: DataObjects.OBJECT_RED,
                count: 18
            },
            {
                id: DataObjects.OBJECT_YELLOW,
                count: 18
            },
        ],
        layers: {
            mask: [
                "        ",
                " □□  □□ ",
                " □□□□□□ ",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                " □□□□□□ ",
                "  □□□□  ",
            ],
            gems: [
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
            ],
            special: [
                "********",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
            ],
        }
    };

    wayPoints[25] = {
        id: 25,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 18
            },
            {
                id: DataObjects.OBJECT_RED,
                count: 18
            },
            {
                id: DataObjects.OBJECT_YELLOW,
                count: 18
            },
        ],
        layers: {
            mask: [
                "        ",
                " □□  □□ ",
                " □□□□□□ ",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                " □□□□□□ ",
                "  □□□□  ",
            ],
            gems: [
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
            ],
            special: [
                "********",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
            ],
        }
    };

    wayPoints[26] = {
        id: 26,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 18
            },
            {
                id: DataObjects.OBJECT_RED,
                count: 18
            },
            {
                id: DataObjects.OBJECT_YELLOW,
                count: 18
            },
        ],
        layers: {
            mask: [
                "        ",
                " □□  □□ ",
                " □□□□□□ ",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                " □□□□□□ ",
                "  □□□□  ",
            ],
            gems: [
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
            ],
            special: [
                "********",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
            ],
        }
    };

    wayPoints[27] = {
        id: 27,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 18
            },
            {
                id: DataObjects.OBJECT_RED,
                count: 18
            },
            {
                id: DataObjects.OBJECT_YELLOW,
                count: 18
            },
        ],
        layers: {
            mask: [
                "□□□       ",
                "□□□       ",
                "□□□       ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
            gems: [
                "R?R?????",
                "?R??????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
            ],
            special: [
                "********",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
                "        ",
            ],
        }
    };

    wayPoints[28] = {
        id: 28,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 18
            },
            {
                id: DataObjects.OBJECT_RED,
                count: 18
            },
            {
                id: DataObjects.OBJECT_YELLOW,
                count: 18
            },
        ],
        layers: {
            mask: [
                "        ",
                " □□  □□ ",
                " □□□□□□ ",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                "□□□□□□□□",
                " □□□□□□ ",
                "  □□□□  ",
            ],
            gems: [
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
                "????????",
            ],
            special: [
                "********",
                "        ",
                "        ",
                "        ",
                "   ⭤⭥   ",
                "        ",
                "     ⯐ ",
                "        ",
                "        ",
            ],
        }
    };

    wayPoints[29] = {
        id: 29,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        },
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
    };

    wayPoints[30] = {
        id: 30,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        },
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
    };

    wayPoints[31] = {
        id: 31,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        },
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
    };

    wayPoints[32] = {
        id: 32,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        },
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
    };

    wayPoints[33] = {
        id: 33,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        },
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
    };

    wayPoints[34] = {
        id: 34,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        },
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
    };

    wayPoints[35] = {
        id: 35,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        },
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
    };

    wayPoints[36] = {
        id: 36,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        },
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
    };

    wayPoints[37] = {
        id: 37,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        },
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
    };

    wayPoints[38] = {
        id: 38,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        },
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
    };

    wayPoints[39] = {
        id: 39,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        },
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
    };

    wayPoints[40] = {
        id: 40,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        },
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
    };

    wayPoints[41] = {
        id: 41,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        },
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
    };

    wayPoints[42] = {
        id: 42,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        },
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
    };

    wayPoints[43] = {
        id: 43,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        },
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
    };

    wayPoints[44] = {
        id: 44,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        },
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
    };

    wayPoints[45] = {
        id: 45,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        },
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
    };

    wayPoints[46] = {
        id: 46,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        },
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
    };

    wayPoints[47] = {
        id: 47,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        },
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
    };

    wayPoints[48] = {
        id: 48,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        },
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
    };

    wayPoints[49] = {
        id: 49,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        },
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
    };

    wayPoints[50] = {
        id: 50,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        }
    };

    wayPoints[51] = {
        id: 51,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        }
    };

    wayPoints[52] = {
        id: 52,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        }
    };

    wayPoints[53] = {
        id: 53,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        }
    };

    wayPoints[54] = {
        id: 54,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        }
    };

    wayPoints[55] = {
        id: 55,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        }
    };

    wayPoints[56] = {
        id: 56,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        }
    };

    wayPoints[57] = {
        id: 57,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        }
    };

    wayPoints[58] = {
        id: 58,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        }
    };

    wayPoints[59] = {
        id: 59,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        }
    };

    wayPoints[60] = {
        id: 60,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
        }
    };

    wayPoints[61] = {
        id: 61,
        turns: 30,
        score1: 100,
        score2: 200,
        score3: 300,
        goals: [
            {
                id: DataObjects.OBJECT_GREEN,
                count: 1
            }
        ],
        layers: {
            mask: [
                "          ",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□■■□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□■",
                "□□□□□□□□□□",
            ],
            gems: [
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                " □□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
                "□□□□□□□□□□",
            ],
            special: [
                "**********",
                "          ",
                "*         ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
                "          ",
            ],
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
};

DataPoints = new DataPoints;
