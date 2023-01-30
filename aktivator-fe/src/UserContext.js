import React, { useEffect, useState } from "react";
// import useWebSocket, { ReadyState } from "react-use-websocket";
import { toast } from "react-toastify";
import axios from "axios";

const WS_URL = "ws://127.0.0.1:3400";
let init = true;
const UserContext = ({ children }) => {
    const notify = message => toast(message, { autoClose: 5000 });

    const u = JSON.parse(localStorage.getItem("user"));

    const ws = new WebSocket(WS_URL);

    const [data, setData] = useState("");

    useEffect(() => {
        if (u) {
            axios
                .get("http://localhost:3005/api/user/get-subs/" + u.id)
                .then(res => {
                    if (res.status === 200) {
                        setData(res.data.data);
                    }
                })
                .catch(err => {
                    console.log(err.response);
                });
        }
    }, []);

    ws.onopen = event => {
        if (u) {
            const msg = {
                id: u.id,
                tag: data,
                init: init
            };
            if (data && init) {
                ws.send(JSON.stringify(msg));
                init = false;
            }
        }
    };

    ws.onmessage = function (event) {
        const mess = JSON.parse(event.data);
        try {
            console.log({ mess });
            if (mess.naslov) {
                notify(
                    mess.message +
                        " " +
                        mess.naslov +
                        ", sa tagovima: " +
                        mess.tag
                );
            } else {
                notify(mess.message);
            }
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

    return <div>{children}</div>;
};

export default UserContext;
