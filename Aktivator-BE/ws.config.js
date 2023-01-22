const redis_client = require("./redis.config");
const WebSocket = require("ws");

const WEB_SOCKET_PORT_CUSTOMER = 3400;
const serverCustomer = new WebSocket.Server({ port: WEB_SOCKET_PORT_CUSTOMER });
var redisCustomer = redis_client.duplicate();
redisCustomer.connect();

serverCustomer.on("connection", async function connection(ws) {
    ws.on("message", async function message(data) {
        let response = JSON.parse(data);

        if (response.init) {
            ws.id = response.id;
            ws.tag = response.tag;
        } else {
            let c;
            serverCustomer.clients.forEach(client => {
                if (client.id === response.id) {
                    c = client;
                    if (!client.tag.includes(response.tag))
                        client.tag.push(response.tag);
                }
            });

            if (!c) {
                ws.id = response.id;
                ws.tag = [response.tag];
            }
        }
    });
});

redisCustomer.SUBSCRIBE("tag:user", message => {
    let msg = JSON.parse(message);
    serverCustomer.clients.forEach(function each(client) {
        sendMessage(msg, client);
    });
});

const sendMessage = (message, client) => {
    for (let i = 0; i < message.tag.length; i++) {
        if (client.tag?.includes(message.tag[i])) {
            client.send(JSON.stringify(message));
            break;
        }
    }
};

module.exports = redis_client;
