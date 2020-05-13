/**
 * Компонент для работы с базой данных.
 */

/**
 * Подключаем nodeJS модули.
 */
let MYSQL = require('mysql');

DB = function () {
    let self = this;

    /**
     * Cоединение mysql.
     * @type {Connection}
     */
    let connection = null;

    /**
     * Статус соединения.
     * @type {boolean}
     */
    let isConnected = false;

    /**
     * Условие: эквивалентен.
     * @type {number}
     */
    this.WHERE_EQUAL = 1;

    /**
     * Условие: не эквивалентен.
     * @type {number}
     */
    this.WHERE_NOT_EQUAL = 2;

    /**
     * Условие: входит в множество.
     * @type {number}
     */
    this.WHERE_IN = 3;

    /**
     * Ппроизведем коннект к БД, согласно конфигурации.
     */
    this.init = function (afterInitCallback) {
        let connectionData;
        connectionData = {
            host: Config.DB.host,
            user: Config.DB.username,
            password: Config.DB.password,
            database: Config.DB.database,
            charset: Config.DB.charset
        };
        connection = MYSQL.createConnection(connectionData);
        connection.connect(function (err) {
            if (err) {
                Logs.log("Cant connect to DB.", Logs.LEVEL_FATAL_ERROR, {err: err, connectionData: connectionData});
            }
            isConnected = true;
            Logs.log("Connect to DB successful.", Logs.LEVEL_NOTIFY);
            afterInitCallback();
        });
    };

    /**
     * Выполняет запрос к БД.
     * @param query {string} sql запрос
     * @param callback (rows)
     */
    this.query = function (query, callback) {
        connection.query(query, function (err, rows) {
            if (err) {
                Logs.log("Query error:" + query, Logs.LEVEL_ERROR, err);
            }
            if (callback) callback(rows, query);
        });
    };

    /**
     * Выполняет запрос к БД.
     * @param tableName {string} имя таблица.
     * @param where {object} параметры where
     * @param callback
     */
    this.queryWhere = function (tableName, where, callback) {
        let query = "", value, valueSource, condition;
        query += "SELECT * FROM " + tableName + " WHERE 1=1 ";
        for (let name in where) {
            valueSource = where[name][0];
            condition = where[name][1] ? where[name][1] : DB.WHERE_EQUAL;
            value = MYSQL.escape(valueSource);
            switch (condition) {
                case DB.WHERE_EQUAL:
                    query += " AND `" + name + "` = " + value;
                    break;
                case DB.WHERE_NOT_EQUAL:
                    query += " AND `" + name + "` != " + value;
                    break;
                case DB.WHERE_IN:
                    query += " AND `" + name + "` IN(" + value + ")";
                    break;
                default:
                    Logs.log("DB.queryWhere: unknown condition:" + condition, Logs.LEVEL_FATAL_ERROR);
                    break;
            }
        }
        DB.query(query, callback);
    };

    /**
     * Выполняет вставку в БД.
     * @param tableName {string} имя таблицы.
     * @param values {object} объект значений { fieldName: value }.
     * @param callback {function}.
     */
    this.insert = function (tableName, values, callback, fields, packFunctions, comment) {
        let query, value, fieldsSQL, valuesSQL;
        query = fieldsSQL = valuesSQL = '';
        if (comment) query += "/*" + comment + "*/";
        query += "INSERT INTO " + tableName;
        if (!fields) {
            fields = values;
        }
        for (let name in fields) {
            value = values[name];
            if (packFunctions && packFunctions[name]) {
                value = packFunctions[name](value);
            }
            value = MYSQL.escape(value);
            fieldsSQL += "`" + name + "`,";
            valuesSQL += value + ",";
        }
        query += "( " + fieldsSQL.substr(0, fieldsSQL.length - 1) + ")";
        query += "VALUES (" + valuesSQL.substr(0, valuesSQL.length - 1) + ")";
        DB.query(query, callback);
    };

    /**
     * Выполняет обновление в БД.
     * @param tableName {string} имя таблицы.
     * @param values {object} значения
     * @param callback {function}
     * @param fields
     * @param packFunctions
     */
    this.update = function (tableName, values, callback, fields, packFunctions) {
        let query, value, setSQL, valuesSQL;
        query = setSQL = valuesSQL = '';
        query += "UPDATE `" + tableName + "` SET ";
        if (!fields) {
            fields = values;
        }
        for (let name in fields) {
            value = values[name];
            if (packFunctions && packFunctions[name]) {
                value = packFunctions[name](value);
            }
            value = MYSQL.escape(value);
            setSQL += "`" + name + "` = " + value + ",";
        }
        query += setSQL.substr(0, setSQL.length - 1);
        query += " WHERE `id`=" + values.id;
        DB.query(query, callback);
    };

    /**
     * Экраннирование данных.
     * @param sourcevalue {*}
     * @returns {*}
     */
    this.escape = function (sourcevalue) {
        return MYSQL.escape(sourcevalue);
    };
};

/**
 * Статичный класс.
 * @type {DB}
 */
DB = new DB();

DB.depends = ['Logs'];