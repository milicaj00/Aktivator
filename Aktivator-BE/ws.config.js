const redis_client = require("./redis.config");
const WebSocket = require("ws");

const serverCustomer = new WebSocket.Server({
    port: process.env.WEB_SOCKET_PORT
});

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
                    if (!client.tag?.includes(response.tag)) {
                        if (client.tag) client.tag.push(response.tag);
                        else {
                            client.tag = [];
                            client.tag.push(response.tag);
                        }
                        client.send(
                            JSON.stringify({
                                message:
                                    "Uspesno ste zapratili tag: " + response.tag
                            })
                        );
                    } else {
                        client.send(
                            JSON.stringify({ message: "Vec pratite taj tag" })
                        );
                    }
                }
            });

            // console.log(response, c);
            if (!c) {
                ws.id = response.id;
                ws.tag = [response.tag];
            }
        }
    });
});

redisCustomer.SUBSCRIBE("tag:user", message => {
    let msg = JSON.parse(message);
    console.log(msg);
    console.log(serverCustomer.clients);
    serverCustomer.clients.forEach(function each(client) {
        sendMessage(msg, client);
    });
});

const sendMessage = (message, client) => {
    let send = false;
    for (let i = 0; i < message.tag.length && !send; i++) {
        console.log(client.tag);
        if (client.id != message.id && client.tag?.includes(message.tag[i])) {
            client.send(JSON.stringify(message));
            send = true;
        }
    }
};

module.exports = redis_client;
