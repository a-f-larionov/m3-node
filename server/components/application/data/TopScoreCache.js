/**
 * @constructor
 * @type{TopScoreCache}
 */
TopScoreCache = function TopScoreCache() {

    this.get = function (userId, pointId, callback) {
        DB.query("SELECT * FROM " +
            "cache_top_score " +
            "WHERE " +
            "   userId = " + userId + " " +
            "AND pointId = " + pointId, function (rows) {
            if (!rows) return callback(undefined);
            callback(rows[0]);
        });
    };

    this.set = function (userId, pointId, out) {
        //cache[userId + '-' + pointId] = out;
        if (!out.place1Uid || !out.place2Uid || !out.place3Uid) {
            return;
        }

        DB.query("REPLACE INTO cache_top_score" +
            " (userId, pointId, place1Uid, place2Uid, place3Uid,pos)" +
            " values" +
            "(" +
            "" + userId + "," +
            "" + pointId + "," +
            "" + out.place1Uid + "," +
            "" + out.place2Uid + "," +
            "" + out.place3Uid + "," +
            "" + out.pos + "" +
            ")"
        );
    };

    this.flush = function (userId, pointId) {
        DB.query("DELETE FROM cache_top_score " +
            "WHERE " +
            "(" +
            "    place1Uid = " + userId +
            " OR place2Uid = " + userId +
            " OR place3Uid = " + userId +
            " )" +
            " AND pointId = " + pointId);
    }
};

TopScoreCache = new TopScoreCache();