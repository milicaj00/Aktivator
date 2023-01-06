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
            if (response.role == "Store") {
                ws.id = response.user_id;
                if (response.service) {
                    ws.service = response.service;
                }
            } else if (response.role == "Guest") {
                ws.id = response.user_id;
                // IncrementScan(response.user_id);
            }
            ws.role = response.role;
        }
    });
});
redisCustomer.SUBSCRIBE("app:customer", message => {
    let msg = JSON.parse(message);
    serverCustomer.clients.forEach(function each(client) {
        sendMessage(msg, client);
    });
});
const sendMessage = (message, client) => {
    if (
        client.id == message.destination ||
        (client.service == message.service_name && client.service)
    )
        client.send(JSON.stringify(message));
};
module.exports = redis_client;
