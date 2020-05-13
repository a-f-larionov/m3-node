let HTTPS = require('https');
let URL = require('url');
var HttpsProxyAgent = require('https-proxy-agent');

/**
 * @see  https://50na50.net/ru/proxy/httplist
 * token: 1194574646:AAFn2QK8b_9gR-h6FI-M6a4DCeuGmkDgMro
 * получить id чта https://api.telegram.org/bot[BOT:TOKEN]/getChat?chat_id=@mychannelname
 * отправить сообщение https://api.telegram.org/bot[BOT_API_KEY]/sendMessage?chat_id=[MY_CHANNEL_NAME]&text=[MY_MESSAGE_TEXT]
 */
function exec() {
    let req, agent, endpoint, options;
    agent = new HttpsProxyAgent('http://82.119.170.106:8080');
    endpoint = "https://api.telegram.org/bot1194574646:AAFn2QK8b_9gR-h6FI-M6a4DCeuGmkDgMro/sendMessage?chat_id=@tri_base_log&text=msg";
    options = URL.parse(endpoint);
    options.agent = agent;

    req = HTTPS.get(options, function (res) {
        res.statusCode;
        res.statusMessage;
        res.on('data', function (data) {
            console.log(data.toString());
        });
        res.on('error', function (data) {
            console.log('err', data);
        });
        req.end();
    });
}

exec();