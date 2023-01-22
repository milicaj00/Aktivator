import React, { useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { toast } from "react-toastify";

const WS_URL = "ws://127.0.0.1:3400";

const UserContext = ({ children }) => {
    const notify = message => toast(message);

    const u = JSON.parse(localStorage.getItem("user"));

    const ws = new WebSocket(WS_URL);

    useEffect(() => {
        ws.onopen = event => {
            const msg = {
                id: u.id,
                tag: "sport",
                init: true
            };
            ws.send(JSON.stringify(msg));
        };
    }, []);

    ws.onmessage = function (event) {
        const mess = JSON.parse(event.data);
        try {
            console.log({ mess });
            notify(
                mess.message + " " + mess.naslov + ", sa tagovima: " + mess.tag
            );
        } catch (err) {
            console.log(err);
        }
    };

    // const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    //     WS_URL,
    //     {
    //         onOpen: () => {
    //             console.log("WebSocket connection established.");
    //         },
    //         //Will attempt to reconnect on all close events, such as server shutting down
    //         shouldReconnect: closeEvent => true
    //     }
    // );

    // //sendMessage: (message: string, keep: boolean = true) => void,

    // useEffect(() => {
    //     console.log("send");
    //     const msg = {
    //         id: u.id,
    //         tag: "sex"
    //     };
    //     //getWebSocket()?.send(JSON.stringify(msg));
    //      sendMessage(JSON.stringify(msg), true);
    // }, [getWebSocket]);

    return (
        <div>
            UserContext
            {children}
        </div>
    );
};

export default UserContext;
